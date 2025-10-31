const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema(
  {
    // ============ BASIC INFORMATION ============
    testName: {
      type: String,
      required: true,
      trim: true
      // Example: "Delhi Police Constable Full Test"
    },

    testCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true
      // Example: "DELHI_POLICE_FULL_001"
    },

    description: {
      type: String,
      default: ''
    },

    // ============ EXAM MAPPING ============
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamHierarchy',
      required: true
    },

    testType: {
      type: String,
      enum: ['Full Test', 'Sectional Test', 'Subject Test', 'Topic Test'],
      default: 'Full Test'
      // Full test = entire exam pattern
      // Sectional = one section of exam
      // Subject = one subject
      // Topic = specific topic
    },

    // ============ TEST STRUCTURE ============
    totalQuestions: {
      type: Number,
      required: true
    },

    totalMarks: {
      type: Number,
      required: true
    },

    totalDuration: {
      type: Number,
      required: true
      // In minutes
    },

    negativeMarking: {
      type: Boolean,
      default: false
    },

    negativeMarksPerQuestion: {
      type: Number,
      default: 0.25
      // For wrong answer
    },

    // ============ SECTIONS (for sectional tests) ============
    sections: [
      {
        sectionName: String,
        // Example: "General Knowledge", "English"

        questions: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
          }
        ],

        sectionMarks: Number,

        sectionDuration: Number,
        // In minutes

        questionsCount: Number
      }
    ],

    // ============ QUESTIONS IN TEST ============
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      }
    ],

    // ============ TEST METADATA ============
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
      default: 'Medium'
    },

    subject: {
      type: [String],
      default: []
      // Example: ["General Knowledge", "English", "Mathematics"]
    },

    syllabusCoverage: {
      type: String,
      default: 'Complete'
      // "Complete" or "Partial"
    },

    // ============ TEST SCHEDULING ============
    testNumber: {
      type: Number,
      default: 1
      // Mock Test 1, Mock Test 2, etc.
    },

    difficultyProgression: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },

    // ============ ANALYTICS & STATISTICS ============
    stats: {
      totalAttempts: {
        type: Number,
        default: 0
      },

      totalCompletions: {
        type: Number,
        default: 0
      },

      averageScore: {
        type: Number,
        default: 0
        // Percentage
      },

      averageAccuracy: {
        type: Number,
        default: 0
        // Percentage
      },

      averageTimeSpent: {
        type: Number,
        default: 0
        // In minutes
      },

      highestScore: {
        type: Number,
        default: 0
      },

      lowestScore: {
        type: Number,
        default: 0
      },

      passRate: {
        type: Number,
        default: 0
        // Percentage of users who passed
      }
    },

    // ============ RECOMMENDATIONS ============
    recommendedTimePerQuestion: {
      type: Number,
      default: 0
      // In seconds
    },

    expectedPassingScore: {
      type: Number,
      default: 0
      // Minimum marks needed to pass
    },

    skillsTestedTopics: [String],
    // ["Topic 1", "Topic 2"]
    // Topics covered in this test

    // ============ VISIBILITY & STATUS ============
    isActive: {
      type: Boolean,
      default: true
    },

    isPublished: {
      type: Boolean,
      default: false
      // Only published tests are visible to users
    },

    isFeatured: {
      type: Boolean,
      default: false
      // Show in featured section
    },

    isLatest: {
      type: Boolean,
      default: false
      // Mark as latest mock test
    },

    // ============ ACCESS CONTROL ============
    accessLevel: {
      type: String,
      enum: ['Free', 'Premium', 'Pro'],
      default: 'Free'
      // Who can access this test
    },

    requiredSubscription: {
      type: String,
      enum: ['Free', 'Premium', 'Pro'],
      default: 'Free'
    },

    // ============ REVIEW & MODERATION ============
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    verificationNotes: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
mockTestSchema.index({ examId: 1 });
mockTestSchema.index({ testCode: 1 });
mockTestSchema.index({ isPublished: 1, isActive: 1 });
mockTestSchema.index({ 'stats.averageScore': -1 });
mockTestSchema.index({ accessLevel: 1 });

// ============ VIRTUAL FIELDS ============
// Get questions count
mockTestSchema.virtual('questionsCount').get(function() {
  return this.questions.length;
});

// ============ METHODS ============

// Get test info without sensitive data
mockTestSchema.methods.getTestInfo = function() {
  return {
    testId: this._id,
    testName: this.testName,
    examId: this.examId,
    totalQuestions: this.totalQuestions,
    totalMarks: this.totalMarks,
    totalDuration: this.totalDuration,
    difficulty: this.difficulty,
    averageScore: this.stats.averageScore,
    totalAttempts: this.stats.totalAttempts,
    accessLevel: this.accessLevel
  };
};

// Check if user can access this test
mockTestSchema.methods.canUserAccess = function(userSubscriptionLevel) {
  const accessLevels = {
    'Free': 0,
    'Premium': 1,
    'Pro': 2
  };

  const testAccessLevel = accessLevels[this.accessLevel] || 0;
  const userAccessLevel = accessLevels[userSubscriptionLevel] || 0;

  return userAccessLevel >= testAccessLevel;
};

// Get difficulty progression
mockTestSchema.methods.getDifficultyInfo = function() {
  return {
    difficulty: this.difficulty,
    progression: this.difficultyProgression,
    isAdvanced: this.difficultyProgression === 'Advanced',
    isForBeginners: this.difficultyProgression === 'Beginner'
  };
};

// Calculate passing score percentage
mockTestSchema.methods.getPassingScorePercentage = function() {
  if (this.totalMarks === 0) return 0;
  return (this.expectedPassingScore / this.totalMarks) * 100;
};

// Update stats after test completion
mockTestSchema.methods.recordTestAttempt = function(userScore, userAccuracy, timeSpent) {
  this.stats.totalAttempts += 1;
  this.stats.totalCompletions += 1;

  // Update highest score
  if (userScore > this.stats.highestScore) {
    this.stats.highestScore = userScore;
  }

  // Update lowest score (only if not first attempt)
  if (this.stats.totalAttempts > 1 && userScore < this.stats.lowestScore) {
    this.stats.lowestScore = userScore;
  } else if (this.stats.totalAttempts === 1) {
    this.stats.lowestScore = userScore;
  }

  // Update average score
  const prevAvgScore = this.stats.averageScore;
  this.stats.averageScore =
    (prevAvgScore * (this.stats.totalAttempts - 1) + userScore) /
    this.stats.totalAttempts;

  // Update average accuracy
  const prevAvgAccuracy = this.stats.averageAccuracy;
  this.stats.averageAccuracy =
    (prevAvgAccuracy * (this.stats.totalAttempts - 1) + userAccuracy) /
    this.stats.totalAttempts;

  // Update pass rate
  if (userScore >= this.expectedPassingScore) {
    const prevPassCount = Math.floor(
      (this.stats.passRate / 100) * (this.stats.totalAttempts - 1)
    );
    const newPassCount = prevPassCount + 1;
    this.stats.passRate = (newPassCount / this.stats.totalAttempts) * 100;
  }

  // Update average time
  const prevAvgTime = this.stats.averageTimeSpent;
  this.stats.averageTimeSpent =
    (prevAvgTime * (this.stats.totalAttempts - 1) + timeSpent) /
    this.stats.totalAttempts;
};

module.exports = mongoose.model('MockTest', mockTestSchema);
