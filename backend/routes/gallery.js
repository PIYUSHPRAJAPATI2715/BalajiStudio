const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sidhi-vinayak-events/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    transformation: [{ width: 1200, quality: 'auto', fetch_format: 'auto' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// @route   GET /api/gallery
// @desc    Get all gallery items (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/gallery/upload
// @desc    Upload image to Cloudinary & create gallery item
// @access  Private
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { title, category, featured, order } = req.body;

    const galleryItem = await Gallery.create({
      title: title || '',
      category: category || 'Other',
      imageUrl: req.file.path,
      cloudinaryPublicId: req.file.filename,
      featured: featured === 'true',
      order: parseInt(order) || 0,
    });

    res.status(201).json({ success: true, data: galleryItem });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

// @route   POST /api/gallery/url
// @desc    Add gallery item by URL (no upload)
// @access  Private
router.post('/url', protect, async (req, res) => {
  try {
    const { imageUrl, title, category, featured, order } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const galleryItem = await Gallery.create({
      imageUrl,
      title: title || '',
      category: category || 'Other',
      featured: featured || false,
      order: parseInt(order) || 0,
    });

    res.status(201).json({ success: true, data: galleryItem });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update gallery item
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery item (and from Cloudinary if applicable)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Gallery item not found' });

    // Delete from Cloudinary if it was uploaded there
    if (item.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(item.cloudinaryPublicId);
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
