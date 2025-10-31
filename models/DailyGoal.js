const mongoose = require('mongoose');

const dailyGoalSchema = new mongoose.Schema(
  {
    // ============ GOAL IDENTIFICATION ============
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    goalDate: {
      type: Date,
      required: true
      // Date for which goal is set
    },

    dateString: {
      type: String,
      required: true
      // Format: "2025-10-30"
    },

    goalId: {
      type: String,
      unique: true,
      required: true
      // Auto-generated unique ID
    },

    // ============ GOAL TYPE ============
    goalType: {
      type: String,
      enum: [
        'Questions',
        'Study Hours',
        'Topics',
        'Mock Tests',
        'Accuracy',
        'Streak',
        'Custom'
      ],
      required: true
    },

    // ============ QUESTION GOALS ============
    questionsGoal: {
      targetQuestions: {
        type: Number,
        default: null
        // How many questions to solve
      },

      targetAccuracy: {
        type: Number,
        default: 75
        // Minimum accuracy target
      },

      subjectsToFocus: [String],
      // ["General Knowledge", "English"]

      difficultySplit: {
        easyPercentage: { type: Number, default: 0 },
        mediumPercentage: { type: Number, default: 100 },
        hardPercentage: { type: Number, default: 0 }
      },

      questionsAttempted: {
        type: Number,
        default: 0
      },

      questionsCorrect: {
        type: Number,
        default: 0
      },

      currentAccuracy: {
        type: Number,
        default: 0
      }
    },

    // ============ STUDY HOURS GOAL ============
    studyHoursGoal: {
      targetHours: {
        type: Number,
        default: null
      },

      sessionDuration: {
        type: Number,
        default: 60
        // Recommended session duration in minutes
      },

      sessionsTarget: {
        type: Number,
        default: null
        // Number of study sessions
      },

      topicsToStudy: [String],

      hoursCompleted: {
        type: Number,
        default: 0
      },

      sessionsCompleted: {
        type: Number,
        default: 0
      },

      isFlexible: {
        type: Boolean,
        default: false
        // Can be adjusted during day
      }
    },

    // ============ TOPIC GOALS ============
    topicGoal: {
      topicsToLearn: [
        {
          topicName: String,
          priority: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium'
          },
          timeAllocated: Number,
          // In minutes
          completed: Boolean,
          questionsToAttempt: Number
        }
      ],

      topicsCompleted: {
        type: Number,
        default: 0
      },

      masteryTarget: {
        type: Number,
        default: 70
        // Percentage
      }
    },

    // ============ MOCK TEST GOAL ============
    mockTestGoal: {
      mockTestsToAttempt: {
        type: Number,
        default: null
      },

      mockTestsCompleted: {
        type: Number,
        default: 0
      },

      targetScore: {
        type: Number,
        default: null
      },

      targetAccuracy: {
        type: Number,
        default: 75
      },

      mockTestsScheduled: [
        {
          mockTestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MockTest'
          },
          scheduledTime: String,
          // "2025-10-30 14:00"
          completed: Boolean,
          score: Number
        }
      ]
    },

    // ============ ACCURACY GOAL ============
    accuracyGoal: {
      targetAccuracy: {
        type: Number,
        required: function() {
          return this.goalType === 'Accuracy';
        }
      },

      currentAccuracy: {
        type: Number,
        default: 0
      },

      questionsToAttempt: {
        type: Number,
        default: 50
      }
    },

    // ============ STREAK GOAL ============
    streakGoal: {
      targetDays: {
        type: Number,
        default: 7
        // 7 days, 30 days, etc.
      },

      currentStreak: {
        type: Number,
        default: 0
      },

      streakBonus: {
        type: Number,
        default: 0
        // Extra points for maintaining streak
      }
    },

    // ============ CUSTOM GOALS ============
    customGoal: {
      goalDescription: String,

      metrics: [
        {
          metricName: String,
          targetValue: Number,
          currentValue: { type: Number, default: 0 },
          unit: String
        }
      ]
    },

    // ============ GOAL STATUS & COMPLETION ============
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Partially Completed', 'Failed', 'Abandoned'],
      default: 'Active'
    },

    completionPercentage: {
      type: Number,
      default: 0
      // 0-100
    },

    isCompletedToday: {
      type: Boolean,
      default: false
    },

    completedAt: {
      type: Date,
      default: null
    },

    // ============ DIFFICULTY LEVEL ============
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },

    suggestedByAI: {
      type: Boolean,
      default: false
    },

    // ============ REMINDERS & NOTIFICATIONS ============
    reminders: {
      reminderSet: {
        type: Boolean,
        default: true
      },

      reminderTime: {
        type: String,
        default: '09:00'
        // "09:00" format
      },

      reminderFrequency: {
        type: String,
        enum: ['Once', 'Morning', 'Afternoon', 'Evening', 'Hourly'],
        default: 'Morning'
      },

      remindersSent: {
        type: Number,
        default: 0
      }
    },

    // ============ MOTIVATION & REWARDS ============
    rewards: {
      pointsForCompletion: {
        type: Number,
        default: 50
      },

      coinsForCompletion: {
        type: Number,
        default: 10
      },

      bonusIfAhead: {
        type: Number,
        default: 20
        // Bonus if completed early
      }
    },

    // ============ TRACKING & PROGRESS ============
    progressUpdates: [
      {
        timestamp: Date,

        milestone: String,
        // "Completed 25% of questions"

        progress: Number,
        // 0-100

        note: String
      }
    ],

    // ============ FLEXIBILITY & ADJUSTMENT ============
    canAdjustGoal: {
      type: Boolean,
      default: true
    },

    adjustmentHistory: [
      {
        adjustedAt: Date,

        originalValue: Number,

        newValue: Number,

        reason: String
      }
    ],

    // ============ RECOMMENDATIONS ============
    aiRecommendations: [String],

    failureReasons: [String],
    // Why goal might fail

    successFactors: [String],
    // What helps succeed

    // ============ NEXT DAY PLANNING ============
    shouldContinueNextDay: {
      type: Boolean,
      default: false
    },

    nextDayGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyGoal',
      default: null
    },

    // ============ COMPARISON & ANALYTICS ============
    comparedToPreviousDay: {
      type: String,
      enum: ['More Ambitious', 'Same', 'Less Ambitious'],
      default: null
    },

    comparedToWeeklyAverage: {
      type: String,
      enum: ['Below Average', 'Average', 'Above Average'],
      default: null
    },

    achievementRate: {
      type: Number,
      default: 0
      // User's historical achievement rate for this type of goal
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
dailyGoalSchema.index({ userId: 1, goalDate: -1 });
dailyGoalSchema.index({ dateString: 1 });
dailyGoalSchema.index({ status: 1 });

// ============ VIRTUAL FIELDS ============
// Get remaining target
dailyGoalSchema.virtual('remainingQuestions').get(function() {
  if (this.goalType === 'Questions' && this.questionsGoal.targetQuestions) {
    return Math.max(
      0,
      this.questionsGoal.targetQuestions - this.questionsGoal.questionsAttempted
    );
  }
  return 0;
});

// Get remaining time
dailyGoalSchema.virtual('remainingHours').get(function() {
  if (this.goalType === 'Study Hours' && this.studyHoursGoal.targetHours) {
    return Math.max(
      0,
      this.studyHoursGoal.targetHours - this.studyHoursGoal.hoursCompleted
    );
  }
  return 0;
});

// ============ METHODS ============

// Update progress
dailyGoalSchema.methods.updateProgress = function(
  newQuestionsAttempted = null,
  newQuestionsCorrect = null,
  hoursSpent = null
) {
  if (newQuestionsAttempted !== null) {
    this.questionsGoal.questionsAttempted = newQuestionsAttempted;

    if (newQuestionsCorrect !== null) {
      this.questionsGoal.questionsCorrect = newQuestionsCorrect;

      const accuracy =
        (newQuestionsCorrect / newQuestionsAttempted) * 100;
      this.questionsGoal.currentAccuracy = Math.round(accuracy * 100) / 100;
    }
  }

  if (hoursSpent !== null) {
    this.studyHoursGoal.hoursCompleted = hoursSpent;
  }

  this.calculateCompletionPercentage();
  this.checkStatus();

  return {
    progress: this.completionPercentage,
    status: this.status
  };
};

// Calculate completion percentage
dailyGoalSchema.methods.calculateCompletionPercentage = function() {
  let completion = 0;

  switch (this.goalType) {
    case 'Questions':
      if (this.questionsGoal.targetQuestions > 0) {
        completion =
          (this.questionsGoal.questionsAttempted /
            this.questionsGoal.targetQuestions) *
          100;
      }
      break;

    case 'Study Hours':
      if (this.studyHoursGoal.targetHours > 0) {
        completion =
          (this.studyHoursGoal.hoursCompleted /
            this.studyHoursGoal.targetHours) *
          100;
      }
      break;

    case 'Topics':
      if (this.topicGoal.topicsToLearn.length > 0) {
        const completed = this.topicGoal.topicsToLearn.filter(
          (t) => t.completed
        ).length;
        completion =
          (completed / this.topicGoal.topicsToLearn.length) * 100;
      }
      break;

    case 'Mock Tests':
      if (this.mockTestGoal.mockTestsToAttempt > 0) {
        completion =
          (this.mockTestGoal.mockTestsCompleted /
            this.mockTestGoal.mockTestsToAttempt) *
          100;
      }
      break;
  }

  this.completionPercentage = Math.round(completion * 100) / 100;
  return this.completionPercentage;
};

// Check goal status
dailyGoalSchema.methods.checkStatus = function() {
  if (this.completionPercentage >= 100) {
    this.status = 'Completed';
    this.isCompletedToday = true;
    this.completedAt = new Date();
  } else if (this.completionPercentage > 0) {
    this.status = 'Partially Completed';
  } else {
    this.status = 'Active';
  }

  return this.status;
};

// Get goal summary
dailyGoalSchema.methods.getSummary = function() {
  return {
    goalId: this.goalId,
    goalType: this.goalType,
    goalDate: this.dateString,
    completionPercentage: this.completionPercentage,
    status: this.status,
    remaining: this.remainingQuestions || this.remainingHours,
    reward: this.rewards.pointsForCompletion
  };
};

// Adjust goal
dailyGoalSchema.methods.adjustGoal = function(newTarget, reason) {
  if (!this.canAdjustGoal) {
    return false;
  }

  const originalValue =
    this.questionsGoal.targetQuestions ||
    this.studyHoursGoal.targetHours ||
    null;

  this.adjustmentHistory.push({
    adjustedAt: new Date(),
    originalValue,
    newValue: newTarget,
    reason
  });

  if (this.goalType === 'Questions') {
    this.questionsGoal.targetQuestions = newTarget;
  } else if (this.goalType === 'Study Hours') {
    this.studyHoursGoal.targetHours = newTarget;
  }

  this.calculateCompletionPercentage();

  return true;
};

// Generate recommendations
dailyGoalSchema.methods.generateRecommendations = function() {
  this.aiRecommendations = [];

  if (this.difficulty === 'Hard') {
    this.aiRecommendations.push('This is a challenging goal - break it into smaller parts');
  }

  if (this.completionPercentage < 50 && this.createdAt.getTime() > Date.now() - 6 * 60 * 60 * 1000) {
    // Less than 50% done and more than 6 hours have passed
    this.aiRecommendations.push('You are behind schedule - try to catch up');
  }

  if (this.goalType === 'Questions' && this.questionsGoal.targetAccuracy > 85) {
    this.aiRecommendations.push(
      'Your accuracy target is high - focus on quality over quantity'
    );
  }

  return this.aiRecommendations;
};

module.exports = mongoose.model('DailyGoal', dailyGoalSchema);
