const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema(
  {
    // ============ SESSION IDENTIFICATION ============
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    sessionId: {
      type: String,
      unique: true,
      required: true
      // Auto-generated unique ID for session
    },

    // ============ EXAM & SUBJECT INFO ============
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamHierarchy',
      required: true
    },

    subject: {
      type: String,
      required: true
      // Example: "General Knowledge", "English"
    },

    sessionType: {
      type: String,
      enum: ['Quick Practice', 'Subject Practice', 'Weak Area Focus', 'Topic Practice'],
      default: 'Quick Practice'
    },

    // ============ SESSION PARAMETERS ============
    questionsCount: {
      type: Number,
      required: true
      // How many questions in this session
    },

    // ============ QUESTIONS ATTEMPTED ============
    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true
        },

        questionText: String,

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
          // null if not attempted, true/false if attempted
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
        }
      }
    ],

    // ============ SESSION TIMING ============
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

    sessionStatus: {
      type: String,
      enum: ['In Progress', 'Completed', 'Paused', 'Abandoned'],
      default: 'In Progress'
    },

    // ============ SCORING ============
    score: {
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

      totalMarks: {
        type: Number,
        default: 0
      },

      obtainedMarks: {
        type: Number,
        default: 0
      },

      accuracy: {
        type: Number,
        default: 0
        // Percentage
      },

      negativeMarking: {
        type: Number,
        default: 0
        // Total negative marks deducted
      }
    },

    // ============ ANALYTICS ============
    analytics: {
      averageTimePerQuestion: {
        type: Number,
        default: 0
        // In seconds
      },

      subjectWiseAccuracy: [
        {
          subject: String,
          accuracy: Number,
          questionsAttempted: Number
        }
      ],

      topicWiseAccuracy: [
        {
          topic: String,
          accuracy: Number,
          questionsAttempted: Number
        }
      ],

      difficultyWiseAccuracy: [
        {
          difficulty: String, // "Easy", "Medium", "Hard"
          accuracy: Number,
          questionsAttempted: Number
        }
      ]
    },

    // ============ PERFORMANCE NOTES ============
    strongTopics: [String],
    // Topics where user performed well

    weakTopics: [String],
    // Topics where user needs improvement

    recommendations: [String],
    // AI-generated recommendations

    // ============ STATUS ============
    isSubmitted: {
      type: Boolean,
      default: false
    },

    isReviewed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
practiceSessionSchema.index({ userId: 1, examId: 1 });
practiceSessionSchema.index({ userId: 1, createdAt: -1 });
practiceSessionSchema.index({ sessionId: 1 });
practiceSessionSchema.index({ sessionStatus: 1 });

// ============ VIRTUAL FIELDS ============
// Calculate total time spent
practiceSessionSchema.virtual('formattedTotalTime').get(function() {
  const hours = Math.floor(this.totalTimeSpent / 3600);
  const minutes = Math.floor((this.totalTimeSpent % 3600) / 60);
  const seconds = this.totalTimeSpent % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
});

// ============ METHODS ============

// Record user answer to a question
practiceSessionSchema.methods.recordAnswer = function(
  questionIndex,
  userAnswer,
  correctAnswer,
  timeSpent
) {
  if (questionIndex >= 0 && questionIndex < this.questions.length) {
    const question = this.questions[questionIndex];

    question.userAnswer = userAnswer;
    question.correctAnswer = correctAnswer;
    question.timeSpent = timeSpent;
    question.isCorrect = userAnswer === correctAnswer;

    if (question.isCorrect) {
      this.score.correctAnswers += 1;
    } else {
      this.score.incorrectAnswers += 1;
    }

    return true;
  }
  return false;
};

// Mark question for review
practiceSessionSchema.methods.markForReview = function(questionIndex) {
  if (
    questionIndex >= 0 &&
    questionIndex < this.questions.length
  ) {
    this.questions[questionIndex].isMarkedForReview = true;
    return true;
  }
  return false;
};

// Skip a question
practiceSessionSchema.methods.skipQuestion = function(questionIndex) {
  if (
    questionIndex >= 0 &&
    questionIndex < this.questions.length
  ) {
    this.questions[questionIndex].isSkipped = true;
    this.score.unattemptedQuestions += 1;
    return true;
  }
  return false;
};

// Calculate accuracy
practiceSessionSchema.methods.calculateAccuracy = function() {
  if (this.score.correctAnswers + this.score.incorrectAnswers === 0) {
    return 0;
  }

  const accuracy =
    (this.score.correctAnswers /
      (this.score.correctAnswers + this.score.incorrectAnswers)) *
    100;

  this.score.accuracy = Math.round(accuracy * 100) / 100;
  return this.score.accuracy;
};

// Calculate average time per question
practiceSessionSchema.methods.calculateAverageTime = function() {
  const attemptedQuestions = this.questions.filter(
    (q) => q.userAnswer !== null
  );

  if (attemptedQuestions.length === 0) {
    return 0;
  }

  const totalTime = attemptedQuestions.reduce(
    (sum, q) => sum + q.timeSpent,
    0
  );

  this.analytics.averageTimePerQuestion = Math.round(
    (totalTime / attemptedQuestions.length) * 100
  ) / 100;

  return this.analytics.averageTimePerQuestion;
};

// Finalize session (called when user submits)
practiceSessionSchema.methods.finalizeSession = function() {
  this.endTime = new Date();
  this.totalTimeSpent = Math.floor(
    (this.endTime - this.startTime) / 1000
  );

  this.sessionStatus = 'Completed';
  this.isSubmitted = true;

  // Calculate metrics
  this.calculateAccuracy();
  this.calculateAverageTime();

  // Calculate score
  this.score.unattemptedQuestions = this.questions.filter(
    (q) => q.userAnswer === null
  ).length;

  return {
    accuracy: this.score.accuracy,
    correctAnswers: this.score.correctAnswers,
    totalTimeSpent: this.totalTimeSpent,
    obtainedMarks: this.score.obtainedMarks
  };
};

// Get session summary
practiceSessionSchema.methods.getSummary = function() {
  return {
    sessionId: this.sessionId,
    examId: this.examId,
    subject: this.subject,
    totalQuestions: this.questionsCount,
    correctAnswers: this.score.correctAnswers,
    incorrectAnswers: this.score.incorrectAnswers,
    accuracy: this.score.accuracy,
    totalTimeSpent: this.formattedTotalTime,
    averageTimePerQuestion: this.analytics.averageTimePerQuestion,
    status: this.sessionStatus,
    completedAt: this.endTime
  };
};

module.exports = mongoose.model('PracticeSession', practiceSessionSchema);
