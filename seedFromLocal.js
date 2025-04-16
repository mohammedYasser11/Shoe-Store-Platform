require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./server/models/Product');

async function seedFromLocal() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Load the products.json file
    const filePath = path.join(__dirname, 'data', 'products.json'); // Path to your JSON file
    const content = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(content);

    // Clear the existing products collection
    await Product.deleteMany({});
    console.log('🗑  Cleared existing products');

    // Insert the new products
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

seedFromLocal();