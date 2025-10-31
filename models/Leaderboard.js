const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    // ============ LEADERBOARD IDENTIFICATION ============
    leaderboardType: {
      type: String,
      enum: [
        'Global Weekly',
        'Global Monthly',
        'Global All-Time',
        'Exam Specific Weekly',
        'Exam Specific Monthly',
        'Exam Specific All-Time',
        'Subject Weekly',
        'Subject Monthly',
        'Friend',
        'State',
        'Regional'
      ],
      required: true
    },

    leaderboardCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true
      // Example: "GLOBAL_WEEKLY_2025_W44"
    },

    description: {
      type: String,
      default: null
    },

    // ============ SCOPE & PERIOD ============
    scope: {
      type: String,
      enum: ['Global', 'Exam Specific', 'Subject Specific', 'Friends', 'State', 'Regional'],
      required: true
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamHierarchy',
      default: null
      // For exam-specific leaderboards
    },

    subject: {
      type: String,
      default: null
      // For subject-specific leaderboards
    },

    period: {
      type: String,
      enum: ['Weekly', 'Monthly', 'All-Time'],
      required: true
    },

    year: Number,
    week: Number,
    month: Number,
    // For time-based leaderboards

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    // ============ LEADERBOARD ENTRIES ============
    rankings: [
      {
        rank: {
          type: Number,
          required: true
          // 1, 2, 3, etc.
        },

        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },

        userFullName: String,

        profilePicture: String,

        // ============ PRIMARY METRIC ============
        primaryScore: {
          type: Number,
          required: true
          // Points, accuracy, or streak depending on leaderboard type
        },

        // ============ SECONDARY METRICS ============
        secondaryMetrics: {
          accuracy: Number,
          // Percentage

          questionsAttempted: Number,

          questionsCorrect: Number,

          streak: Number,
          // Current streak days

          mockTestsAttempted: Number,

          studyHours: Number,

          consistency: Number,
          // 0-100 score
        },

        // ============ BADGES & ACHIEVEMENTS ============
        badges: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
          }
        ],

        level: Number,

        // ============ TREND & CHANGE ============
        previousRank: {
          type: Number,
          default: null
          // Rank in previous period
        },

        rankChange: {
          type: Number,
          default: 0
          // +5 if moved up 5 positions, -3 if moved down 3
        },

        trend: {
          type: String,
          enum: ['Up', 'Down', 'Stable'],
          default: 'Stable'
        },

        // ============ TIMESTAMP ============
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // ============ LEADERBOARD STATISTICS ============
    stats: {
      totalParticipants: {
        type: Number,
        default: 0
      },

      averageScore: {
        type: Number,
        default: 0
      },

      medianScore: {
        type: Number,
        default: 0
      },

      highestScore: {
        type: Number,
        default: 0
      },

      lowestScore: {
        type: Number,
        default: 0
      },

      scoreDistribution: {
        topTen: Number,
        // Average score of top 10
        topHundred: Number,
        // Average score of top 100
        topThousand: Number
        // Average score of top 1000
      }
    },

    // ============ TIER DIVISIONS ============
    tiers: [
      {
        tierName: String,
        // "Bronze", "Silver", "Gold", "Platinum", "Diamond"

        minRank: Number,
        maxRank: Number,

        minScore: Number,
        maxScore: Number,

        tierColor: String,

        tierIcon: String,

        participantsCount: Number
      }
    ],

    // ============ REWARDS & INCENTIVES ============
    rewards: {
      topThreeRewards: [
        {
          rank: Number,
          // 1, 2, 3

          points: Number,

          coins: Number,

          badge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
          },

          rewardMessage: String
        }
      ],

      topTenRewards: {
        points: Number,
        coins: Number
      },

      topHundredRewards: {
        points: Number,
        coins: Number
      }
    },

    // ============ FILTERING OPTIONS ============
    filters: {
      minQuestionsAttempted: {
        type: Number,
        default: 10
        // Minimum questions to be in leaderboard
      },

      minAccuracy: {
        type: Number,
        default: 0
      },

      excludeLowEngagement: {
        type: Boolean,
        default: false
      }
    },

    // ============ VISIBILITY & STATUS ============
    isActive: {
      type: Boolean,
      default: true
    },

    isPublished: {
      type: Boolean,
      default: false
      // Only published leaderboards are visible
    },

    isFeatured: {
      type: Boolean,
      default: false
      // Show on home screen
    },

    // ============ SETTINGS ============
    settings: {
      hideScores: {
        type: Boolean,
        default: false
      },

      anonymizeNames: {
        type: Boolean,
        default: false
      },

      allowScreenshot: {
        type: Boolean,
        default: true
      },

      showOnUserProfile: {
        type: Boolean,
        default: true
      }
    },

    // ============ ENGAGEMENT ============
    engagement: {
      views: {
        type: Number,
        default: 0
      },

      clicksToProfile: {
        type: Number,
        default: 0
      },

      sharesCount: {
        type: Number,
        default: 0
      }
    },

    // ============ ADMIN & MAINTENANCE ============
    isVerified: {
      type: Boolean,
      default: false
    },

    verificationNotes: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
