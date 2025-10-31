const mongoose = require('mongoose');

const userAnalyticsSchema = new mongoose.Schema(
  {
    // ============ USER IDENTIFICATION ============
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    // ============ OVERALL PERFORMANCE ============
    overallPerformance: {
      totalQuestionsAttempted: {
        type: Number,
        default: 0
      },

      totalQuestionsCorrect: {
        type: Number,
        default: 0
      },

      overallAccuracy: {
        type: Number,
        default: 0
        // Percentage
      },

      improvementRate: {
        type: Number,
        default: 0
        // Percentage improvement over time
      },

      totalMocksAttempted: {
        type: Number,
        default: 0
      },

      mockAverageScore: {
        type: Number,
        default: 0
      },

      mockAverageAccuracy: {
        type: Number,
        default: 0
      },

      bestMockScore: {
        type: Number,
        default: 0
      },

      totalStudyTime: {
        type: Number,
        default: 0
        // In hours
      }
    },

    // ============ SUBJECT-WISE PERFORMANCE ============
    subjectWisePerformance: [
      {
        subject: String,

        totalQuestions: Number,

        correctQuestions: Number,

        accuracy: Number,
        // Percentage

        timeSpent: Number,
        // In minutes

        averageTimePerQuestion: Number,
        // In seconds

        lastPracticedDate: Date,

        trend: {
          type: String,
          enum: ['Improving', 'Stable', 'Declining'],
          default: 'Stable'
        }
      }
    ],

    // ============ TOPIC-WISE PERFORMANCE ============
    topicWisePerformance: [
      {
        topic: String,

        subject: String,

        totalQuestions: Number,

        correctQuestions: Number,

        accuracy: Number,

        difficulty: String,
        // "Easy", "Medium", "Hard"

        masteryLevel: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          default: 'Beginner'
        },

        lastPracticedDate: Date,

        recommendedForReview: Boolean
      }
    ],

    // ============ LEARNING PATTERNS ============
    learningPatterns: {
      studyFrequency: {
        type: String,
        enum: ['Daily', 'Alternate days', '2-3 times/week', 'Weekly', 'Irregular'],
        default: 'Irregular'
      },

      consistencyScore: {
        type: Number,
        default: 0
        // 0-100, based on daily activity
      },

      peakStudyHours: [Number],
      // [9, 10, 14, 20] - hours when most active

      averageSessionDuration: {
        type: Number,
        default: 0
        // In minutes
      },

      preferredQuestionType: {
        type: String,
        default: null
      },

      preferredDifficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
        default: 'Mixed'
      },

      timePerQuestion: {
        type: Number,
        default: 0
        // Average in seconds
      },

      bingeLearner: Boolean,
      // Long sessions, less frequent

      microLearner: Boolean
      // Short sessions, frequent
    },

    // ============ WEAK & STRONG AREAS ============
    performanceAreas: {
      strongSubjects: [String],
      // Subjects with >75% accuracy

      weakSubjects: [String],
      // Subjects with <50% accuracy

      strongTopics: [String],
      // Topics with high mastery

      weakTopics: [String],
      // Topics needing improvement

      criticalAreas: [String],
      // Areas requiring immediate attention

      improvingAreas: [String]
      // Areas showing improvement
    },

    // ============ DIFFICULTY-WISE ANALYSIS ============
    difficultyAnalysis: {
      easyQuestionAccuracy: Number,

      mediumQuestionAccuracy: Number,

      hardQuestionAccuracy: Number,

      difficultySuitability: {
        type: String,
        enum: ['Too Easy', 'Just Right', 'Too Hard'],
        default: 'Just Right'
      }
    },

    // ============ TIME MANAGEMENT ============
    timeManagement: {
      totalTimeSpent: {
        type: Number,
        default: 0
        // In hours
      },

      timePerDay: {
        type: Number,
        default: 0
        // Average in minutes
      },

      longestStreak: {
        type: Number,
        default: 0
        // In days
      },

      currentStreak: {
        type: Number,
        default: 0
        // In days
      },

      lastActiveDate: Date,

      studyHoursGoal: {
        type: Number,
        default: 0
      },

      studyHoursCompleted: {
        type: Number,
        default: 0
      },

      goalCompletionRate: Number
      // Percentage
    },

    // ============ PREDICTIVE METRICS ============
    predictions: {
      examReadinessScore: {
        type: Number,
        default: 0
        // 0-100 scale
      },

      expectedExamScore: {
        type: Number,
        default: 0
      },

      confidenceLevel: {
        type: Number,
        default: 0
        // 1-10 scale
      },

      churnRisk: {
        type: Number,
        default: 0
        // 0-100, likelihood to stop using app
      },

      upgradeIntention: {
        type: Number,
        default: 0
        // 0-100, likelihood to upgrade subscription
      },

      referralPropensity: Number
      // 0-100, likelihood to refer friends
    },

    // ============ BEHAVIORAL INSIGHTS ============
    behavioralInsights: {
      learningStyle: {
        type: String,
        enum: ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Mixed'],
        default: 'Mixed'
      },

      motivationType: {
        type: String,
        enum: ['Intrinsic', 'Extrinsic', 'Mixed'],
        default: 'Mixed'
      },

      motivationTriggers: [String],
      // ["Progress", "Badges", "Streaks", "Leaderboard"]

      engagementScore: {
        type: Number,
        default: 0
        // 0-100, based on activity
      },

      appUsagePattern: {
        morningUser: Boolean,
        eveningUser: Boolean,
        weekendWarrior: Boolean,
        nightOwl: Boolean
      }
    },

    // ============ ENGAGEMENT TRACKING ============
    engagement: {
      sessionsCount: {
        type: Number,
        default: 0
      },

      averageSessionsPerWeek: {
        type: Number,
        default: 0
      },

      questionsPerSession: {
        type: Number,
        default: 0
      },

      mockTestsPerMonth: {
        type: Number,
        default: 0
      },

      aiChatInteractions: {
        type: Number,
        default: 0
      },

      communityInteractions: {
        type: Number,
        default: 0
      },

      featureSatisfaction: [
        {
          feature: String,
          rating: Number, // 1-5
          feedback: String
        }
      ]
    },

    // ============ DAILY ANALYTICS ============
    dailyAnalytics: [
      {
        date: Date,

        questionsAttempted: Number,

        accuracy: Number,

        timeSpent: Number,
        // In minutes

        sessionCount: Number,

        mocksAttempted: Number,

        streakMaintained: Boolean
      }
    ],

    // ============ MONTHLY SUMMARY ============
    monthlyProgress: [
      {
        month: String,
        // "2025-10"

        questionsAttempted: Number,

        accuracy: Number,

        improvementPercentage: Number,

        topPerformingSubject: String,

        weakestSubject: String,

        studyHours: Number,

        mocksAttempted: Number,

        averageMockScore: Number
      }
    ],

    // ============ COMPARISON & BENCHMARKING ============
    benchmarking: {
      userAccuracyVsAverage: Number,
      // Percentage difference

      userSpeedVsAverage: Number,
      // Percentage difference

      userRankPercentile: Number,
      // 0-100 percentile

      similarUsersCount: Number,

      performanceTier: {
        type: String,
        enum: ['Below Average', 'Average', 'Above Average', 'Excellent'],
        default: 'Average'
      }
    },

    // ============ SENTIMENT & MOOD ============
    sentimentTracking: {
      currentMood: {
        type: String,
        enum: ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'],
        default: 'Neutral'
      },

      stressLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
      },

      appSatisfaction: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
      },

      moodHistory: [
        {
          date: Date,
          mood: String,
          stressLevel: Number,
          context: String
          // "after_test", "during_study"
        }
      ]
    },

    // ============ LAST UPDATE ============
    lastAnalyticsUpdate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
