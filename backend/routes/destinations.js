const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// POST /api/destinations  -> add a new entry
router.post('/', async (req, res) => {
  try {
    const { name, country, category, price, description, imageUrl } = req.body;

    const destination = new Destination({
      name,
      country,
      category,
      price,
      description,
      imageUrl,
    });

    const saved = await destination.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Invalid input', details: messages });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while saving the destination' });
  }
});

// GET /api/destinations -> list all, with optional filters
// Supported query params: country, category, minPrice, maxPrice, search
router.get('/', async (req, res) => {
  try {
    const { country, category, minPrice, maxPrice, search } = req.query;
    const query = {};

    //if (country) query.country = new RegExp(`^${country}$`, 'i');
    if (country) query.country = new RegExp(country, 'i');
    if (category) query.category = new RegExp(`^${category}$`, 'i');
    if (search) query.name = new RegExp(search, 'i');

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        const min = Number(minPrice);
        if (Number.isNaN(min) || min < 0) {
          return res.status(400).json({ error: 'minPrice must be a non-negative number' });
        }
        query.price.$gte = min;
      }
      if (maxPrice) {
        const max = Number(maxPrice);
        if (Number.isNaN(max) || max < 0) {
          return res.status(400).json({ error: 'maxPrice must be a non-negative number' });
        }
        query.price.$lte = max;
      }
    }

    const destinations = await Destination.find(query).sort({ createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while fetching destinations' });
  }
});

// GET /api/destinations/:id -> single entry
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  } catch (err) {
    // Invalid ObjectId format lands here
    res.status(400).json({ error: 'Invalid destination id' });
  }
});

// DELETE /api/destinations/:id -> remove an entry (nice-to-have)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid destination id' });
  }
});

module.exports = router;
