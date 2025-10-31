const mongoose = require('mongoose');

const wellnessCheckInSchema = new mongoose.Schema(
  {
    // ============ USER IDENTIFICATION ============
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // ============ CHECK-IN DATE & TIME ============
    checkInDate: {
      type: Date,
      required: true
      // Date of check-in
    },

    dateString: {
      type: String,
      required: true
      // Format: "2025-10-30"
    },

    timeOfDay: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
      default: null
    },

    // ============ MOOD & EMOTIONS ============
    mood: {
      type: String,
      enum: [
        'Very Happy',
        'Happy',
        'Neutral',
        'Sad',
        'Very Sad',
        'Anxious',
        'Overwhelmed',
        'Calm',
        'Energetic',
        'Tired'
      ],
      required: true
    },

    moodScore: {
      type: Number,
      min: 1,
      max: 10,
      required: true
      // 1 = Very Sad, 10 = Very Happy
    },

    emotionDetails: [String],
    // ["Stressed", "Motivated", "Confused"]

    // ============ STRESS & ANXIETY ============
    stressLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: true
      // 1 = No stress, 10 = Extremely stressed
    },

    stressReasons: [String],
    // ["Too many topics", "Exam anxiety", "Work pressure"]

    anxietyLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },

    // ============ SLEEP & REST ============
    sleepLastNight: {
      type: String,
      enum: ['<4 hours', '4-6 hours', '6-8 hours', '>8 hours', 'No sleep'],
      required: true
    },

    sleepQuality: {
      type: String,
      enum: ['Very Poor', 'Poor', 'Fair', 'Good', 'Very Good'],
      required: true
    },

    fallAsleepTime: {
      type: Number,
      default: null
      // Minutes to fall asleep
    },

    wokeUpDuring: {
      type: Boolean,
      default: false
      // Did user wake up during night
    },

    feelingRested: {
      type: Boolean,
      required: true
    },

    // ============ PHYSICAL HEALTH ============
    physicalHealth: {
      energyLevel: {
        type: String,
        enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
        required: true
      },

      bodySoreness: {
        type: String,
        enum: ['None', 'Minor', 'Moderate', 'Severe'],
        default: 'None'
      },

      headache: Boolean,

      eyeStrain: Boolean,

      backPain: Boolean,

      neckPain: Boolean,

      otherPhysicalIssues: [String],
      // ["Chest pain", "Fatigue"]

      hasExercised: Boolean,

      exerciseDuration: {
        type: Number,
        default: 0
        // In minutes
      }
    },

    // ============ NUTRITION & DIET ============
    nutrition: {
      breakfastTaken: Boolean,

      lunchTaken: Boolean,

      dinnerTaken: Boolean,

      totalMealsCount: {
        type: Number,
        default: 0
      },

      mealQuality: {
        type: String,
        enum: ['Poor', 'Average', 'Good', 'Very Good'],
        default: 'Average'
      },

      waterIntake: {
        type: String,
        enum: ['Very Low', 'Low', 'Adequate', 'High', 'Very High'],
        default: 'Adequate'
      },

      caffeineCups: {
        type: Number,
        default: 0
      },

      unhealthySnacks: Boolean,

      notes: String
    },

    // ============ STUDY & PREPARATION ============
    studyStatus: {
      studiedToday: Boolean,

      studyHours: {
        type: Number,
        default: 0
      },

      topicsStudied: [String],

      studyFocus: {
        type: String,
        enum: ['Weak Areas', 'New Topics', 'Revision', 'Mixed'],
        default: null
      },

      studyProductivity: {
        type: String,
        enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
        default: null
      },

      studyFocusLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: null
        // How focused were they
      },

      questionsAttempted: {
        type: Number,
        default: 0
      }
    },

    // ============ MENTAL HEALTH & MINDFULNESS ============
    mentalWellness: {
      meditationDone: Boolean,

      meditationDuration: {
        type: Number,
        default: 0
        // In minutes
      },

      breathingExerciseDone: Boolean,

      yogaDone: Boolean,

      journalingDone: Boolean,

      readingForPleasure: Boolean,

      musicListened: Boolean,

      socialTime: {
        type: String,
        enum: ['None', 'With family', 'With friends', 'Online'],
        default: 'None'
      },

      socialTimeDuration: {
        type: Number,
        default: 0
        // In minutes
      },

      motivationLevel: {
        type: String,
        enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
        default: 'Medium'
      },

      confidenceLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: null
        // Confidence about exam
      }
    },

    // ============ PRODUCTIVITY & GOALS ============
    goalsMetToday: Boolean,

    goalsMetPercentage: {
      type: Number,
      default: 0
      // 0-100
    },

    dailyChallengeCompleted: Boolean,

    streakMaintained: Boolean,

    // ============ CONCERNS & SUPPORT ============
    concerns: [String],
    // ["Burnout", "Lack of concentration", "Health issues"]

    needsSupport: Boolean,

    supportNeeded: [String],
    // ["Motivation", "Doubt solving", "Mental health"]

    hasReachedOutForHelp: Boolean,

    // ============ RECOMMENDATIONS & FEEDBACK ============
    aiRecommendations: [String],
    // Auto-generated suggestions

    userNotes: {
      type: String,
      default: null
      // User's personal notes
    },

    // ============ WELLNESS SCORE ============
    wellnessScore: {
      type: Number,
      default: 0
      // 0-100 composite score
    },

    wellnessCategory: {
      type: String,
      enum: ['Critical', 'Poor', 'Fair', 'Good', 'Excellent'],
      default: 'Fair'
    },

    // ============ TRENDS & PATTERNS ============
    trend: {
      type: String,
      enum: ['Improving', 'Stable', 'Declining'],
      default: 'Stable'
    },

    comparedToPreviousDay: {
      type: String,
      enum: ['Better', 'Same', 'Worse'],
      default: 'Same'
    },

    comparedToWeeklyAverage: {
      type: String,
      enum: ['Better', 'Same', 'Worse'],
      default: 'Same'
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
wellnessCheckInSchema.index({ userId: 1, checkInDate: -1 });
wellnessCheckInSchema.index({ dateString: 1 });
wellnessCheckInSchema.index({ wellnessScore: -1 });

// ============ VIRTUAL FIELDS ============
// Get date only
wellnessCheckInSchema.virtual('dateOnly').get(function() {
  return this.checkInDate.toISOString().split('T')[0];
});

// ============ METHODS ============

// Calculate wellness score
wellnessCheckInSchema.methods.calculateWellnessScore = function() {
  let score = 50; // Base score

  // Mood contribution (20%)
  score += (this.moodScore * 0.2) - 1;

  // Sleep contribution (20%)
  const sleepMap = {
    '<4 hours': 2,
    '4-6 hours': 6,
    '6-8 hours': 10,
    '>8 hours': 8,
    'No sleep': 0
  };
  score += (sleepMap[this.sleepLastNight] || 0) * 0.2;

  // Stress level (15%) - inverse
  score += (10 - this.stressLevel) * 1.5;

  // Physical health (15%)
  let physicalScore = 0;
  if (this.physicalHealth.energyLevel === 'High' || 
      this.physicalHealth.energyLevel === 'Very High') {
    physicalScore += 3;
  }
  if (!this.physicalHealth.headache) physicalScore += 2;
  if (!this.physicalHealth.eyeStrain) physicalScore += 2;
  if (this.physicalHealth.hasExercised) physicalScore += 3;
  score += physicalScore * 1.5;

  // Study productivity (15%)
  if (this.studyStatus.studiedToday) {
    score += 5;
  }
  if (this.studyStatus.studyProductivity === 'High' ||
      this.studyStatus.studyProductivity === 'Very High') {
    score += 5;
  }

  // Goal completion (10%)
  score += (this.goalsMetPercentage / 10) * 1;

  // Cap between 0-100
  this.wellnessScore = Math.max(0, Math.min(100, score));

  // Categorize
  if (this.wellnessScore >= 80) {
    this.wellnessCategory = 'Excellent';
  } else if (this.wellnessScore >= 60) {
    this.wellnessCategory = 'Good';
  } else if (this.wellnessScore >= 40) {
    this.wellnessCategory = 'Fair';
  } else if (this.wellnessScore >= 20) {
    this.wellnessCategory = 'Poor';
  } else {
    this.wellnessCategory = 'Critical';
  }

  return this.wellnessScore;
};

// Generate AI recommendations
wellnessCheckInSchema.methods.generateRecommendations = function() {
  this.aiRecommendations = [];

  // Sleep recommendations
  if (this.sleepLastNight === '<4 hours' || this.sleepLastNight === 'No sleep') {
    this.aiRecommendations.push('Get more sleep - aim for 6-8 hours tonight');
  }

  // Stress recommendations
  if (this.stressLevel >= 7) {
    this.aiRecommendations.push('Your stress level is high - try meditation or yoga');
    this.aiRecommendations.push('Take short breaks between study sessions');
  }

  // Exercise recommendations
  if (!this.physicalHealth.hasExercised) {
    this.aiRecommendations.push('Exercise for at least 30 minutes - boosts mood and focus');
  }

  // Nutrition recommendations
  if (this.nutrition.totalMealsCount < 2) {
    this.aiRecommendations.push('Eat more regularly - skipped meals affect focus');
  }

  if (this.nutrition.waterIntake === 'Low' || this.nutrition.waterIntake === 'Very Low') {
    this.aiRecommendations.push('Drink more water - stay hydrated for better concentration');
  }

  // Study recommendations
  if (!this.studyStatus.studiedToday) {
    this.aiRecommendations.push('Try to study even for 30 minutes today');
  }

  if (this.studyStatus.studyProductivity === 'Low') {
    this.aiRecommendations.push(
      'Try changing your study location or technique for better focus'
    );
  }

  // Mental wellness recommendations
  if (!this.mentalWellness.meditationDone && this.stressLevel >= 6) {
    this.aiRecommendations.push('Try a 5-minute meditation session to calm your mind');
  }

  if (!this.mentalWellness.socialTime || this.mentalWellness.socialTime === 'None') {
    this.aiRecommendations.push('Spend some time with family or friends - social connection helps');
  }

  // Health concerns
  if (this.concerns.length > 0) {
    this.aiRecommendations.push(
      `You mentioned concerns about ${this.concerns.join(', ')} - consider seeking support`
    );
  }

  return this.aiRecommendations;
};

// Get wellness summary
wellnessCheckInSchema.methods.getSummary = function() {
  return {
    date: this.dateString,
    mood: this.mood,
    moodScore: this.moodScore,
    stressLevel: this.stressLevel,
    sleepHours: this.sleepLastNight,
    wellnessScore: this.wellnessScore,
    wellnessCategory: this.wellnessCategory,
    studyHours: this.studyStatus.studyHours,
    energyLevel: this.physicalHealth.energyLevel,
    recommendations: this.aiRecommendations
  };
};

// Compare with previous day
wellnessCheckInSchema.methods.compareToPreviousDay = function(previousCheckIn) {
  if (!previousCheckIn) return null;

  const moodImproved = this.moodScore > previousCheckIn.moodScore;
  const stressImproved = this.stressLevel < previousCheckIn.stressLevel;
  const sleepImproved =
    ['6-8 hours', '>8 hours'].includes(this.sleepLastNight) &&
    !['6-8 hours', '>8 hours'].includes(previousCheckIn.sleepLastNight);

  const overallTrend =
    (moodImproved ? 1 : 0) + (stressImproved ? 1 : 0) + (sleepImproved ? 1 : 0);

  if (overallTrend > 1) {
    this.comparedToPreviousDay = 'Better';
  } else if (overallTrend === 0) {
    this.comparedToPreviousDay = 'Worse';
  } else {
    this.comparedToPreviousDay = 'Same';
  }

  return this.comparedToPreviousDay;
};

module.exports = mongoose.model('WellnessCheckIn', wellnessCheckInSchema);
