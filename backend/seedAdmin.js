import dns from 'dns';
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin account already exists. Skipping seed.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      name: 'System Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Master admin account created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();