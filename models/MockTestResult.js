const mongoose = require('mongoose');

const mockTestResultSchema = new mongoose.Schema(
  {
    // ============ RESULT IDENTIFICATION ============
    resultId: {
      type: String,
      unique: true,
      required: true
      // Auto-generated unique ID like "RESULT_12345"
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    mockTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockTest',
      required: true
    },

    // ============ TEST INFORMATION ============
    testName: {
      type: String,
      required: true
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamHierarchy',
      required: true
    },

    testType: {
      type: String,
      enum: ['Full Test', 'Sectional Test', 'Subject Test', 'Topic Test'],
      default: 'Full Test'
    },

    // ============ TIMING INFORMATION ============
    startTime: {
      type: Date,
      default: Date.now
    },

    endTime: {
      type: Date,
      default: null
    },

    totalTimeSpent: {
      type: Number,
      default: 0
      // In seconds
    },

    timePerQuestion: {
      type: Number,
      default: 0
      // Average time per question in seconds
    },

    // ============ ANSWERS & QUESTIONS ============
    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true
        },

        questionNumber: Number,

        questionText: String,

        section: String,
        // Which section this belongs to

        subject: String,

        topic: String,

        difficultyLevel: String,
        // "Easy", "Medium", "Hard"

        userAnswer: {
          type: String,
          default: null
          // "A", "B", "C", "D" - null if not attempted
        },

        correctAnswer: String,

        isCorrect: {
          type: Boolean,
          default: null
          // null if not attempted
        },

        timeSpent: {
          type: Number,
          default: 0
          // In seconds
        },

        isMarkedForReview: {
          type: Boolean,
          default: false
        },

        isSkipped: {
          type: Boolean,
          default: false
        },

        marksObtained: {
          type: Number,
          default: 0
        },

        negativeMarkDeducted: {
          type: Number,
          default: 0
        }
      }
    ],

    // ============ SCORING DETAILS ============
    score: {
      totalMarks: {
        type: Number,
        required: true
      },

      obtainedMarks: {
        type: Number,
        required: true
      },

      percentage: {
        type: Number,
        required: true
        // Percentage score
      },

      correctAnswers: {
        type: Number,
        default: 0
      },

      incorrectAnswers: {
        type: Number,
        default: 0
      },

      unattemptedQuestions: {
        type: Number,
        default: 0
      },

      markedForReview: {
        type: Number,
        default: 0
      },

      totalNegativeMarks: {
        type: Number,
        default: 0
      }
    },

    // ============ SECTION-WISE PERFORMANCE ============
    sectionWisePerformance: [
      {
        sectionName: String,

        totalQuestions: Number,

        attemptedQuestions: Number,

        correctQuestions: Number,

        accuracy: Number,
        // Percentage

        marksObtained: Number,

        totalMarks: Number,

        timeSpent: Number
        // In seconds
      }
    ],

    // ============ SUBJECT-WISE PERFORMANCE ============
    subjectWisePerformance: [
      {
        subject: String,

        totalQuestions: Number,

        correctQuestions: Number,

        accuracy: Number,
        // Percentage

        marksObtained: Number,

        totalMarks: Number
      }
    ],

    // ============ DIFFICULTY-WISE PERFORMANCE ============
    difficultyWisePerformance: [
      {
        difficulty: String,
        // "Easy", "Medium", "Hard"

        totalQuestions: Number,

        correctQuestions: Number,

        accuracy: Number,
        // Percentage

        marksObtained: Number,

        totalMarks: Number
      }
    ],

    // ============ PERFORMANCE ANALYSIS ============
    analysis: {
      strongTopics: [String],
      // Topics with >80% accuracy

      weakTopics: [String],
      // Topics with <50% accuracy

      strengths: [String],
      // Identified strengths

      areasToImprove: [String],
      // Areas needing improvement

      recommendations: [String],
      // AI-generated recommendations

      comparativeAnalysis: {
        yourScore: Number,
        averageScore: Number,
        highestScore: Number,
        lowestScore: Number,
        yourRank: Number,
        totalUsers: Number
      }
    },

    // ============ EXAM READINESS ============
    examReadiness: {
      readinessScore: Number,
      // 0-100 scale

      predictedExamScore: Number,
      // Expected score in actual exam

      readinessLevel: {
        type: String,
        enum: ['Not Ready', 'Partially Ready', 'Ready', 'Highly Ready'],
        default: 'Not Ready'
      },

      timeToExam: Number,
      // Days remaining till exam

      confidenceLevel: Number
      // 0-10 scale
    },

    // ============ COMPARISON METRICS ============
    comparison: {
      betterThanAverage: Boolean,

      percentileRank: Number,
      // 0-100 percentile

      improvementFromLastTest: Number,
      // Percentage improvement

      consistencyScore: Number
      // Based on multiple test attempts
    },

    // ============ STATUS & SUBMISSION ============
    resultStatus: {
      type: String,
      enum: ['In Progress', 'Submitted', 'Evaluated', 'Reviewed'],
      default: 'Submitted'
    },

    isReviewed: {
      type: Boolean,
      default: false
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    reviewNotes: {
      type: String,
      default: null
    },

    // ============ VISIBILITY & SHARING ============
    isPublic: {
      type: Boolean,
      default: false
      // Can be shared with friends/community
    },

    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    isBookmarked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
mockTestResultSchema.index({ userId: 1, mockTestId: 1 });
mockTestResultSchema.index({ userId: 1, createdAt: -1 });
mockTestResultSchema.index({ resultId: 1 });
mockTestResultSchema.index({ 'score.percentage': -1 });
mockTestResultSchema.index({ examId: 1 });

// ============ VIRTUAL FIELDS ============
// Format score as string
mockTestResultSchema.virtual('scoreDisplay').get(function() {
  return `${this.score.obtainedMarks}/${this.score.totalMarks}`;
});

// Pass/Fail status
mockTestResultSchema.virtual('passStatus').get(function() {
  const passingPercentage = 40; // 40% is passing
  return this.score.percentage >= passingPercentage ? 'Passed' : 'Failed';
});

// ============ METHODS ============

// Get result summary
mockTestResultSchema.methods.getResultSummary = function() {
  return {
    resultId: this.resultId,
    testName: this.testName,
    obtainedMarks: this.score.obtainedMarks,
    totalMarks: this.score.totalMarks,
    percentage: this.score.percentage,
    status: this.passStatus,
    totalTimeSpent: this.totalTimeSpent,
    attemptedAt: this.startTime,
    comparativeRank: this.comparison.percentileRank
  };
};

// Calculate readiness score based on performance
mockTestResultSchema.methods.calculateReadinessScore = function() {
  let readinessScore = 0;

  // 40% based on percentage score
  readinessScore += (this.score.percentage * 0.4) / 100;

  // 30% based on accuracy
  const accuracy =
    (this.score.correctAnswers /
      (this.score.correctAnswers + this.score.incorrectAnswers)) *
    100;
  readinessScore += (accuracy * 0.3) / 100;

  // 20% based on time management
  const totalTestMarks = this.score.totalMarks;
  const timeEfficiency =
    ((this.score.obtainedMarks / this.totalTimeSpent) * 60) / totalTestMarks;
  readinessScore += Math.min(timeEfficiency * 0.2, 0.2);

  // 10% based on weak topics (if no weak topics, full 10%)
  const weakTopicPenalty = this.analysis.weakTopics.length * 0.02;
  readinessScore += Math.max(0.1 - weakTopicPenalty, 0);

  this.examReadiness.readinessScore = Math.round(readinessScore * 100);

  // Determine readiness level
  if (this.examReadiness.readinessScore >= 75) {
    this.examReadiness.readinessLevel = 'Highly Ready';
  } else if (this.examReadiness.readinessScore >= 60) {
    this.examReadiness.readinessLevel = 'Ready';
  } else if (this.examReadiness.readinessScore >= 40) {
    this.examReadiness.readinessLevel = 'Partially Ready';
  } else {
    this.examReadiness.readinessLevel = 'Not Ready';
  }

  return this.examReadiness;
};

// Generate AI recommendations
mockTestResultSchema.methods.generateRecommendations = function() {
  this.analysis.recommendations = [];

  // Weak area recommendation
  if (this.analysis.weakTopics.length > 0) {
    this.analysis.recommendations.push(
      `Focus on weak topics: ${this.analysis.weakTopics.join(', ')}`
    );
  }

  // Time management recommendation
  if (this.score.unattemptedQuestions > 5) {
    this.analysis.recommendations.push(
      'Work on time management - too many unattempted questions'
    );
  }

  // Difficulty progression recommendation
  const easyAccuracy =
    this.difficultyWisePerformance.find((d) => d.difficulty === 'Easy')
      ?.accuracy || 0;

  if (easyAccuracy < 80) {
    this.analysis.recommendations.push('Strengthen basics before attempting hard questions');
  }

  // Practice recommendation
  if (this.score.percentage < 50) {
    this.analysis.recommendations.push(
      'Increase daily practice hours - significant improvement needed'
    );
  }

  return this.analysis.recommendations;
};

// Get downloadable report
mockTestResultSchema.methods.generateReport = function() {
  return {
    testName: this.testName,
    date: this.createdAt,
    score: this.scoreDisplay,
    percentage: this.score.percentage,
    status: this.passStatus,
    totalTime: `${Math.floor(this.totalTimeSpent / 60)} minutes`,
    correctAnswers: this.score.correctAnswers,
    incorrectAnswers: this.score.incorrectAnswers,
    unattempted: this.score.unattemptedQuestions,
    sectionWise: this.sectionWisePerformance,
    subjectWise: this.subjectWisePerformance,
    readiness: this.examReadiness,
    recommendations: this.analysis.recommendations
  };
};

module.exports = mongoose.model('MockTestResult', mockTestResultSchema);