leaderboardSchema.index({ leaderboardCode: 1 });
leaderboardSchema.index({ leaderboardType: 1, period: 1 });
leaderboardSchema.index({ isActive: 1, isPublished: 1 });
leaderboardSchema.index({ 'rankings.userId': 1 });
leaderboardSchema.index({ startDate: -1, endDate: -1 });

// ============ METHODS ============

// Get user's rank in this leaderboard
leaderboardSchema.methods.getUserRank = function(userId) {
  const userRanking = this.rankings.find(
    (r) => r.userId.toString() === userId.toString()
  );

  return userRanking || null;
};

// Get top N users
leaderboardSchema.methods.getTopUsers = function(limit = 10) {
  return this.rankings.slice(0, limit).map((r) => ({
    rank: r.rank,
    userId: r.userId,
    name: r.userFullName,
    score: r.primaryScore,
    accuracy: r.secondaryMetrics.accuracy,
    badges: r.badges.length,
    trend: r.trend
  }));
};

// Get users in range
leaderboardSchema.methods.getUsersInRange = function(startRank, endRank) {
  return this.rankings
    .filter((r) => r.rank >= startRank && r.rank <= endRank)
    .map((r) => ({
      rank: r.rank,
      name: r.userFullName,
      score: r.primaryScore,
      trend: r.trend
    }));
};

// Get user with surrounding context
leaderboardSchema.methods.getUserContext = function(userId, contextRadius = 2) {
  const userRanking = this.getUserRank(userId);

  if (!userRanking) return null;

  const startIdx = Math.max(0, userRanking.rank - 1 - contextRadius);
  const endIdx = Math.min(
    this.rankings.length,
    userRanking.rank + contextRadius
  );

  return {
    userRank: userRanking,
    surrounding: this.rankings.slice(startIdx, endIdx)
  };
};

// Check if user is in top tier
leaderboardSchema.methods.isUserInTopTier = function(userId) {
  const userRank = this.getUserRank(userId);

  if (!userRank) return false;

  const topTierMax = Math.ceil(this.stats.totalParticipants * 0.1); // Top 10%
  return userRank.rank <= topTierMax;
};

// Get tier info
leaderboardSchema.methods.getTierForUser = function(userId) {
  const userRank = this.getUserRank(userId);

  if (!userRank) return null;

  const userTier = this.tiers.find(
    (tier) =>
      userRank.rank >= tier.minRank &&
      userRank.rank <= tier.maxRank
  );

  return userTier || null;
};

// Record leaderboard view
leaderboardSchema.methods.recordView = function() {
  this.engagement.views += 1;
  return this.engagement.views;
};

// Get leaderboard summary
leaderboardSchema.methods.getSummary = function() {
  return {
    leaderboardId: this._id,
    type: this.leaderboardType,
    period: this.period,
    totalParticipants: this.stats.totalParticipants,
    topScore: this.stats.highestScore,
    averageScore: this.stats.averageScore,
    startDate: this.startDate,
    endDate: this.endDate,
    topThree: this.getTopUsers(3)
  };
};

// Update rankings
leaderboardSchema.methods.updateRanking = function(userId, newScore) {
  // Find if user already exists
  const existingRanking = this.rankings.find(
    (r) => r.userId.toString() === userId.toString()
  );

  if (existingRanking) {
    existingRanking.previousRank = existingRanking.rank;
    existingRanking.primaryScore = newScore;
  } else {
    this.rankings.push({
      userId,
      primaryScore: newScore
    });
  }

  // Re-sort rankings
  this.rankings.sort((a, b) => b.primaryScore - a.primaryScore);

  // Update ranks
  this.rankings.forEach((r, index) => {
    r.rank = index + 1;
    if (r.previousRank) {
      r.rankChange = r.previousRank - r.rank;
      r.trend = r.rankChange > 0 ? 'Up' : r.rankChange < 0 ? 'Down' : 'Stable';
    }
  });

  // Update stats
  this.stats.totalParticipants = this.rankings.length;
  this.stats.highestScore = this.rankings[0]?.primaryScore || 0;
  this.stats.lowestScore =
    this.rankings[this.rankings.length - 1]?.primaryScore || 0;

  const totalScore = this.rankings.reduce((sum, r) => sum + r.primaryScore, 0);
  this.stats.averageScore = Math.round(totalScore / this.rankings.length);

  return this.rankings.find((r) => r.userId.toString() === userId.toString());
};

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
