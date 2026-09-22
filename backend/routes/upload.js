const express = require('express');
const multer = require('multer');
const { bucket, logEvent } = require('../utils/gcpClients');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
});

// POST /api/upload  (multipart/form-data, field name "image")
// Uploads the file to Cloud Storage and returns its public URL.
router.post('/', upload.single('image'), async (req, res) => {
  if (!bucket) {
    return res.status(503).json({
      error: 'Image upload is not configured. Set GCS_BUCKET_NAME in the backend .env file.',
    });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No image file was provided' });
  }
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }

  const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '-');
  const blobName = `${Date.now()}-${safeName}`;
  const blob = bucket.file(blobName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: req.file.mimetype,
  });

  blobStream.on('error', async (err) => {
    await logEvent('ERROR', 'Image upload to Cloud Storage failed', { error: err.message });
    res.status(500).json({ error: 'Failed to upload image' });
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blobName}`;
    await logEvent('INFO', 'Image uploaded to Cloud Storage', { url: publicUrl });
    res.status(201).json({ url: publicUrl });
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;
