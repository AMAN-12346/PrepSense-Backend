const mongoose = require('mongoose');

const currentAffairsSchema = new mongoose.Schema(
  {
    // ============ ARTICLE INFORMATION ============
    articleTitle: {
      type: String,
      required: true,
      trim: true
    },

    articleSlug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
      // URL-friendly slug
    },

    articleContent: {
      type: String,
      required: true
      // Full article text
    },

    articleSummary: {
      type: String,
      required: true
      // 2-3 line summary
    },

    // ============ ARTICLE METADATA ============
    source: {
      type: String,
      default: null
      // "The Hindu", "Indian Express", "BBC"
    },

    sourceUrl: {
      type: String,
      default: null
      // Link to original article
    },

    publishedDate: {
      type: Date,
      required: true
    },

    articleDate: {
      type: String,
      required: true
      // Format: "2025-10-30"
    },

    // ============ CATEGORIZATION ============
    category: {
      type: String,
      required: true,
      enum: [
        'Politics',
        'Economy',
        'International',
        'Sports',
        'Science & Technology',
        'Defense',
        'Environment',
        'Social',
        'Governance',
        'Other'
      ]
    },

    subcategory: {
      type: String,
      default: null
      // Specific area like "Budget", "Elections"
    },

    relevantExams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamHierarchy'
      }
    ],
    // Which exams this article is relevant for

    relevantTopics: [String],
    // ["Indian Politics", "Electoral Process"]

    keywords: [String],
    // ["Election", "Voting", "Democracy"]

    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },

    // ============ CONTENT MEDIA ============
    thumbnailImage: {
      type: String,
      default: null
      // URL to thumbnail
    },

    coverImage: {
      type: String,
      default: null
      // URL to cover image
    },

    videoUrl: {
      type: String,
      default: null
      // Explanation video if available
    },

    // ============ AI-GENERATED QUESTIONS ============
    aiGeneratedQuestions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question'
        },

        questionText: String,

        options: [
          {
            optionLetter: String,
            optionText: String,
            isCorrect: Boolean
          }
        ],

        correctAnswer: String,

        explanation: String,

        difficultyLevel: String
      }
    ],

    questionsCount: {
      type: Number,
      default: 0
      // Auto-generated questions count
    },

    // ============ ARTICLE INSIGHTS ============
    keyHighlights: [String],
    // Important points from article

    importantFacts: [String],
    // Key facts students should know

    historicalContext: {
      type: String,
      default: null
      // Background information
    },

    futureImplications: {
      type: String,
      default: null
      // What this might lead to
    },

    relatedTopics: [String],
    // Related topics in syllabus

    // ============ LEARNING RESOURCES ============
    relatedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CurrentAffairs'
      }
    ],
    // Link to related current affairs

    readingTime: {
      type: Number,
      default: 5
      // In minutes
    },

    recommendedBooks: [String],
    // Books to read for deeper understanding

    // ============ ENGAGEMENT & ANALYTICS ============
    stats: {
      views: {
        type: Number,
        default: 0
      },

      questionsAttempted: {
        type: Number,
        default: 0
      },

      averageQuestionsAccuracy: {
        type: Number,
        default: 0
      },

      saves: {
        type: Number,
        default: 0
      },

      shares: {
        type: Number,
        default: 0
      },

      ratings: {
        totalRatings: {
          type: Number,
          default: 0
        },

        averageRating: {
          type: Number,
          default: 0
          // 1-5 scale
        },

        fiveStarCount: Number,
        fourStarCount: Number,
        threeStarCount: Number,
        twoStarCount: Number,
        oneStarCount: Number
      },

      userComments: {
        type: Number,
        default: 0
      }
    },

    // ============ USER INTERACTIONS ============
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    // Users who saved this article

    userRatings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },

        rating: {
          type: Number,
          min: 1,
          max: 5
        },

        feedback: String,

        ratedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // ============ EXAM RELEVANCE ============
    examRelevance: [
      {
        examId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ExamHierarchy'
        },

        relevanceScore: Number,
        // 1-100 scale

        topicsMatched: [String],

        suggestedForLevel: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Intermediate'
        }
      }
    ],

    // ============ MODERATION & QUALITY ============
    isApproved: {
      type: Boolean,
      default: false
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    isVerified: {
      type: Boolean,
      default: false
      // Fact-checked and verified
    },

    factCheckStatus: {
      type: String,
      enum: ['Not Checked', 'Verified', 'Partially Verified', 'Disputed'],
      default: 'Not Checked'
    },

    // ============ CREATOR INFO ============
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    editorNotes: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
currentAffairsSchema.index({ articleDate: -1 });
currentAffairsSchema.index({ category: 1 });
currentAffairsSchema.index({ isApproved: 1, isActive: 1 });
currentAffairsSchema.index({ keywords: 1 });
currentAffairsSchema.index({ relevantExams: 1 });
currentAffairsSchema.index({ 'stats.averageQuestionsAccuracy': -1 });

// ============ VIRTUAL FIELDS ============
// Get article view percentage
currentAffairsSchema.virtual('populityScore').get(function() {
  return this.stats.views + this.stats.saves * 2 + this.stats.shares * 3;
});

// ============ METHODS ============

// Get article preview
currentAffairsSchema.methods.getPreview = function() {
  return {
    articleId: this._id,
    title: this.articleTitle,
    summary: this.articleSummary,
    category: this.category,
    publishedDate: this.publishedDate,
    thumbnail: this.thumbnailImage,
    readingTime: this.readingTime,
    questionsCount: this.questionsCount,
    averageRating: this.stats.ratings.averageRating
  };
};

// Get full article with questions
currentAffairsSchema.methods.getFullArticle = function() {
  return {
    articleId: this._id,
    title: this.articleTitle,
    content: this.articleContent,
    summary: this.articleSummary,
    category: this.category,
    publishedDate: this.publishedDate,
    source: this.source,
    thumbnail: this.thumbnailImage,
    readingTime: this.readingTime,
    keyHighlights: this.keyHighlights,
    questions: this.aiGeneratedQuestions,
    stats: this.stats,
    averageRating: this.stats.ratings.averageRating
  };
};

// Add user rating
currentAffairsSchema.methods.addRating = function(userId, rating, feedback = null) {
  // Remove old rating from this user if exists
  this.userRatings = this.userRatings.filter(
    (r) => r.userId.toString() !== userId.toString()
  );

  // Add new rating
  this.userRatings.push({
    userId,
    rating,
    feedback
  });

  // Recalculate average rating
  const totalRating = this.userRatings.reduce((sum, r) => sum + r.rating, 0);
  this.stats.ratings.averageRating = totalRating / this.userRatings.length;
  this.stats.ratings.totalRatings = this.userRatings.length;

  return this.stats.ratings.averageRating;
};

// Record article view
currentAffairsSchema.methods.recordView = function() {
  this.stats.views += 1;
  return this.stats.views;
};

// Record question attempt
currentAffairsSchema.methods.recordQuestionAttempt = function(accuracy) {
  this.stats.questionsAttempted += 1;

  // Update average accuracy
  const prevAvg = this.stats.averageQuestionsAccuracy;
  this.stats.averageQuestionsAccuracy =
    (prevAvg * (this.stats.questionsAttempted - 1) + accuracy) /
    this.stats.questionsAttempted;

  return this.stats.averageQuestionsAccuracy;
};

// Get relevant for exam
currentAffairsSchema.methods.isRelevantForExam = function(examId) {
  return this.relevantExams.some(
    (id) => id.toString() === examId.toString()
  );
};

// Get exam-wise relevance
currentAffairsSchema.methods.getExamRelevance = function(examId) {
  const relevance = this.examRelevance.find(
    (r) => r.examId.toString() === examId.toString()
  );

  return relevance || { relevanceScore: 0, topicsMatched: [] };
};

// Save for user
currentAffairsSchema.methods.saveForUser = function(userId) {
  if (!this.savedBy.includes(userId)) {
    this.savedBy.push(userId);
    this.stats.saves += 1;
    return true;
  }
  return false;
};

// Remove save for user
currentAffairsSchema.methods.removeFromSaved = function(userId) {
  const initialLength = this.savedBy.length;
  this.savedBy = this.savedBy.filter((id) => id.toString() !== userId.toString());

  if (this.savedBy.length < initialLength) {
    this.stats.saves -= 1;
    return true;
  }
  return false;
};

module.exports = mongoose.model('CurrentAffairs', currentAffairsSchema);
