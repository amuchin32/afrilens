require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Category = require('./src/models/Category');
const User = require('./src/models/User');

const categories = [
  { name: 'World News',    slug: 'world-news',    color: '#0047AB', description: 'Global news coverage' },
  { name: 'Business',      slug: 'business',      color: '#28a745', description: 'Business and economy' },
  { name: 'Technology',    slug: 'technology',    color: '#6f42c1', description: 'Tech and innovation' },
  { name: 'Culture',       slug: 'culture',       color: '#fd7e14', description: 'Arts and culture' },
  { name: 'Sports',        slug: 'sports',        color: '#dc3545', description: 'Sports news' },
  { name: 'Opportunities', slug: 'opportunities', color: '#20c997', description: 'Jobs and scholarships' },
  { name: 'Editorial',     slug: 'editorial',     color: '#6c757d', description: 'Editor opinions' },
  { name: 'Commentary',    slug: 'commentary',    color: '#e83e8c', description: 'Commentary and analysis' },
];

const adminUser = {
  name: 'Lyndon J. Ponnie, Sr.',
  email: 'admin@afrilens.com',
  password: 'AfriLENS2024!',
  role: 'admin',
  bio: 'Editor-in-Chief, AfriLENS.com',
};

async function seed() {
  await connectDB();
  console.log('?? Seeding database...');

  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log('? Categories seeded:', categories.length);

  const existing = await User.findOne({ email: adminUser.email });
  if (!existing) {
    await User.create(adminUser);
    console.log('? Admin user created:', adminUser.email);
  } else {
    console.log('??  Admin already exists, skipping');
  }

  console.log('');
  console.log('?? Seed complete!');
  console.log('   Admin email:    admin@afrilens.com');
  console.log('   Admin password: AfriLENS2024!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
