const mongoose = require('mongoose');

const userAssessmentSchema = new mongoose.Schema(
  {
    // ============ USER INFORMATION ============
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    // ============ EDUCATION & KNOWLEDGE ============
    educationDetails: {
      highestQualification: {
        type: String,
        enum: ['10th', '12th', 'Graduation', 'Post-graduation', 'Other'],
        default: null
      },

      stream: {
        type: String,
        enum: ['Science', 'Commerce', 'Arts', 'Other'],
        default: null
      },

      collegeName: {
        type: String,
        default: null
      },

      currentKnowledgeLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
      }
    },

    // ============ STUDY HABITS & TIME ============
    studyHabits: {
      dailyStudyTime: {
        type: String,
        enum: ['1 hour', '3 hours', '5 hours', 'Flexible', 'Not decided'],
        default: null
        // How many hours can user dedicate daily
      },

      preferredStudyTime: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'],
        default: null
        // When does user like to study
      },

      studyFrequency: {
        type: String,
        enum: ['Daily', 'Alternate days', 'Weekly', 'Irregular'],
        default: 'Daily'
      },

      learningStyle: {
        type: String,
        enum: ['Video', 'Text', 'Interactive', 'Mixed'],
        default: 'Mixed'
        // How user prefers to learn
      },

      prefersGroupStudy: {
        type: Boolean,
        default: false
      },

      studyDurationMonths: {
        type: Number,
        default: null
        // How many months until exam
      }
    },

    // ============ HEALTH & WELLNESS ============
    healthProfile: {
      currentStressLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: null
        // 1-10 scale
      },
 
      sleepHoursDaily: {
        type: String,
        enum: ['<6', '6-8', '>8'],
        default: null
        // Hours of sleep per night
      },

      exerciseFrequency: {
        type: String,
        enum: ['Never', '1-2 times', '3-4 times', 'Daily'],
        default: 'Never'
        // How often user exercises
      },

      mentalHealthConcerns: [String],
      // ["Anxiety", "Depression", "Burnout", "Time Management"]

      physicalHealthIssues: [String],
      // ["Back pain", "Eye strain", "Headaches"]

      sleepQuality: {
        type: String,
        enum: ['Poor', 'Average', 'Good'],
        default: 'Average'
      },

      dietQuality: {
        type: String,
        enum: ['Poor', 'Average', 'Good'],
        default: 'Average'
      }
    },

    // ============ CAREER & MOTIVATION ============
    careerGoals: {
      primaryGoal: {
        type: String,
        enum: ['Job Security', 'Career Growth', 'Better Salary', 'Knowledge', 'Stability'],
        default: null
      },

      motivationLevel: {
        type: String,
        enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
        default: 'Medium'
      },

      motivationFactors: [String],
      // ["Family expectation", "Self achievement", "Salary", "Status"]

      careerHistory: {
        type: String,
        enum: ['Fresher', 'Working', 'Unemployed', 'Student'],
        default: 'Student'
      },

      targetPosition: {
        type: String,
        default: null
        // What position user is preparing for
      }
    },

    // ============ EXAM INFORMATION ============
    examInfo: {
      selectedExams: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ExamHierarchy'
        }
      ],

      primaryExam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamHierarchy',
        default: null
      },

      examAttemptsCount: {
        type: Number,
        default: 0
        // How many times user has attempted
      },

      previousExamScore: {
        type: Number,
        default: null
        // Score from previous attempt
      },

      targetScore: {
        type: Number,
        default: null
        // Target score for this attempt
      }
    },

    // ============ WEAK AREAS ============
    weakAreas: {
      subjectsStruggling: {
        type: String,
        enum: ['Mathematics', 'English', 'General Knowledge', 'Reasoning', 'None'],
        default: null
      },

      topicsToFocus: [String],
      // ["Indian History", "Arithmetic"]

      studyNeedsHelp: [String],
      // ["Doubt solving", "Time management", "Consistency"]

      learningChallenges: [String]
      // ["Concentration", "Retention", "Time pressure"]
    },

    // ============ PREFERENCES ============
    preferences: {
      preferredNotificationTime: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
        default: 'Evening'
      },

      notificationFrequency: {
        type: String,
        enum: ['Daily', 'Every 2 days', 'Weekly', 'Minimal'],
        default: 'Daily'
      },

      preferredLanguage: {
        type: String,
        enum: ['English', 'Hindi', 'Multilingual'],
        default: 'English'
      },

      darkModePreference: {
        type: Boolean,
        default: false
      },

      receiveEmailUpdates: {
        type: Boolean,
        default: true
      },

      receiveSMSAlerts: {
        type: Boolean,
        default: false
      }
    },

    // ============ AI-GENERATED PROFILE ============
    aiProfile: {
      userPersonality: {
        type: String,
        enum: ['Visual Learner', 'Auditory Learner', 'Kinesthetic Learner', 'Reading/Writing Learner'],
        default: null
      },

      strengths: [String],
      // ["Quick learner", "Good memory", "Good time management"]

      weaknesses: [String],
      // ["Weak in mathematics", "Slow reading", "Procrastination"]

      recommendedStudyPlan: {
        type: String,
        default: null
      },

      estimatedTimeToReadiness: {
        type: Number,
        default: null
        // In months
      },

      successProbability: {
        type: Number,
        default: null
        // 0-100 percentage
      },

      customizedStrategy: [String]
      // ["Focus on weak areas first", "Practice daily for consistency"]
    },

    // ============ ASSESSMENT STATUS ============
    assessmentStatus: {
      isCompleted: {
        type: Boolean,
        default: false
      },

      completedAt: {
        type: Date,
        default: null
      },

      isReviewed: {
        type: Boolean,
        default: false
      },

      reviewedAt: {
        type: Date,
        default: null
      }
    },

    // ============ VERSION & UPDATES ============
    assessmentVersion: {
      type: Number,
      default: 1
      // Track if user retakes assessment
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
userAssessmentSchema.index({ userId: 1 });
userAssessmentSchema.index({ 'examInfo.primaryExam': 1 });
userAssessmentSchema.index({ 'assessmentStatus.isCompleted': 1 });

// ============ METHODS ============

// Get user profile summary
userAssessmentSchema.methods.getProfileSummary = function() {
  return {
    userId: this.userId,
    education: this.educationDetails.highestQualification,
    knowledgeLevel: this.educationDetails.currentKnowledgeLevel,
    dailyStudyTime: this.studyHabits.dailyStudyTime,
    stressLevel: this.healthProfile.currentStressLevel,
    motivation: this.careerGoals.motivationLevel,
    primaryExam: this.examInfo.primaryExam,
    targetScore: this.examInfo.targetScore,
    estimatedReadinessMonths: this.aiProfile.estimatedTimeToReadiness
  };
};

// Generate personalized recommendations
userAssessmentSchema.methods.generateRecommendations = function() {
  const recommendations = [];

  // Based on stress level
  if (this.healthProfile.currentStressLevel >= 7) {
    recommendations.push('Your stress level is high - prioritize mental wellness');
    recommendations.push('Practice meditation and relaxation techniques');
  }

  // Based on sleep
  if (this.healthProfile.sleepHoursDaily === '<6') {
    recommendations.push('Increase your sleep hours - aim for 6-8 hours');
  }

  // Based on weak areas
  if (this.weakAreas.subjectsStruggling) {
    recommendations.push(
      `Focus on ${this.weakAreas.subjectsStruggling} - it\'s your weak area`
    );
  }

  // Based on study time
  if (this.studyHabits.dailyStudyTime === '1 hour') {
    recommendations.push('Increase study hours gradually for better preparation');
  }

  // Based on motivation
  if (this.careerGoals.motivationLevel === 'Low') {
    recommendations.push('Join study groups to boost motivation');
  }

  // Exercise recommendation
  if (this.healthProfile.exerciseFrequency === 'Never') {
    recommendations.push('Start exercising - even 30 minutes daily helps');
  }

  return recommendations;
};

// Calculate success probability
userAssessmentSchema.methods.calculateSuccessProbability = function() {
  let probability = 50; // Base probability

  // Knowledge level factor (20%)
  const knowledgeLevelMap = {
    'Beginner': -10,
    'Intermediate': 0,
    'Advanced': 10
  };
  probability += knowledgeLevelMap[this.educationDetails.currentKnowledgeLevel] || 0;

  // Study time factor (20%)
  const studyTimeMap = {
    '1 hour': 5,
    '3 hours': 10,
    '5 hours': 15,
    'Flexible': 10,
    'Not decided': 0
  };
  probability += studyTimeMap[this.studyHabits.dailyStudyTime] || 0;

  // Motivation factor (20%)
  const motivationMap = {
    'Very Low': -15,
    'Low': -5,
    'Medium': 0,
    'High': 10,
    'Very High': 15
  };
  probability += motivationMap[this.careerGoals.motivationLevel] || 0;

  // Health factor (15%)
  if (this.healthProfile.sleepHoursDaily === '6-8') {
    probability += 5;
  }
  if (this.healthProfile.exerciseFrequency !== 'Never') {
    probability += 3;
  }

  // Stress factor (15%)
  if (this.healthProfile.currentStressLevel <= 5) {
    probability += 8;
  } else if (this.healthProfile.currentStressLevel >= 8) {
    probability -= 8;
  }

  // Cap probability between 20-95%
  this.aiProfile.successProbability = Math.max(
    20,
    Math.min(95, probability)
  );

  return this.aiProfile.successProbability;
};

// Estimate time to readiness
userAssessmentSchema.methods.estimateTimeToReadiness = function() {
  let months = 3; // Base time: 3 months

  // Adjust based on knowledge level
  if (this.educationDetails.currentKnowledgeLevel === 'Beginner') {
    months += 2;
  }

  // Adjust based on daily study time
  if (this.studyHabits.dailyStudyTime === '1 hour') {
    months += 2;
  } else if (this.studyHabits.dailyStudyTime === '3 hours') {
    months -= 1;
  } else if (this.studyHabits.dailyStudyTime === '5 hours') {
    months -= 2;
  }

  // Adjust based on weak areas
  if (this.weakAreas.topicsToFocus.length > 3) {
    months += 1;
  }

  this.aiProfile.estimatedTimeToReadiness = Math.max(1, months);
  return this.aiProfile.estimatedTimeToReadiness;
};

module.exports = mongoose.model('UserAssessment', userAssessmentSchema);
