const User = require('../models/User');
//
const UserAssessment = require('../models/UserAssessment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ExamHierarchy = require('../models/ExamHierarchy');
// Strict regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[+]?[\d\s\-().]{10,}$/;
const {
  mapKnowledgeLevel,
  mapStudyTime,
  mapPreferredTime,
  mapStressLevel,
  mapWeaknessArea,
  generatePersonalizedPlan,
  identifyStrengths,
  identifyImprovements,
  mapKnowledgeLevelForUser,
  mapStudyTimeForUser,
  mapPreferredTimeForUser,
  mapWeaknessAreaForUser,
  calculateDailyProgress,
  getRecentActivities,
  getCurrentAffairsData,
  getMotivationalQuote,
} = require('../utills/helper');
const { generateOTP, getOTPExpiry } = require('../utills/otpService');
const { sendOTPEmail, sendWelcomeEmail } = require('../utills/emailService');
exports.sendOTP = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone is required',
      });
    }

    let email = null,
      phone = null;

    if (emailRegex.test(emailOrPhone)) {
      email = emailOrPhone.toLowerCase();
    } else if (phoneRegex.test(emailOrPhone)) {
      phone = emailOrPhone;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or phone format',
      });
    }

    // Check if user already exists AND is verified
    const existingUser = await User.findOne(email ? { email } : { phone });

    // ✅ ADD THIS CHECK
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message:
          'User with this email/phone already exists. Please login instead.',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    let user = existingUser;
    if (!user) {
      user = new User({
        email,
        phone,
        otpCode: otp,
        otpExpires: otpExpiry,
      });
      await user.save();
    } else {
      user.otpCode = otp;
      user.otpExpires = otpExpiry;
      await user.save();
    }

    if (email) {
      await sendOTPEmail(email, otp);
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        emailOrPhone: email || phone,
      },
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;

    if (!emailOrPhone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and OTP are required',
      });
    }

    // Find user
    let user;
    if (emailRegex.test(emailOrPhone)) {
      user = await User.findOne({ email: emailOrPhone.toLowerCase() });
    } else {
      user = await User.findOne({ phone: emailOrPhone });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check OTP expiry
    if (!user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }

    // Verify OTP
    if (user.otpCode !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Mark OTP as verified
    user.isOTPVerified = true;

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message,
    });
  }
};
exports.register = async (req, res) => {
  console.log(
    '🚀 ~ file: authController.js:108 ~ exports.register=async ~ req.body:',
    req.body
  );
  try {
    const { fullName, emailOrPhone, password } = req.body;
    let errors = {};

    // Full Name validation
    if (
      !fullName ||
      typeof fullName !== 'string' ||
      fullName.trim().length < 2
    ) {
      errors.fullName = 'Name must be at least 2 characters.';
    }
    console.log(
      '🚀 ~ file: authController.js:117 ~ exports.register=async ~ errors:',
      errors
    );
    // Email or phone validation
    let email = null,
      phone = null;
    if (!emailOrPhone || typeof emailOrPhone !== 'string') {
      errors.emailOrPhone = 'Email or phone is required.';
    } else if (emailRegex.test(emailOrPhone.trim())) {
      email = emailOrPhone.trim().toLowerCase();
    } else if (phoneRegex.test(emailOrPhone.trim())) {
      phone = emailOrPhone.trim();
    } else {
      errors.emailOrPhone = 'Enter a valid email or 10+ digit phone number.';
    }
    console.log('🚀 ', errors);

    // Password validation
    const hasMinLen = password && password.length >= 6;
    const hasUC = /[A-Z]/.test(password || '');
    const hasLC = /[a-z]/.test(password || '');
    const hasNum = /[0-9]/.test(password || '');
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password || '');
    console.log('🚀 ', errors);

    if (!password) {
      errors.password = 'Password is required.';
    } else if (!hasMinLen) {
      errors.password = 'Password must be at least 6 characters.';
    } else if (!(hasUC && hasLC && hasNum && hasSpecial)) {
      errors.password =
        'Password must have upper, lower, number & special character.';
    }
    console.log('🚀 ', errors);

    // OTP validation

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    console.log('🚀 ', errors);

    // Find user and verify
    const user = await User.findOne(email ? { email } : { phone });
    console.log('🚀 ', errors);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please send OTP first.',
      });
    }
    console.log('>>>>>>>>>>>>> ');

    console.log('>>>>>>>>>>>>> ');

    // Check if already registered
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'User already registered',
      });
    }
    console.log('>>>>>>>>>>>>> ');

    // Update user with registration details
    const [firstName, ...lastNameArr] = fullName.trim().split(' ');
    const lastName = lastNameArr.join(' ');

    user.password = password;
    user.profile.firstName = firstName;
    user.profile.lastName = lastName;
    user.isEmailVerified = true;
    user.isOTPVerified = false; // Clear for next use
    user.otpExpires = null;

    await user.save();
    console.log('>>>>>>>>>>1122222 ');

    // Send welcome email
    await sendWelcomeEmail(email, fullName);
    console.log('>>>>>>>>>> ');

    // Generate JWT token
    const payload = {
      userId: user._id,
      email: user.email,
    };
    console.log('🚀 ', errors);

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    console.log('🚀 ', errors);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        accessToken: token,
        user: user.getDashboardData(),
      },
    });
    console.log('🚀 ', errors);
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required',
      });
    }

    // Find user by email or phone
    const query = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailOrPhone)) {
      query.email = emailOrPhone.toLowerCase();
    } else {
      query.phone = emailOrPhone;
    }

    // ✅ IMPORTANT: Populate selectedExams in the query
    const user = await User.findOne(query).populate('selectedExams');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // ✅ ADD THIS CHECK - Ensure user has completed registration
    if (!user.password || !user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please complete your registration first',
      });
    }

    // Validate password
    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const payload = {
      userId: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // ✅ RETURN MORE COMPLETE USER DATA
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user._id,
          email: user.email,
          phone: user.phone,
          fullName: `${user.profile?.firstName || ''} ${
            user.profile?.lastName || ''
          }`.trim(),
          profile: {
            firstName: user.profile?.firstName,
            lastName: user.profile?.lastName,
            profilePicture: user.profile?.profilePicture,
            dateOfBirth: user.profile?.dateOfBirth,
            education: user.profile?.education,
          },
          selectedExams: user.selectedExams || [],
          aiAssessment: user.aiAssessment || {},
          streak: user.streak,
          points: user.points,
          level: user.level,
        },
      },
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

