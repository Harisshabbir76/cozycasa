const mongoose = require('mongoose');
const Property = require('../models/Property');
const dotenv = require('dotenv');

dotenv.config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('\nNo categories (feature removed).');

    const properties = await Property.find();
    console.log('\nProperties:');
    properties.forEach(p => {
      console.log(`- ${p.title} (ID: ${p._id})`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkData();
