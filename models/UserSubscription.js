const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema(
  {
    // ============ SUBSCRIPTION IDENTIFICATION ============
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    subscriptionId: {
      type: String,
      unique: true,
      required: true
      // Auto-generated unique ID like "USUB_12345"
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true
    },

    planName: {
      type: String,
      required: true
      // Cached plan name
    },

    planType: {
      type: String,
      enum: ['Free', 'Premium', 'Pro'],
      required: true
    },

    // ============ SUBSCRIPTION TIMELINE ============
    startDate: {
      type: Date,
      required: true
      // When subscription started
    },

    endDate: {
      type: Date,
      required: true
      // When subscription ends
    },

    renewalDate: {
      type: Date,
      default: null
      // Next renewal date if auto-renewal is on
    },

    trialStartDate: {
      type: Date,
      default: null
      // Trial period start
    },

    trialEndDate: {
      type: Date,
      default: null
      // Trial period end
    },

    isTrialActive: {
      type: Boolean,
      default: false
    },

    // ============ STATUS & LIFECYCLE ============
    status: {
      type: String,
      enum: [
        'Trial',
        'Active',
        'Paused',
        'Cancelled',
        'Expired',
        'Past Due',
        'Suspended'
      ],
      required: true,
      default: 'Active'
    },

    cancellationReason: {
      type: String,
      default: null
    },

    cancelledAt: {
      type: Date,
      default: null
    },

    cancelledBy: {
      type: String,
      enum: ['User', 'Admin', 'System', 'Payment Failed'],
      default: null
    },

    // ============ PAYMENT INFORMATION ============
    payment: {
      // Razorpay subscription ID
      razorpaySubscriptionId: {
        type: String,
        default: null
      },

      // Razorpay customer ID
      razorpayCustomerId: {
        type: String,
        default: null
      },

      // Payment method
      paymentMethod: {
        type: String,
        enum: ['card', 'netbanking', 'upi', 'wallet', 'manual'],
        default: 'card'
      },

      // Card/Payment instrument
      instrumentLast4: {
        type: String,
        default: null
        // Last 4 digits of card
      },

      // Billing email
      billingEmail: {
        type: String,
        required: true
      },

      // Billing phone
      billingPhone: {
        type: String,
        required: true
      },

      // Amount paid
      amountPaid: {
        type: Number,
        default: 0
      },

      // Currency
      currency: {
        type: String,
        enum: ['INR', 'USD'],
        default: 'INR'
      }
    },

    // ============ PRICING & DISCOUNTS ============
    pricing: {
      basePlanAmount: {
        type: Number,
        required: true
      },

      discountApplied: {
        type: Number,
        default: 0
      },

      couponCode: {
        type: String,
        default: null
      },

      taxAmount: {
        type: Number,
        default: 0
      },

      totalAmount: {
        type: Number,
        required: true
      },

      amountInPaise: {
        type: Number,
        required: true
        // For Razorpay transactions
      }
    },

    // ============ USAGE TRACKING ============
    usage: {
      questionsAttempted: {
        type: Number,
        default: 0
      },

      questionsLimit: {
        type: Number,
        default: -1
        // -1 = unlimited
      },

      questionsRemainingToday: {
        type: Number,
        default: null
      },

      mockTestsAttempted: {
        type: Number,
        default: 0
      },

      mockTestsLimit: {
        type: Number,
        default: -1
      },

      aiChatUsed: {
        type: Number,
        default: 0
      },

      aiChatLimit: {
        type: Number,
        default: -1
      },

      practiceSessionsUsed: {
        type: Number,
        default: 0
      },

      practiceSessionsLimit: {
        type: Number,
        default: -1
      },

      lastUsedDate: Date,

      usageResetDate: Date
      // When limits reset
    },

    // ============ RENEWAL & AUTO-PAYMENT ============
    autoRenewal: {
      enabled: {
        type: Boolean,
        default: true
      },

      nextBillingDate: Date,

      retryCount: {
        type: Number,
        default: 0
        // Failed payment retry count
      },

      maxRetries: {
        type: Number,
        default: 3
      }
    },

    // ============ BILLING HISTORY ============
    billingHistory: [
      {
        transactionId: String,
        // Razorpay transaction ID

        date: Date,

        amount: Number,

        status: {
          type: String,
          enum: ['Success', 'Failed', 'Pending'],
          default: 'Success'
        },

        paymentMethod: String,

        invoiceUrl: String,

        razorpayPaymentId: String
      }
    ],

    // ============ REFERRAL & PROMO ============
    referral: {
      referralCode: {
        type: String,
        unique: true,
        sparse: true
      },

      referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSubscription',
        default: null
      },

      referralDiscount: {
        type: Number,
        default: 0
      },

      referralBonusApplied: {
        type: Boolean,
        default: false
      }
    },

    // ============ FEATURE ACCESS ============
    features: {
      videoExplanations: {
        type: Boolean,
        default: false
      },

      customStudyPlan: {
        type: Boolean,
        default: false
      },

      advancedAnalytics: {
        type: Boolean,
        default: false
      },

      prioritySupport: {
        type: Boolean,
        default: false
      },

      adFree: {
        type: Boolean,
        default: false
      },

      offlineDownload: {
        type: Boolean,
        default: false
      },

      doubtSolving: {
        type: Boolean,
        default: false
      },

      interviewPrep: {
        type: Boolean,
        default: false
      },

      personalMentor: {
        type: Boolean,
        default: false
      },

      currentAffairsAccess: {
        type: Boolean,
        default: false
      }
    },

    // ============ DOWNGRADES & UPGRADES ============
    upgrades: [
      {
        fromPlan: String,

        toPlan: String,

        upgradeDate: Date,

        prorationCredit: Number,
        // Amount credited for proration

        upgradeAmount: Number
      }
    ],

    downgrades: [
      {
        fromPlan: String,

        toPlan: String,

        downgradeDate: Date,

        effectiveFromDate: Date,
        // When downgrade takes effect

        downgradeReason: String
      }
    ],

    // ============ NOTIFICATIONS & REMINDERS ============
    notifications: {
      expiryReminderSent: {
        type: Boolean,
        default: false
      },

      expiryReminderSentAt: Date,

      renewalReminder: {
        type: Boolean,
        default: false
      },

      renewalReminderSentAt: Date,

      paymentFailureNotified: {
        type: Boolean,
        default: false
      },

      lastNotificationSentAt: Date
    },

    // ============ PAYMENT FAILURE HANDLING ============
    paymentFailure: {
      failed: {
        type: Boolean,
        default: false
      },

      failureReason: String,

      failedAt: Date,

      retryCount: {
        type: Number,
        default: 0
      },

      nextRetryAt: Date,

      lastRetryAt: Date
    },

    // ============ ANALYTICS & ENGAGEMENT ============
    analytics: {
      usagePercentage: {
        type: Number,
        default: 0
        // 0-100
      },

      lastActiveDate: Date,

      daysSinceActive: {
        type: Number,
        default: 0
      },

      engagementScore: {
        type: Number,
        default: 0
        // 0-100
      },

      churnRisk: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
      },

      retentionScore: {
        type: Number,
        default: 0
      }
    },

    // ============ LOYALTY & REWARDS ============
    loyalty: {
      subscriptionMonths: {
        type: Number,
        default: 0
        // Total months subscribed
      },

      loyaltyTier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        default: 'Bronze'
      },

      loyaltyPoints: {
        type: Number,
        default: 0
      },

      loyaltyBenefits: [String],
      // ["20% discount", "Priority support"]

      nextTierUnlockDate: Date
    },

    // ============ CUSTOMER NOTES ============
    notes: {
      type: String,
      default: null
    },

    internalNotes: {
      type: String,
      default: null,
      select: false
      // Only for admins
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
userSubscriptionSchema.index({ userId: 1 });
userSubscriptionSchema.index({ subscriptionId: 1 });
userSubscriptionSchema.index({ status: 1 });
userSubscriptionSchema.index({ renewalDate: 1 });
userSubscriptionSchema.index({ endDate: 1 });
userSubscriptionSchema.index({ 'analytics.churnRisk': 1 });

// ============ VIRTUAL FIELDS ============
// Get days remaining
userSubscriptionSchema.virtual('daysRemaining').get(function() {
  const today = new Date();
  const diffTime = this.endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Check if expiring soon (within 7 days)
userSubscriptionSchema.virtual('expiringsoon').get(function() {
  return this.daysRemaining <= 7 && this.daysRemaining > 0;
});

// Check if subscription is active
userSubscriptionSchema.virtual('isActive').get(function() {
  return (
    this.status === 'Active' &&
    this.endDate > new Date()
  );
});

// ============ METHODS ============

// Get subscription summary
userSubscriptionSchema.methods.getSummary = function() {
  return {
    subscriptionId: this.subscriptionId,
    planName: this.planName,
    status: this.status,
    startDate: this.startDate,
    endDate: this.endDate,
    daysRemaining: this.daysRemaining,
    autoRenewal: this.autoRenewal.enabled,
    amount: this.pricing.totalAmount
  };
};

// Check usage limit
userSubscriptionSchema.methods.canUseFeature = function(feature) {
  if (this.status !== 'Active' || !this.isActive) {
    return false;
  }

  // Check feature access
  if (this.features[feature] === false) {
    return false;
  }

  // Check usage limits
  switch (feature) {
    case 'questions':
      if (this.usage.questionsLimit === -1) return true;
      return this.usage.questionsAttempted < this.usage.questionsLimit;

    case 'mockTests':
      if (this.usage.mockTestsLimit === -1) return true;
      return this.usage.mockTestsAttempted < this.usage.mockTestsLimit;

    case 'aiChat':
      if (this.usage.aiChatLimit === -1) return true;
      return this.usage.aiChatUsed < this.usage.aiChatLimit;

    default:
      return true;
  }
};

// Record usage
userSubscriptionSchema.methods.recordUsage = function(feature, amount = 1) {
  switch (feature) {
    case 'questions':
      this.usage.questionsAttempted += amount;
      break;

    case 'mockTests':
      this.usage.mockTestsAttempted += amount;
      break;

    case 'aiChat':
      this.usage.aiChatUsed += amount;
      break;

    case 'practiceSessions':
      this.usage.practiceSessionsUsed += amount;
      break;
  }

  this.usage.lastUsedDate = new Date();

  // Update engagement score
  this._updateEngagementScore();

  return {
    used: this.usage[`${feature}Attempted`],
    limit: this.usage[`${feature}Limit`]
  };
};

// Update engagement score
userSubscriptionSchema.methods._updateEngagementScore = function() {
  let score = 0;

  // Based on usage
  if (this.usage.questionsAttempted > 100) score += 30;
  else if (this.usage.questionsAttempted > 50) score += 20;
  else if (this.usage.questionsAttempted > 10) score += 10;

  // Based on recency
  const daysSinceActive = this.daysSinceActive || 0;
  if (daysSinceActive === 0) score += 40;
  else if (daysSinceActive <= 3) score += 30;
  else if (daysSinceActive <= 7) score += 15;

  // Based on mock tests
  if (this.usage.mockTestsAttempted > 5) score += 20;
  else if (this.usage.mockTestsAttempted > 0) score += 10;

  this.analytics.engagementScore = Math.min(100, score);

  // Update churn risk based on engagement
  if (this.analytics.engagementScore < 20) {
    this.analytics.churnRisk = 'High';
  } else if (this.analytics.engagementScore < 50) {
    this.analytics.churnRisk = 'Medium';
  } else {
    this.analytics.churnRisk = 'Low';
  }
};

// Handle renewal
userSubscriptionSchema.methods.renewSubscription = async function() {
  try {
    const oldEndDate = this.endDate;

    // Extend subscription by billing cycle
    const plan = await mongoose.model('Subscription').findById(this.planId);

    if (!plan) {
      throw new Error('Plan not found');
    }

    this.startDate = oldEndDate;
    this.endDate = new Date(
      oldEndDate.getTime() +
      plan.pricing.billingCycleDays * 24 * 60 * 60 * 1000
    );

    this.status = 'Active';
    this.autoRenewal.nextBillingDate = this.endDate;

    // Record billing history
    this.billingHistory.push({
      date: new Date(),
      amount: this.pricing.totalAmount,
      status: 'Success',
      paymentMethod: this.payment.paymentMethod
    });

    await this.save();

    return {
      success: true,
      newEndDate: this.endDate
    };
  } catch (error) {
    console.error('Error renewing subscription:', error);
    throw error;
  }
};

// Cancel subscription
userSubscriptionSchema.methods.cancelSubscription = async function(
  reason = 'User requested',
  cancelledBy = 'User'
) {
  this.status = 'Cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  this.autoRenewal.enabled = false;

  return await this.save();
};

// Upgrade plan
userSubscriptionSchema.methods.upgradePlan = async function(newPlanId) {
  try {
    const newPlan = await mongoose.model('Subscription').findById(newPlanId);

    if (!newPlan) {
      throw new Error('New plan not found');
    }

    // Calculate proration credit
    const daysRemaining = this.daysRemaining;
    const dailyRate = this.pricing.basePlanAmount /
      (this.endDate - this.startDate) * (24 * 60 * 60 * 1000);

    const prorationCredit = dailyRate * daysRemaining;

    // Record upgrade
    this.upgrades.push({
      fromPlan: this.planName,
      toPlan: newPlan.planName,
      upgradeDate: new Date(),
      prorationCredit,
      upgradeAmount: newPlan.pricing.displayAmount - prorationCredit
    });

    this.planId = newPlanId;
    this.planName = newPlan.planName;
    this.planType = newPlan.planType;

    // Update features
    Object.keys(newPlan.features).forEach((key) => {
      this.features[key] = newPlan.features[key];
    });

    await this.save();

    return {
      success: true,
      upgradeAmount: newPlan.pricing.displayAmount - prorationCredit
    };
  } catch (error) {
    console.error('Error upgrading plan:', error);
    throw error;
  }
};

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema);
