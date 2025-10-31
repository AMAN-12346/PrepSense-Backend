const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    // ============ BADGE INFORMATION ============
    badgeName: {
      type: String,
      required: true,
      trim: true
      // Example: "Question Master", "Streak Hero"
    },

    badgeCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true
      // Example: "QUESTION_MASTER_001"
    },

    badgeDescription: {
      type: String,
      required: true
      // What this badge represents
    },

    // ============ BADGE APPEARANCE ============
    badgeIcon: {
      type: String,
      default: null
      // URL to badge icon/image
    },

    badgeEmoji: {
      type: String,
      default: '🏅'
      // Emoji representation
    },

    badgeColor: {
      type: String,
      default: '#FFD700'
      // Color code
    },

    // ============ BADGE TIER & RARITY ============
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
      default: 'Bronze'
    },

    rarity: {
      type: String,
      enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
      default: 'Common'
    },

    difficultyToEarn: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Very Hard'],
      default: 'Medium'
    },

    // ============ EARNING CRITERIA ============
    criteria: {
      criteriaType: {
        type: String,
        enum: [
          'Questions Solved',
          'Accuracy',
          'Streak',
          'Mock Tests',
          'Topics Mastered',
          'Time Spent',
          'Milestones',
          'Social',
          'Consistency',
          'Speed'
        ],
        required: true
      },

      criteriaDescription: String,
      // "Solve 100 questions correctly"

      targetValue: {
        type: Number,
        required: true
      },
      // 100 for "Solve 100 questions"

      unit: String,
      // "questions", "days", "hours"

      relatedMetric: String,
      // "totalQuestionsCorrect", "currentStreak"

      specificExams: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ExamHierarchy'
        }
      ],
      // Only for specific exams (null for all exams)

      specificSubjects: [String],
      // Only for specific subjects

      specificTopics: [String],
      // Only for specific topics

      minAccuracy: {
        type: Number,
        default: 0
        // Percentage
      },

      maxAttempts: {
        type: Number,
        default: null
        // Max attempts allowed (null = unlimited)
      }
    },

    // ============ BADGE REWARDS ============
    rewards: {
      pointsAwarded: {
        type: Number,
        default: 0
      },

      coinAwarded: {
        type: Number,
        default: 0
      },

      bonusMultiplier: {
        type: Number,
        default: 1
        // Points multiplier for future achievements
      }
    },

    // ============ BADGE PROGRESSION ============
    hasProgression: {
      type: Boolean,
      default: false
      // Does this badge have levels?
    },

    progressionLevels: [
      {
        level: Number,
        // Level 1, 2, 3, etc.

        name: String,
        // "Beginner Hero", "Master Hero"

        targetValue: Number,
        // Value needed for this level

        icon: String,
        // Icon for this level

        description: String
      }
    ],

    // ============ CATEGORY & CLASSIFICATION ============
    badgeCategory: {
      type: String,
      enum: [
        'Performance',
        'Consistency',
        'Social',
        'Mastery',
        'Achievement',
        'Speed',
        'Milestone',
        'Limited Time',
        'Special'
      ],
      required: true
    },

    badgeGroup: {
      type: String,
      default: null
      // Group related badges together
      // E.g., "Streak Badges", "Performance Badges"
    },

    // ============ VISIBILITY & SHARING ============
    isPublic: {
      type: Boolean,
      default: true
      // Show on user profile
    },

    isShareable: {
      type: Boolean,
      default: true
      // Can user share on social media
    },

    shareMessage: {
      type: String,
      default: null
      // Custom share message template
    },

    // ============ SPECIAL PROPERTIES ============
    isLimitedTime: {
      type: Boolean,
      default: false
      // Available for limited period
    },

    validFrom: {
      type: Date,
      default: null
    },

    validUntil: {
      type: Date,
      default: null
    },

    isHidden: {
      type: Boolean,
      default: false
      // Secret badge - not shown in list
    },

    prerequisiteBadges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
      }
    ],
    // Must earn these first

    // ============ STATISTICS ============
    stats: {
      totalEarned: {
        type: Number,
        default: 0
      },

      usersWithBadge: {
        type: Number,
        default: 0
      },

      percentageOfUsers: {
        type: Number,
        default: 0
      },

      earnRate: {
        type: Number,
        default: 0
        // Per day
      }
    },

    // ============ GAMIFICATION IMPACT ============
    gamificationImpact: {
      xpAwarded: {
        type: Number,
        default: 10
      },

      levelUpContribution: {
        type: Number,
        default: 5
        // Percentage contribution to next level
      },

      motivationBoost: {
        type: Number,
        default: 5
        // 0-10 scale
      }
    },

    // ============ NOTIFICATIONS & MESSAGING ============
    unlockMessage: {
      type: String,
      default: null
      // Message when badge is unlocked
    },

    lockedMessage: {
      type: String,
      default: null
      // Message when badge is locked
    },

    congratulationsMessage: {
      type: String,
      default: null
      // Celebration message
    },

    // ============ ADMIN & MODERATION ============
    isActive: {
      type: Boolean,
      default: true
    },

    isApproved: {
      type: Boolean,
      default: false
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    notes: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
badgeSchema.index({ badgeCode: 1 });
badgeSchema.index({ badgeCategory: 1 });
badgeSchema.index({ tier: 1 });
badgeSchema.index({ isActive: 1, isApproved: 1 });
badgeSchema.index({ 'stats.usersWithBadge': -1 });

// ============ METHODS ============

// Check if user meets criteria
badgeSchema.methods.checkEarnedCriteria = function(userMetrics) {
  const { criteriaType, targetValue, minAccuracy } = this.criteria;

  switch (criteriaType) {
    case 'Questions Solved':
      return (
        userMetrics.questionsCorrect >= targetValue &&
        userMetrics.accuracy >= minAccuracy
      );

    case 'Accuracy':
      return userMetrics.accuracy >= targetValue;

    case 'Streak':
      return userMetrics.currentStreak >= targetValue;

    case 'Mock Tests':
      return (
        userMetrics.mocksAttempted >= targetValue &&
        userMetrics.mockAvgScore >= minAccuracy
      );

    case 'Topics Mastered':
      return userMetrics.masteredTopics >= targetValue;

    case 'Time Spent':
      return userMetrics.totalTimeSpent >= targetValue;

    case 'Milestones':
      return userMetrics.milestone >= targetValue;

    case 'Social':
      return userMetrics.socialScore >= targetValue;

    case 'Consistency':
      return userMetrics.consistencyScore >= targetValue;

    case 'Speed':
      return userMetrics.averageSpeed <= targetValue;

    default:
      return false;
  }
};

// Get badge info for display
badgeSchema.methods.getBadgeInfo = function() {
  return {
    badgeId: this._id,
    name: this.badgeName,
    description: this.badgeDescription,
    icon: this.badgeIcon,
    emoji: this.badgeEmoji,
    tier: this.tier,
    rarity: this.rarity,
    category: this.badgeCategory,
    rewards: this.rewards,
    criteria: this.criteria.criteriaDescription
  };
};

// Get earning progress
badgeSchema.methods.getProgressToEarn = function(userMetrics) {
  const { criteriaType, targetValue } = this.criteria;
  let currentValue = 0;

  switch (criteriaType) {
    case 'Questions Solved':
      currentValue = userMetrics.questionsCorrect;
      break;
    case 'Streak':
      currentValue = userMetrics.currentStreak;
      break;
    case 'Mock Tests':
      currentValue = userMetrics.mocksAttempted;
      break;
    case 'Time Spent':
      currentValue = userMetrics.totalTimeSpent;
      break;
    default:
      currentValue = userMetrics[this.criteria.relatedMetric] || 0;
  }

  const progress = Math.min((currentValue / targetValue) * 100, 100);

  return {
    progress: Math.round(progress),
    current: currentValue,
    target: targetValue,
    remaining: Math.max(targetValue - currentValue, 0),
    earned: currentValue >= targetValue
  };
};

// Update statistics
badgeSchema.methods.recordEarned = function() {
  this.stats.totalEarned += 1;
  this.stats.usersWithBadge += 1;
  return this.stats.totalEarned;
};

// Check if available now
badgeSchema.methods.isAvailable = function() {
  if (!this.isActive) return false;

  if (this.isLimitedTime) {
    const now = new Date();
    return (
      this.validFrom <= now &&
      (!this.validUntil || this.validUntil >= now)
    );
  }

  return true;
};

// Get badge unlock story/narrative
badgeSchema.methods.getUnlockStory = function() {
  return {
    title: this.badgeName,
    message: this.unlockMessage,
    celebration: this.congratulationsMessage,
    rewards: this.rewards,
    shareMessage: this.shareMessage
  };
};

module.exports = mongoose.model('Badge', badgeSchema);