userAnalyticsSchema.index({ userId: 1 });
userAnalyticsSchema.index({ 'overallPerformance.overallAccuracy': -1 });
userAnalyticsSchema.index({ 'timeManagement.currentStreak': -1 });

// ============ METHODS ============

// Get analytics summary
userAnalyticsSchema.methods.getAnalyticsSummary = function() {
  return {
    userId: this.userId,
    overallAccuracy: this.overallPerformance.overallAccuracy,
    totalQuestionsAttempted: this.overallPerformance.totalQuestionsAttempted,
    currentStreak: this.timeManagement.currentStreak,
    totalStudyHours: this.overallPerformance.totalStudyTime,
    examReadiness: this.predictions.examReadinessScore,
    expectedScore: this.predictions.expectedExamScore,
    strongSubjects: this.performanceAreas.strongSubjects,
    weakSubjects: this.performanceAreas.weakSubjects
  };
};

// Calculate overall accuracy
userAnalyticsSchema.methods.calculateOverallAccuracy = function() {
  if (this.overallPerformance.totalQuestionsAttempted === 0) {
    return 0;
  }

  const accuracy =
    (this.overallPerformance.totalQuestionsCorrect /
      this.overallPerformance.totalQuestionsAttempted) *
    100;

  this.overallPerformance.overallAccuracy = Math.round(accuracy * 100) / 100;
  return this.overallPerformance.overallAccuracy;
};

