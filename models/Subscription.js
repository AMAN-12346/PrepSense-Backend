const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    // ============ SUBSCRIPTION PLAN IDENTIFICATION ============
    planId: {
      type: String,
      unique: true,
      required: true,
      uppercase: true
      // Example: "PREMIUM_MONTHLY", "PRO_YEARLY"
    },

    planName: {
      type: String,
      required: true,
      trim: true
      // Example: "Premium Monthly"
    },

    planDescription: {
      type: String,
      required: true
    },

    planType: {
      type: String,
      enum: ['Free', 'Premium', 'Pro'],
      required: true
    },

    tier: {
      type: String,
      enum: ['Starter', 'Professional', 'Enterprise'],
      default: 'Starter'
    },

    // ============ PRICING INFORMATION ============
    pricing: {
      amount: {
        type: Number,
        required: true
        // Amount in paise (1 rupee = 100 paise)
      },

      currency: {
        type: String,
        enum: ['INR', 'USD'],
        default: 'INR'
      },

      displayAmount: {
        type: Number,
        required: true
        // Amount in rupees for display
      },

      billingCycle: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Yearly', 'Lifetime'],
        required: true
      },

      billingCycleDays: {
        type: Number,
        required: true
        // 30 for monthly, 90 for quarterly, 365 for yearly, 36500 for lifetime
      },

      discount: {
        hasDiscount: Boolean,
        discountPercentage: {
          type: Number,
          default: 0
        },
        discountedAmount: Number,
        // Final amount after discount
        discountReason: String,
        // "Early bird", "Annual savings", etc.
        validUntil: Date
      },

      taxes: {
        taxPercentage: {
          type: Number,
          default: 18
          // GST 18% in India
        },
        taxAmount: Number,
        totalAmount: Number
        // Amount + Tax
      }
    },

    // ============ FEATURES & LIMITS ============
    features: {
      questionsPerDay: {
        type: Number,
        required: true
        // Unlimited represented as -1
      },

      questionsPerMonth: {
        type: Number,
        required: true
      },

      mockTestsPerMonth: {
        type: Number,
        required: true
      },

      practiceSessionsPerDay: {
        type: Number,
        required: true
      },

      aiChatInteractionsPerDay: {
        type: Number,
        required: true
      },

      currentAffairsAccess: {
        type: Boolean,
        default: false
      },

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

      customFeatures: [String]
      // ["Feature 1", "Feature 2"]
    },

    // ============ RAZORPAY INTEGRATION ============
    razorpay: {
      // Razorpay Plan ID for subscriptions
      razorpayPlanId: {
        type: String,
        default: null
        // Created in Razorpay dashboard
      },

      // Razorpay Product ID
      razorpayProductId: {
        type: String,
        default: null
      },

      // Webhook signature for verification
      webhookSignatureKey: {
        type: String,
        default: null,
        select: false
        // Don't include in queries by default
      },

      // Payment method options
      paymentMethods: [
        {
          type: String,
          enum: ['card', 'netbanking', 'wallet', 'upi'],
          default: ['card', 'netbanking', 'upi']
        }
      ],

      // Subscription configuration
      subscriptionConfig: {
        autoCapture: {
          type: Boolean,
          default: true
        },

        notifyUrl: String,
        // Webhook URL for notifications

        emailNotify: {
          type: Boolean,
          default: true
        },

        smsNotify: {
          type: Boolean,
          default: false
        },

        expiredBy: {
          type: Number,
          default: 0
          // Days to expire
        }
      },

      // Test or Live mode
      isTestMode: {
        type: Boolean,
        default: false
      }
    },

    // ============ TRIAL PERIOD ============
    trialPeriod: {
      hasTrial: {
        type: Boolean,
        default: false
      },

      trialDays: {
        type: Number,
        default: 0
      },

      trialMessage: String,
      // "7 days free trial"

      requiresPaymentMethod: {
        type: Boolean,
        default: true
        // Require card even during trial
      }
    },

    // ============ PROMOTIONAL OFFERS ============
    promotionalOffers: [
      {
        offerCode: String,

        offerName: String,

        discountType: {
          type: String,
          enum: ['Percentage', 'Fixed Amount'],
          default: 'Percentage'
        },

        discountValue: Number,

        maxDiscount: Number,
        // For percentage discounts

        minPurchaseAmount: Number,

        maxUsageCount: {
          type: Number,
          default: -1
          // -1 for unlimited
        },

        currentUsageCount: {
          type: Number,
          default: 0
        },

        validFrom: Date,

        validUntil: Date,

        isActive: {
          type: Boolean,
          default: true
        }
      }
    ],

    // ============ REFERRAL PROGRAM ============
    referralProgram: {
      referralBonus: {
        type: Number,
        default: 0
        // Discount for referrer
      },

      refereeBonus: {
        type: Number,
        default: 0
        // Discount for new user (referee)
      },

      maxReferrals: {
        type: Number,
        default: -1
        // -1 for unlimited
      }
    },

    // ============ STATISTICS & ANALYTICS ============
    stats: {
      totalSubscribers: {
        type: Number,
        default: 0
      },

      activeSubscribers: {
        type: Number,
        default: 0
      },

      monthlyRecurringRevenue: {
        type: Number,
        default: 0
      },

      cancellationRate: {
        type: Number,
        default: 0
        // Percentage
      },

      conversionRate: {
        type: Number,
        default: 0
        // From free to paid
      },

      averageLifetime: {
        type: Number,
        default: 0
        // In months
      },

      customerSatisfaction: {
        type: Number,
        default: 0
        // 1-5 rating
      }
    },

    // ============ CANCELLATION & REFUND ============
    cancellationPolicy: {
      refundPolicy: {
        type: String,
        enum: ['No Refund', '7-Day Refund', '14-Day Refund', '30-Day Refund', 'Full Refund'],
        default: 'No Refund'
      },

      refundDescription: String,

      canCancelAnytime: {
        type: Boolean,
        default: true
      },

      cancellationNoticeRequired: {
        type: Number,
        default: 0
        // Days notice required
      },

      allowDowngradeTrial: {
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
      // Show on pricing page
    },

    isFeatured: {
      type: Boolean,
      default: false
      // Highlight on pricing page
    },

    isPopular: {
      type: Boolean,
      default: false
      // Mark as most popular
    },

    displayOrder: {
      type: Number,
      default: 0
      // Order on pricing page
    },

    badge: {
      type: String,
      default: null
      // "Most Popular", "Best Value", etc.
    },

    // ============ TERMS & CONDITIONS ============
    termsAndConditions: {
      automaticRenewal: {
        type: Boolean,
        default: true
      },

      renewalPolicy: String,

      cancellationTerms: String,

      refundTerms: String,

      dataRetention: String,
      // What happens to data after cancellation
    },

    // ============ ADMIN & MAINTENANCE ============
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    notes: {
      type: String,
      default: null
    },

    isTestPlan: {
      type: Boolean,
      default: false
      // For testing purposes
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
subscriptionSchema.index({ planId: 1 });
subscriptionSchema.index({ planType: 1 });
subscriptionSchema.index({ isActive: 1, isPublished: 1 });
subscriptionSchema.index({ displayOrder: 1 });

// ============ VIRTUAL FIELDS ============
// Get formatted price
subscriptionSchema.virtual('formattedPrice').get(function() {
  return `₹${this.pricing.displayAmount}`;
});

// Get feature count
subscriptionSchema.virtual('featureCount').get(function() {
  let count = 0;

  Object.values(this.features).forEach((value) => {
    if (typeof value === 'boolean' && value === true) {
      count += 1;
    } else if (typeof value === 'number' && value > 0) {
      count += 1;
    } else if (Array.isArray(value)) {
      count += value.length;
    }
  });

  return count;
});

// ============ METHODS ============

// Get plan details for display
subscriptionSchema.methods.getPlanInfo = function() {
  return {
    planId: this.planId,
    planName: this.planName,
    planType: this.planType,
    price: this.pricing.displayAmount,
    currency: this.pricing.currency,
    billingCycle: this.pricing.billingCycle,
    features: this.features,
    hasTrial: this.trialPeriod.hasTrial,
    trialDays: this.trialPeriod.trialDays
  };
};

// Calculate final price with discount
subscriptionSchema.methods.calculateFinalPrice = function(couponCode = null) {
  let amount = this.pricing.displayAmount;

  // Apply coupon discount if provided
  if (couponCode) {
    const offer = this.promotionalOffers.find(
      (o) => o.offerCode === couponCode && o.isActive
    );

    if (offer) {
      if (offer.discountType === 'Percentage') {
        const discount = (amount * offer.discountValue) / 100;
        amount -= Math.min(discount, offer.maxDiscount || discount);
      } else {
        amount -= offer.discountValue;
      }
    }
  }

  // Apply tax (18% GST)
  const tax = (amount * this.pricing.taxes.taxPercentage) / 100;
  const total = amount + tax;

  return {
    baseAmount: this.pricing.displayAmount,
    discount: this.pricing.displayAmount - amount,
    amount: Math.round(amount * 100) / 100, // Round to 2 decimals
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    amountInPaise: Math.round(total * 100) // For Razorpay
  };
};

// Validate coupon code
subscriptionSchema.methods.validateCoupon = function(couponCode) {
  const offer = this.promotionalOffers.find(
    (o) => o.offerCode === couponCode
  );

  if (!offer) {
    return {
      valid: false,
      reason: 'Invalid coupon code'
    };
  }

  if (!offer.isActive) {
    return {
      valid: false,
      reason: 'Coupon code is inactive'
    };
  }

  const now = new Date();

  if (now < offer.validFrom) {
    return {
      valid: false,
      reason: 'Coupon code not yet active'
    };
  }

  if (now > offer.validUntil) {
    return {
      valid: false,
      reason: 'Coupon code has expired'
    };
  }

  if (offer.maxUsageCount !== -1 && offer.currentUsageCount >= offer.maxUsageCount) {
    return {
      valid: false,
      reason: 'Coupon code usage limit exceeded'
    };
  }

  return {
    valid: true,
    offer: {
      code: offer.offerCode,
      name: offer.offerName,
      discount: offer.discountValue,
      type: offer.discountType
    }
  };
};

// Create Razorpay payment link
subscriptionSchema.methods.createRazorpayPaymentLink = async function(
  userId,
  customerEmail,
  customerPhone,
  couponCode = null
) {
  try {
    const Razorpay = require('razorpay');

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const pricing = this.calculateFinalPrice(couponCode);

    const paymentLink = await razorpay.paymentLink.create({
      amount: pricing.amountInPaise,
      currency: this.pricing.currency,
      accept_partial: false,
      first_min_partial_amount: pricing.amountInPaise,
      description: `${this.planName} - ${this.pricing.billingCycle}`,
      customer: {
        name: 'User',
        email: customerEmail,
        contact: customerPhone
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      notes: {
        planId: this.planId,
        userId: userId.toString(),
        couponCode: couponCode || 'none'
      },
      callback_url: `${process.env.APP_URL}/api/payment/callback`,
      callback_method: 'get'
    });

    return {
      success: true,
      paymentLink: paymentLink.short_url,
      paymentLinkId: paymentLink.id,
      amount: pricing.total,
      currency: this.pricing.currency
    };
  } catch (error) {
    console.error('Error creating Razorpay payment link:', error);
    throw new Error(`Failed to create payment link: ${error.message}`);
  }
};

// Create Razorpay subscription
subscriptionSchema.methods.createRazorpaySubscription = async function(
  userId,
  customerEmail,
  customerPhone
) {
  try {
    const Razorpay = require('razorpay');

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create customer first
    const customer = await razorpay.customers.create({
      email: customerEmail,
      contact: customerPhone
    });

    // Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: this.razorpay.razorpayPlanId,
      customer_id: customer.id,
      quantity: 1,
      total_count: 0, // Unlimited count
      addons: [],
      notes: {
        userId: userId.toString(),
        planId: this.planId
      }
    });

    return {
      success: true,
      subscriptionId: subscription.id,
      customerId: customer.id,
      status: subscription.status
    };
  } catch (error) {
    console.error('Error creating Razorpay subscription:', error);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

// Get subscription comparison data
subscriptionSchema.methods.getComparisonData = function(otherPlans = []) {
  const plans = [this, ...otherPlans];

  return {
    plans: plans.map((plan) => ({
      planId: plan.planId,
      planName: plan.planName,
      price: plan.pricing.displayAmount,
      features: plan.features
    })),
    featureComparison: this._getFeatureComparison(plans)
  };
};

// Helper to get feature comparison
subscriptionSchema.methods._getFeatureComparison = function(plans) {
  const featureKeys = Object.keys(this.features);
  const comparison = {};

  featureKeys.forEach((key) => {
    comparison[key] = plans.map((plan) => plan.features[key]);
  });

  return comparison;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
