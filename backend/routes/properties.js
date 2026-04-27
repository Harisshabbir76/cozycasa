const express = require('express');
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/auth');
const Property = require('../models/Property');
const Category = require('../models/Category');
const { unsSlugify } = require('../utils/slugify');
const upload = require('../middleware/upload');

const router = express.Router();

// @desc Get all properties (with search/filter)
router.get('/', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, price, category, bedrooms, propertyType, search, sortBy, order } = req.query;
    const query = {};

    if (propertyType) {
      const targetName = unsSlugify(propertyType).toLowerCase().trim();
      const categoryDoc = await Category.findOne({ 
        name: { $regex: new RegExp(`^${targetName}$`, 'i') } 
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        return res.status(404).json({ message: 'Property type not found' });
      }
    }
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms) };
    
    // Handle separate minPrice/maxPrice from frontend filters
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {
        $gte: parseInt(req.query.minPrice || 0),
        $lte: parseInt(req.query.maxPrice || 9999999)
      };
    }
    if (price) {
      const [min, max] = price.split('-');
      query.price = { $gte: parseInt(min || 0), $lte: parseInt(max || 9999999) };
    }
    if (search) query.$text = { $search: search };

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price' && order === 'asc') sortOptions = { price: 1 };
    if (sortBy === 'price' && order === 'desc') sortOptions = { price: -1 };

    // Populate category to get category name
    const properties = await Property.find(query)
      .populate('category', 'name')
      .sort(sortOptions)
      .limit(40);
      
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('category', 'name');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Create a property
router.post('/', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    const propertyData = { ...req.body };
    
    // Handle amenities if sent as string
    if (propertyData.amenities && typeof propertyData.amenities === 'string') {
      propertyData.amenities = propertyData.amenities.split(',').map(a => a.trim());
    }
    
    // Handle images
    if (req.files) {
      propertyData.images = req.files.map(file => file.path);
    }
    
    const property = await Property.create(propertyData);
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Update a property
router.put('/:id', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const updateData = { ...req.body };

    // Parse price to number
    if (req.body.price !== undefined) {
      updateData.price = parseFloat(req.body.price) || property.price || 0;
    }

    // Resolve category: if string name, find by name (fallback for old frontend)
    if (updateData.category && typeof updateData.category === 'string' && !mongoose.Types.ObjectId.isValid(updateData.category)) {
      const category = await Category.findOne({ name: { $regex: new RegExp(`^${updateData.category}$`, 'i') } });
      if (!category) {
        return res.status(400).json({ message: `Category "${updateData.category}" not found` });
      }
      updateData.category = category._id;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      updateData.images = [...(updateData.images || []), ...newImages];
    }

    if (updateData.amenities && typeof updateData.amenities === 'string') {
      updateData.amenities = updateData.amenities.split(',').map(a => a.trim());
    }

    property = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('category', 'name');

    res.json(property);
  } catch (error) {
    console.error('Update property error:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation failed', errors: error.errors });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// @desc Delete a property
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;