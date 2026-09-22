require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const destinationRoutes = require('./routes/destinations');
const uploadRoutes = require('./routes/upload');
const { logEvent } = require('./utils/gcpClients');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Feature: Cloud Logging — record every request as a structured log entry
app.use((req, res, next) => {
  logEvent('INFO', `${req.method} ${req.originalUrl}`, { method: req.method, path: req.originalUrl });
  next();
});

// Gracefully handle malformed JSON bodies instead of crashing
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }
  next(err);
});

app.use('/api/destinations', destinationRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// In production, serve the built React app from the same server/URL
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Catch-all 404 for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Final safety net error handler — also logs to Cloud Logging
app.use((err, req, res, next) => {
  console.error(err);
  logEvent('ERROR', 'Unhandled server error', { error: err.message, path: req.originalUrl });
  res.status(500).json({ error: 'Unexpected server error' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
