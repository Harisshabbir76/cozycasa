const express = require('express');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Category = require('../models/Category');
const Property = require('../models/Property');

const router = express.Router();

// @desc Get all categories with property counts
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    
    // Get property count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Property.countDocuments({ category: category._id });
        return {
          _id: category._id,
          name: category.name,
          description: category.description,
          image: category.image,
          propertyCount: count,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        };
      })
    );
    
    res.json(categoriesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get only categories used by properties (propertyCount > 0)
router.get('/used', async (req, res) => {
  try {
    const categories = await Category.find();
    
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Property.countDocuments({ category: category._id });
        return {
          _id: category._id,
          name: category.name,
          description: category.description,
          image: category.image,
          propertyCount: count,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        };
      })
    );
    
    const usedCategories = categoriesWithCounts.filter(cat => cat.propertyCount > 0);
    
    res.json(usedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get single category with property count
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const count = await Property.countDocuments({ category: category._id });
    
    res.json({
      ...category.toObject(),
      propertyCount: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Create a category (admin only)
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    // Handle both JSON and multipart/form-data
    const categoryData = {
      name: req.body.name?.trim(),
      description: req.body.description || ''
    };

    // Add image if uploaded
    if (req.file) {
      categoryData.image = req.file.path;
    }

    // Validate required name
    if (!categoryData.name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create(categoryData);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Update a category (with image upload)
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.path;
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete a category
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    // Check if there are properties using this category
    const propertyCount = await Property.countDocuments({ category: req.params.id });
    if (propertyCount > 0) {
      await Property.deleteMany({ category: req.params.id });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: `Category and ${propertyCount || 0} properties deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
