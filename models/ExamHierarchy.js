// models/ExamHierarchy.js
const mongoose = require('mongoose');

const examHierarchySchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      default: '',
    },

    // Hierarchy Structure
    level: {
      type: Number,
      required: true,
      // 0 = Main Category (Police, Army, Banking, SSC, Teaching, Railway, Defence)
      // 1 = Sub Category (State Police, Central Forces, etc.)
      // 2 = Specific Exam (Delhi Police Constable, UP Police SI, etc.)
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamHierarchy',
      default: null,
    },
    hierarchyPath: {
      type: [String],
      default: [],
      // Example: ["POLICE", "STATE_POLICE", "DELHI", "CONSTABLE"]
    },

    // Visual & UI Design
    icon: {
      type: String,
      default: '📋', // emoji or icon class
    },
    color: {
      type: String,
      default: '#00A99D', // hex color code
    },

    // Exam Pattern & Preparation Details (for leaf nodes - specific exams)
    examDetails: {
      // Exam Frequency
      frequency: {
        type: String,
        enum: ['yearly', 'bi-yearly', 'quarterly', 'monthly', 'ongoing'],
        default: 'yearly',
      },

      // Eligibility for Students
      eligibility: {
        ageMin: { type: Number, default: 18 },
        ageMax: { type: Number, default: 35 },
        education: {
          type: [String],
          default: [],
          // ["10th", "12th", "graduation", "post-graduation"]
        },
      },

      // Exam Pattern (Important for Preparation)
      examPattern: {
        stages: {
          type: [String],
          default: [],
          // ["prelims", "mains", "interview", "physical", "medical"]
        },
        duration: {
          type: Number,
          default: 0, // in minutes
        },
        totalMarks: {
          type: Number,
          default: 100,
        },
        totalQuestions: {
          type: Number,
          default: 100,
        },
        negativeMarking: {
          type: Boolean,
          default: false,
        },
        negativeMarks: {
          type: Number,
          default: 0.25, // marks deducted per wrong answer
        },

        // Subject-wise Pattern
        sections: [
          {
            name: String, // "General Knowledge", "English", "Math"
            marks: Number,
            questions: Number,
            duration: Number, // in minutes
            difficultyLevel: {
              type: String,
              enum: ['easy', 'medium', 'hard'],
              default: 'medium',
            },
          },
        ],
      },

      // Syllabus for Preparation
      syllabus: {
        subjects: {
          type: [String],
          default: [],
          // ["General Knowledge", "English", "Mathematics", "Reasoning"]
        },

        // Detailed Topics for Each Subject
        detailedSyllabus: [
          {
            subject: String, // "General Knowledge"
            topics: [String], // ["Indian History", "Geography", "Polity"]
            weightage: Number, // percentage in exam
            difficulty: {
              type: String,
              enum: ['easy', 'medium', 'hard'],
              default: 'medium',
            },
          },
        ],

        // Important Books & Resources
        recommendedBooks: [
          {
            subject: String,
            bookName: String,
            author: String,
            importance: {
              type: String,
              enum: ['must-read', 'recommended', 'optional'],
              default: 'recommended',
            },
          },
        ],
      },
    },

    // Preparation Statistics (for Students)
    preparationStats: {
      // Competition Level
      totalVacancies: {
        type: Number,
        default: 0,
      },
      expectedApplicants: {
        type: Number,
        default: 0,
      },
      competitionRatio: {
        type: String,
        default: 'N/A', // "1:100", "1:50", etc.
      },

      // Difficulty & Success Metrics
      difficultyLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'very-hard'],
        default: 'medium',
      },
      averagePreparationTime: {
        type: Number,
        default: 6, // in months
      },
      successRate: {
        type: Number,
        default: 0, // percentage of students who clear
      },

      // Student Engagement
      studentsPreparingCount: {
        type: Number,
        default: 0,
      },
      popularityScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    // Geographic Scope (for exam applicability)
    examScope: {
      type: String,
      enum: ['all-india', 'state-specific', 'regional'],
      default: 'state-specific',
    },
    applicableStates: {
      type: [String],
      default: [],
      // ["Delhi", "UP", "Maharashtra"] or ["All India"]
    },

    // Important Exam Dates (for preparation timeline)
    examSchedule: {
      notificationDate: Date,
      applicationStart: Date,
      applicationEnd: Date,
      examDate: Date,
      resultDate: Date,
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // Status for App Management
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    hasActiveNotification: {
      type: Boolean,
      default: false,
    },

    // Search & Discovery
    searchKeywords: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

examHierarchySchema.virtual('fullName').get(function () {
  if (Array.isArray(this.hierarchyPath)) {
    return this.hierarchyPath.join(' > ');
  }
  return '';
});
examHierarchySchema.virtual('preparationDifficulty').get(function () {
  if (typeof this.preparationStats?.competitionRatio === 'string') {
    const parts = this.preparationStats.competitionRatio.split(':');
    if (parts.length === 2) {
      const ratio = parseInt(parts[1], 10);
      if (ratio > 200) return 'Very Hard';
      if (ratio > 100) return 'Hard';
      if (ratio > 50) return 'Medium';
      return 'Easy';
    }
  }
  return 'Unknown';
});

examHierarchySchema.index({ level: 1, parentId: 1 });
examHierarchySchema.index({ code: 1 });
examHierarchySchema.index({ 'preparationStats.popularityScore': -1 });
examHierarchySchema.index({ hierarchyPath: 1 });
examHierarchySchema.index({ isActive: 1, isPopular: 1 });
examHierarchySchema.index({ applicableStates: 1 });

// Methods for Exam Preparation
examHierarchySchema.statics.findByLevel = function (level, parentId = null) {
  const query = { level, isActive: true };
  if (parentId) query.parentId = parentId;

  return this.find(query).sort({
    'preparationStats.popularityScore': -1,
    name: 1,
  });
};

examHierarchySchema.statics.findMainCategories = function () {
  return this.find({ level: 0, isActive: true }).sort({
    'preparationStats.popularityScore': -1,
  });
};

examHierarchySchema.statics.findByState = function (state) {
  return this.find({
    isActive: true,
    $or: [{ applicableStates: state }, { examScope: 'all-india' }],
  }).sort({ 'preparationStats.popularityScore': -1 });
};

examHierarchySchema.statics.searchForPreparation = function (
  searchTerm,
  filters = {}
) {
  const query = {
    isActive: true,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { displayName: { $regex: searchTerm, $options: 'i' } },
      { searchKeywords: { $in: [new RegExp(searchTerm, 'i')] } },
    ],
  };

  // Apply preparation-focused filters
  if (filters.level !== undefined) query.level = filters.level;
  if (filters.state) {
    query.$or = [
      { applicableStates: filters.state },
      { examScope: 'all-india' },
    ];
  }
  if (filters.difficulty) {
    query['preparationStats.difficultyLevel'] = filters.difficulty;
  }
  if (filters.education) {
    query['examDetails.eligibility.education'] = { $in: [filters.education] };
  }

  return this.find(query).sort({ 'preparationStats.popularityScore': -1 });
};

module.exports = mongoose.model('ExamHierarchy', examHierarchySchema);
