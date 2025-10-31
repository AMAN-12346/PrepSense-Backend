// scripts/runPopulation.js
require('dotenv').config();
const connectDB = require('../config/database');
const { populateExamData } = require('../utills/examdata');

const runPopulation = async () => {
  try {
    // Use your existing database connection
    await connectDB();
    console.log('📡 Connected to database');
    
    // Run population
    const result = await populateExamData();
    console.log('✅ Population completed:', result);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Population failed:', error);
    process.exit(1);
  }
};

runPopulation();