// Identify strong and weak areas
userAnalyticsSchema.methods.identifyPerformanceAreas = function() {
  this.performanceAreas.strongSubjects = this.subjectWisePerformance
    .filter((s) => s.accuracy > 75)
    .map((s) => s.subject);

  this.performanceAreas.weakSubjects = this.subjectWisePerformance
    .filter((s) => s.accuracy < 50)
    .map((s) => s.subject);

  this.performanceAreas.strongTopics = this.topicWisePerformance
    .filter((t) => t.accuracy > 80)
    .map((t) => t.topic);

  this.performanceAreas.weakTopics = this.topicWisePerformance
    .filter((t) => t.accuracy < 50)
    .map((t) => t.topic);

  this.performanceAreas.criticalAreas = this.topicWisePerformance
    .filter((t) => t.accuracy < 30)
    .map((t) => t.topic);

  return this.performanceAreas;
};

// Calculate exam readiness
userAnalyticsSchema.methods.calculateExamReadiness = function() {
  let readinessScore = 0;

  // 40% based on accuracy
  readinessScore +=
    (this.overallPerformance.overallAccuracy * 0.4) / 100;

  // 20% based on consistency
  readinessScore +=
    (this.timeManagement.consistencyScore * 0.2) / 100;

  // 20% based on mock test average
  readinessScore +=
    (this.overallPerformance.mockAverageAccuracy * 0.2) / 100;

  // 10% based on time management
  const timeManagementScore =
    (this.timeManagement.goalCompletionRate || 0) * 0.1;
  readinessScore += timeManagementScore / 100;

  // 10% based on weak areas handled
  const weakAreasHandled = Math.max(
    0,
    100 - this.performanceAreas.criticalAreas.length * 10
  );
  readinessScore += (weakAreasHandled * 0.1) / 100;

  this.predictions.examReadinessScore = Math.round(
    readinessScore * 100
  );

  return this.predictions.examReadinessScore;
};

// Generate AI recommendations
userAnalyticsSchema.methods.generateRecommendations = function() {
  const recommendations = [];

  // Based on weak topics
  if (this.performanceAreas.weakTopics.length > 0) {
    recommendations.push(
      `Focus on weak topics: ${this.performanceAreas.weakTopics.slice(0, 3).join(', ')}`
    );
  }

  // Based on critical areas
  if (this.performanceAreas.criticalAreas.length > 0) {
    recommendations.push(
      `Urgent: Improve critical areas: ${this.performanceAreas.criticalAreas.slice(0, 2).join(', ')}`
    );
  }

  // Based on consistency
  if (this.timeManagement.consistencyScore < 40) {
    recommendations.push(
      'Maintain consistent daily practice to improve performance'
    );
  }

  // Based on accuracy
  if (this.overallPerformance.overallAccuracy < 50) {
    recommendations.push('Increase practice time and focus on fundamentals');
  }

  // Based on study time
  if (this.overallPerformance.totalStudyTime < 20) {
    recommendations.push('You need more practice hours for better preparation');
  }

  // Based on improvement
  if (this.overallPerformance.improvementRate < 5) {
    recommendations.push(
      'Try different study strategies to improve faster'
    );
  }

  return recommendations;
};

module.exports = mongoose.model('UserAnalytics', userAnalyticsSchema);
