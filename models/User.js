const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // ============ BASIC INFORMATION ============
    email: {
      type: String,
    },

    password: {
      type: String,
    },

    phone: {
      type: String,
      default: null,
    },

    // ============ PROFILE INFORMATION ============
    profile: {
      firstName: {
        type: String,
      },

      lastName: {
        type: String,
      },

      profilePicture: {
        type: String,
        default: null,
      },
      fcmTokens: {
        type: [String],
        default: [],
      },

      dateOfBirth: {
        type: Date,
        default: null,
      },

      state: {
        type: String,
        default: null,
      },

      education: {
        type: String,
        enum: ['10th', '12th', 'Graduation', 'Post-graduation', 'Other'],
        default: null,
      },
    },

    // ============ EXAM SELECTION ============
    selectedExams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamHierarchy',
      },
    ],

    // ============ AI ASSESSMENT RESULTS ============
    aiAssessment: {
      knowledgeLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: null,
      },

      dailyStudyTime: {
        type: String,
        enum: ['1 hour', '3 hours', '5 hours', 'Flexible'],
        default: null,
      },

      preferredStudyTime: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
        default: null,
      },

      weaknessArea: {
        type: String,
        enum: [
          'Mathematics',
          'English',
          'General Knowledge',
          'Reasoning',
          'None',
        ],
        default: null,
      },

      currentStressLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: null,
      },

      assessmentCompletedAt: {
        type: Date,
        default: null,
      },
    },

    // ============ PROGRESS & STREAKS ============
    streak: {
      current: {
        type: Number,
        default: 0,
      },

      longest: {
        type: Number,
        default: 0,
      },

      lastActiveDate: {
        type: Date,
        default: null,
      },
    },

    // ============ GAMIFICATION ============
    points: {
      type: Number,
      default: 0,
    },

    badges: [String], // Array of badge names

    level: {
      type: Number,
      default: 1,
    },

    // ============ SUBSCRIPTION ============
    subscription: {
      plan: {
        type: String,
        enum: ['Free', 'Premium', 'Pro'],
        default: 'Free',
      },

      startDate: {
        type: Date,
        default: null,
      },

      endDate: {
        type: Date,
        default: null,
      },

      isActive: {
        type: Boolean,
        default: false,
      },

      autoRenew: {
        type: Boolean,
        default: false,
      },
    },

    // ============ ACCOUNT STATUS ============
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },

    // ============ SECURITY ============
    refreshTokens: [String], // For storing multiple refresh tokens

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    otpCode: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    isOTPVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ============ INDEXES FOR PERFORMANCE ============
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ selectedExams: 1 });
userSchema.index({ 'subscription.isActive': 1 });
userSchema.index({ createdAt: 1 });

// ============ VIRTUAL FIELDS ============
// Get full name without storing it separately
userSchema.virtual('fullName').get(function () {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// ============ PRE-SAVE MIDDLEWARE ============
// Hash password before saving if it's modified
userSchema.pre('save', async function (next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ============ INSTANCE METHODS ============
// Compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak on practice
userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = this.streak.lastActiveDate;

  if (lastActive) {
    const lastActiveDate = new Date(lastActive);
    lastActiveDate.setHours(0, 0, 0, 0);

    const diffTime = today - lastActiveDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      // Continue streak
      this.streak.current += 1;
    } else if (diffDays > 1) {
      // Reset streak
      this.streak.current = 1;
    }
    // If diffDays === 0, user already active today, don't change
  } else {
    // First time
    this.streak.current = 1;
  }

  // Update longest streak
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }

  this.streak.lastActiveDate = new Date();
};

// ============ STATIC METHODS ============
// Find user by email (useful for login)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Get user dashboard data (without sensitive info)
userSchema.methods.getDashboardData = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    profilePicture: this.profile.profilePicture,
    selectedExams: this.selectedExams,
    streak: this.streak.current,
    points: this.points,
    level: this.level,
    subscription: this.subscription.plan,
    isEmailVerified: this.isEmailVerified,
  };
};

module.exports = mongoose.model('User', userSchema);
