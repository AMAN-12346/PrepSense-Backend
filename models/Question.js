const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    // ============ BASIC INFORMATION ============
    questionText: {
      type: String,
      required: true,
      trim: true
    },

    questionNumber: {
      type: Number,
      default: 0
    },

    // ============ EXAM & SUBJECT MAPPING ============
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamHierarchy',
      required: true
    },

    subject: {
      type: String,
      required: true
      // Example: "General Knowledge", "English", "Mathematics", "Reasoning"
    },

    topic: {
      type: String,
      required: true
      // Example: "Indian History", "Arithmetic", "Verb Tenses"
    },

    subtopic: {
      type: String,
      default: null
      // Example: "Mughal Empire", "Percentages"
    },

    // ============ QUESTION TYPE & OPTIONS ============
    questionType: {
      type: String,
      enum: ['MCQ', 'True/False', 'Fill-in-blank'],
      default: 'MCQ'
    },

    options: [
      {
        optionLetter: String, // "A", "B", "C", "D"
        optionText: String,
        isCorrect: Boolean
      }
    ],

    correctAnswer: {
      type: String,
      required: true
      // Example: "A", "B", "C", "D"
    },

    // ============ EXPLANATION & LEARNING ============
    explanation: {
      type: String,
      required: true
      // Why this is correct answer - detailed explanation
    },

    keyPoints: [String],
    // ["Point 1", "Point 2"]
    // Key learning points about this question

    relatedConcepts: [String],
    // ["Concept 1", "Concept 2"]
    // Related topics to learn

    // ============ DIFFICULTY & STATISTICS ============
    difficultyLevel: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },

    // Analytics tracking
    stats: {
      totalAttempts: {
        type: Number,
        default: 0
      },

      correctAttempts: {
        type: Number,
        default: 0
      },

      accuracy: {
        type: Number,
        default: 0
        // Calculated as (correctAttempts / totalAttempts) * 100
      },

      averageTimeSpent: {
        type: Number,
        default: 0
        // In seconds
      }
    },

    // ============ CONTENT & REFERENCES ============
    imageUrl: {
      type: String,
      default: null
      // URL to question image if needed
    },

    sourceYear: {
      type: Number,
      default: null
      // Year this question was asked (if from actual exam)
    },

    sourceExam: {
      type: String,
      default: null
      // Which exam paper this came from
    },

    // ============ STATUS ============
    isActive: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: false
      // Admin verified this question
    },

    isFlagged: {
      type: Boolean,
      default: false
      // If there's an issue with this question
    },

    flagReason: {
      type: String,
      default: null
      // Why was this flagged?
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
questionSchema.index({ examId: 1, subject: 1, topic: 1 });
questionSchema.index({ difficultyLevel: 1 });
questionSchema.index({ isActive: 1 });
questionSchema.index({ 'stats.accuracy': -1 });

// ============ METHODS ============
// Get all options formatted
questionSchema.methods.getFormattedOptions = function() {
  return this.options.map(opt => ({
    letter: opt.optionLetter,
    text: opt.optionText
  }));
};

// Check if answer is correct
questionSchema.methods.isAnswerCorrect = function(userAnswer) {
  return userAnswer === this.correctAnswer;
};

// Update stats when question is attempted
questionSchema.methods.recordAttempt = function(isCorrect, timeSpent) {
  this.stats.totalAttempts += 1;

  if (isCorrect) {
    this.stats.correctAttempts += 1;
  }

  // Update accuracy percentage
  this.stats.accuracy = (this.stats.correctAttempts / this.stats.totalAttempts) * 100;

  // Update average time (simple average)
  const currentAvgTime = this.stats.averageTimeSpent;
  this.stats.averageTimeSpent =
    (currentAvgTime * (this.stats.totalAttempts - 1) + timeSpent) /
    this.stats.totalAttempts;
};

module.exports = mongoose.model('Question', questionSchema);
