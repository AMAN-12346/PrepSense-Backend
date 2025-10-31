const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const { populateExamData } = require('./utills/examdata');

const app = express();
const PORT = process.env.PORT || 7000;

connectDB();

app.use(compression());
app.use(
  cors({
    origin: '*'
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ================= MAIN ROUTES =================

app.get('/', (req, res) => {
  res.send('Server is running! 🚀');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PrepSense.ai API is running! 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working perfectly!',
    data: {
      server: 'PrepSense.ai Backend',
      version: '1.0.0',
      status: 'active',
    },
  });
});

app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    message: 'User endpoint working!',
    data: {
      users: [{ id: 1, name: 'Test User', email: 'test@prepsense.ai' }],
    },
  });
});

app.post('/api/populate-exams', async (req, res) => {
  try {
    const result = await populateExamData();
    res.json({
      success: true,
      message: 'Exam data populated successfully! 🎉',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to populate exam data',
      error: error.message,
    });
  }
});

app.get('/api/exams', async (req, res) => {
  try {
    const ExamHierarchy = require('./models/ExamHierarchy');
    const exams = await ExamHierarchy.find({ level: 0 }).sort({
      'preparationStats.popularityScore': -1,
    });

    res.json({
      success: true,
      message: 'Main exam categories retrieved',
      data: exams,
      count: exams.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get('/api/exams/hierarchy', async (req, res) => {
  try {
    const ExamHierarchy = require('./models/ExamHierarchy');
    const { level = 0, parentId } = req.query;
    const query = { level: parseInt(level), isActive: true };
    if (parentId) query.parentId = parentId;

    const exams = await ExamHierarchy.find(query)
      .populate('parentId', 'name displayName code')
      .sort({ 'preparationStats.popularityScore': -1 });

    res.json({
      success: true,
      message: `Level ${level} exams retrieved`,
      data: exams,
      count: exams.length,
    });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get('/api/test-models', (req, res) => {
  res.json({
    success: true,
    message: 'Models loaded successfully',
    models: ['ExamHierarchy', 'User'],
  });
});

// =========== AUTH ROUTES REGISTERED **BEFORE** 404 ===========
app.use('/api/auth', authRoutes);

// =========== 404 HANDLER ===========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// =========== GLOBAL ERROR HANDLER ===========
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 PrepSense.ai Backend Server Started at http://localhost:${PORT}`);
});
