/**
 * Migration script: clear all stale /uploads/... image paths from MongoDB.
 * Run once after switching to Cloudinary.
 * Usage: node scripts/clearOldImages.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const Property = require('../models/Property');
const Category = require('../models/Category');

const isStaleUrl = (url) => url && !url.startsWith('http');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // --- Fix Properties ---
  const properties = await Property.find({});
  let propFixed = 0;
  for (const prop of properties) {
    const stale = (prop.images || []).filter(url => isStaleUrl(url));
    if (stale.length > 0) {
      const cleanImages = (prop.images || []).filter(url => !isStaleUrl(url));
      await Property.findByIdAndUpdate(prop._id, { images: cleanImages }, { runValidators: false });
      propFixed++;
      console.log(`  Cleaned property: ${prop.title} (removed ${stale.length} stale image(s))`);
    }
  }
  console.log(`✅ Fixed ${propFixed} properties`);

  // --- Fix Categories ---
  const categories = await Category.find({});
  let catFixed = 0;
  for (const cat of categories) {
    if (cat.image && isStaleUrl(cat.image)) {
      cat.image = '';
      await cat.save();
      catFixed++;
      console.log(`  Cleaned category: ${cat.name}`);
    }
  }
  console.log(`✅ Fixed ${catFixed} categories`);

  await mongoose.disconnect();
  console.log('Done! Re-upload images via the admin panel.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