exports.selectExams = async (req, res) => {
  try {
    const { selectedExams } = req.body;
    const userId = req.user.userId; // from authMiddleware

    if (!selectedExams || selectedExams.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one exam must be selected',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { selectedExams },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Exams selected successfully',
      data: { userId: user._id, selectedExams: user.selectedExams },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error selecting exams',
      error: error.message,
    });
  }
};
exports.submitAssessment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { assessmentAnswers, selectedExams } = req.body;

    if (!assessmentAnswers || Object.keys(assessmentAnswers).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Assessment answers are required',
      });
    }

    // Map frontend answers to schema fields
    const assessmentData = {
      userId,
      educationDetails: {
        currentKnowledgeLevel: mapKnowledgeLevel(
          assessmentAnswers.knowledge_level
        ),
      },
      studyHabits: {
        dailyStudyTime: mapStudyTime(assessmentAnswers.study_time),
        preferredStudyTime: mapPreferredTime(assessmentAnswers.preferred_time),
      },
      healthProfile: {
        currentStressLevel: mapStressLevel(assessmentAnswers.stress_level),
      },
      weakAreas: {
        subjectsStruggling: mapWeaknessArea(assessmentAnswers.weakness_area),
      },
      examInfo: {
        selectedExams: selectedExams || [],
      },
      assessmentStatus: {
        isCompleted: true,
        completedAt: new Date(),
      },
    };

    // Check if assessment already exists
    let userAssessment = await UserAssessment.findOne({ userId });

    if (userAssessment) {
      // Update existing assessment
      Object.keys(assessmentData).forEach((key) => {
        if (key !== 'userId') {
          userAssessment[key] = {
            ...userAssessment[key],
            ...assessmentData[key],
          };
        }
      });
      userAssessment.assessmentVersion += 1;
      userAssessment.lastUpdatedAt = new Date();
    } else {
      // Create new assessment
      userAssessment = new UserAssessment(assessmentData);
    }

    // Calculate AI recommendations and predictions
    const successProbability = userAssessment.calculateSuccessProbability();
    const estimatedTime = userAssessment.estimateTimeToReadiness();
    const recommendations = userAssessment.generateRecommendations();

    // Update AI profile
    userAssessment.aiProfile.successProbability = successProbability;
    userAssessment.aiProfile.estimatedTimeToReadiness = estimatedTime;
    userAssessment.aiProfile.customizedStrategy = recommendations;

    await userAssessment.save();

    // ✅ ALSO UPDATE THE USER SCHEMA WITH AI ASSESSMENT DATA
    const user = await User.findById(userId);
    if (user) {
      // Update aiAssessment field in User schema
      user.aiAssessment = {
        knowledgeLevel: mapKnowledgeLevelForUser(
          assessmentAnswers.knowledge_level
        ),
        dailyStudyTime: mapStudyTimeForUser(assessmentAnswers.study_time),
        preferredStudyTime: mapPreferredTimeForUser(
          assessmentAnswers.preferred_time
        ),
        weaknessArea: mapWeaknessAreaForUser(assessmentAnswers.weakness_area),
        currentStressLevel: mapStressLevel(assessmentAnswers.stress_level),
        assessmentCompletedAt: new Date(),
      };

      // Update selected exams if provided
      if (selectedExams && selectedExams.length > 0) {
        user.selectedExams = selectedExams;
      }

      await user.save();
      console.log('✅ User schema updated with AI assessment data');
    }

    // Generate response with AI insights
    const aiInsights = {
      successProbability,
      estimatedTimeToReadiness: estimatedTime,
      recommendations,
      personalizedPlan: generatePersonalizedPlan(userAssessment),
      strengths: identifyStrengths(assessmentAnswers),
      improvements: identifyImprovements(assessmentAnswers),
    };

    res.json({
      success: true,
      message: 'Assessment completed successfully',
      data: {
        assessmentId: userAssessment._id,
        aiInsights,
        profileSummary: userAssessment.getProfileSummary(),
      },
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit assessment',
      error: error.message,
    });
  }
};
exports.getUserAssessment = async (req, res) => {
  try {
    const userId = req.user.userId;

    const assessment = await UserAssessment.findOne({ userId }).populate(
      'examInfo.selectedExams',
      'name displayName description'
    );

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No assessment found for this user',
      });
    }

    res.json({
      success: true,
      data: {
        assessment,
        profileSummary: assessment.getProfileSummary(),
        recommendations: assessment.generateRecommendations(),
      },
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment',
      error: error.message,
    });
  }
};
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user profile data
    const user = await User.findById(userId)
      .populate('selectedExams', 'name displayName description')
      .select('-password -refreshTokens -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user assessment data
    const assessment = await UserAssessment.findOne({ userId });

    // Calculate daily progress (mock data for now)
    const todayProgress = calculateDailyProgress(user, assessment);

    // Get recent activities (mock data for now)
    const recentActivities = getRecentActivities(userId);

    // Generate AI recommendations
    const aiRecommendations = assessment
      ? assessment.generateRecommendations()
      : [];

    // Get current affairs data (mock)
    const currentAffairs = getCurrentAffairsData();

    // Calculate user stats
    const userStats = {
      streak: user.streak.current,
      points: user.points,
      level: user.level,
      completedTests: 12, // You can track this in future
      studyHours: 45, // You can track this in future
    };

    const dashboardData = {
      user: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.email,
        profilePicture: user.profile.profilePicture,
        selectedExams: user.selectedExams,
      },
      stats: userStats,
      progress: todayProgress,
      assessment: assessment
        ? {
            knowledgeLevel: assessment.educationDetails.currentKnowledgeLevel,
            dailyStudyTime: assessment.studyHabits.dailyStudyTime,
            weakAreas: assessment.weakAreas.subjectsStruggling,
            successProbability: assessment.aiProfile.successProbability,
            estimatedTime: assessment.aiProfile.estimatedTimeToReadiness,
          }
        : null,
      activities: recentActivities,
      aiRecommendations,
      currentAffairs,
      motivationalQuote: getMotivationalQuote(),
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};
exports.updateStreak = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.updateStreak();
    await user.save();

    res.json({
      success: true,
      data: {
        currentStreak: user.streak.current,
        longestStreak: user.streak.longest,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update streak',
      error: error.message,
    });
  }
};
exports.logout = async (req, res) => {
  try {
    // You can log user logout time here if needed
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout',
    });
  }
};
