const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middlewares/auth'); 

// Registration route
router.post('/register', authController.register);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login); 
router.post('/select-exams', authMiddleware, authController.selectExams);
router.post('/submit', authMiddleware, authController.submitAssessment);
router.get('/profile', authMiddleware, authController.getUserAssessment);
router.get('/dashboard', authMiddleware,authController.getDashboardData);
router.post('/streak', authMiddleware,authController.updateStreak);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
