import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import generateProducts from '../seeds/shoes.js';

dotenv.config();

const createSlug = (name, index) => {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    index
  );
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB');

    // Clear products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Generate products
    const rawProducts = generateProducts();

    // Add unique slug to each product
    const products = rawProducts.map((product, index) => ({
      ...product,
      slug: createSlug(product.name, index),
    }));

    console.log(`📦 Generated ${products.length} products`);

    const batchSize = 100;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);

      await Product.insertMany(batch);

      console.log(
        `✅ Inserted batch ${
          Math.floor(i / batchSize) + 1
        }/${Math.ceil(products.length / batchSize)}`
      );
    }

    // Create Admin User
    const adminExists = await User.findOne({
      email: 'admin@shoestore.com',
    });

    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@shoestore.com',
        password: 'admin123456',
        role: 'admin',
        isVerified: true,
      });

      console.log(
        '👤 Admin user created (admin@shoestore.com / admin123456)'
      );
    }

    console.log(
      `\n🎉 Successfully seeded ${products.length} products!`
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();