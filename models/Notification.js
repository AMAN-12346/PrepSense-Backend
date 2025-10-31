const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // ============ NOTIFICATION IDENTIFICATION ============
    notificationId: {
      type: String,
      unique: true,
      required: true
      // Auto-generated unique ID
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // ============ NOTIFICATION TYPE ============
    type: {
      type: String,
      enum: [
        'Achievement',
        'Badge Unlocked',
        'Streak',
        'Exam Alert',
        'Study Reminder',
        'Performance Update',
        'Wellness Check',
        'Social',
        'Leaderboard',
        'System',
        'Promotional',
        'Doubt Resolved',
        'New Content',
        'Payment',
        'Motivation'
      ],
      required: true
    },

    category: {
      type: String,
      enum: [
        'Learning',
        'Gamification',
        'Health',
        'Social',
        'System',
        'Exam',
        'Marketing'
      ],
      required: true
    },

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },

    // ============ NOTIFICATION CONTENT ============
    title: {
      type: String,
      required: true
      // Max 65 characters for FCM
    },

    body: {
      type: String,
      required: true
      // Max 240 characters for FCM
    },

    message: {
      type: String,
      default: null
      // Extended message for in-app display
    },

    // ============ NOTIFICATION DATA ============
    data: {
      entityType: String,
      // "Badge", "Exam", "MockTest", "Achievement"

      entityId: mongoose.Schema.Types.ObjectId,
      // ID of related entity

      actionUrl: String,
      // Deep link to action screen

      imageUrl: String,
      // Notification icon/image

      icon: String,
      // Emoji or icon code

      badgeCount: {
        type: Number,
        default: 1
      }
    },

    // ============ ACHIEVEMENT/BADGE NOTIFICATIONS ============
    achievement: {
      badgeName: String,

      badgeIcon: String,

      achievementMessage: String,

      pointsAwarded: Number,

      coinsAwarded: Number
    },

    // ============ EXAM & STUDY NOTIFICATIONS ============
    exam: {
      examId: mongoose.Schema.Types.ObjectId,

      examName: String,

      importantDate: Date,
      // Application deadline, exam date, etc.

      daysRemaining: Number,

      actionRequired: String
      // "Complete application", "Download admit card"
    },

    // ============ PERFORMANCE NOTIFICATIONS ============
    performance: {
      metric: String,
      // "Accuracy", "Streak", "Score"

      previousValue: Number,

      currentValue: Number,

      improvement: String,
      // "Improved by 5%", "Maintained"

      recommendation: String
    },

    // ============ WELLNESS NOTIFICATIONS ============
    wellness: {
      wellnessScore: Number,

      wellnessCategory: String,

      wellnessMessage: String,

      recommendation: String
    },

    // ============ FCM INTEGRATION ============
    fcm: {
      // FCM Token to send to
      fcmToken: {
        type: String,
        required: true
        // Device FCM token
      },

      // FCM Payload
      fcmPayload: {
        notification: {
          title: String,
          body: String,
          icon: String,
          sound: { type: String, default: 'default' },
          clickAction: String
          // Action when notification is clicked
        },

        data: {
          notificationId: String,
          entityType: String,
          entityId: String,
          deepLink: String,
          type: String
        },

        android: {
          priority: String,
          // "high", "normal"
          ttl: { type: String, default: '86400s' },
          // Time to live
          notification: {
            sound: String,
            tag: String,
            color: String
          }
        },

        apns: {
          headers: {
            'apns-priority': String,
            // "10" for high priority
            'apns-expiration': String
          },

          payload: {
            aps: {
              sound: String,
              badge: Number,
              'mutable-content': Boolean,
              'custom-data': Object
            }
          }
        },

        webpush: {
          headers: {
            'TTL': String
          },
          data: Object,
          notification: {
            title: String,
            body: String,
            icon: String
          }
        }
      },

      // FCM Response
      fcmResponse: {
        success: Boolean,

        messageId: String,
        // FCM message ID

        error: String,
        // Error if failed

        timestamp: Date
      },

      // Retry information
      retryCount: {
        type: Number,
        default: 0
      },

      maxRetries: {
        type: Number,
        default: 3
      },

      lastRetryAt: Date,

      nextRetryAt: Date
    },

    // ============ DELIVERY STATUS ============
    deliveryStatus: {
      type: String,
      enum: [
        'Pending',
        'Sent to FCM',
        'Delivered',
        'Failed',
        'Clicked',
        'Dismissed'
      ],
      default: 'Pending'
    },

    sentAt: Date,

    deliveredAt: Date,

    clickedAt: Date,

    // ============ NOTIFICATION CHANNELS ============
    channels: {
      pushNotification: {
        enabled: {
          type: Boolean,
          default: true
        },
        sent: Boolean,
        status: String
      },

      inApp: {
        enabled: {
          type: Boolean,
          default: true
        },
        seen: Boolean,
        seenAt: Date
      },

      email: {
        enabled: {
          type: Boolean,
          default: false
        },
        sent: Boolean,
        status: String
      },

      sms: {
        enabled: {
          type: Boolean,
          default: false
        },
        sent: Boolean,
        status: String
      }
    },

    // ============ USER PREFERENCES ============
    userPreferences: {
      doNotDisturb: Boolean,

      quietHoursStart: String,
      // "22:00"

      quietHoursEnd: String,
      // "07:00"

      isSilent: Boolean,
      // Don't show sound/vibration

      isVibrate: Boolean,

      sound: {
        type: String,
        enum: ['Default', 'Silent', 'Custom'],
        default: 'Default'
      }
    },

    // ============ SCHEDULING ============
    isScheduled: {
      type: Boolean,
      default: false
    },

    scheduledFor: Date,
    // When to send if scheduled

    sendImmediately: {
      type: Boolean,
      default: true
    },

    // ============ ENGAGEMENT TRACKING ============
    engagement: {
      sent: Boolean,

      opened: Boolean,

      clicked: Boolean,

      actionTaken: Boolean,

      openCount: {
        type: Number,
        default: 0
      },

      timeToFirstOpen: Number,
      // In seconds

      timeToAction: Number
      // In seconds
    },

    // ============ VISIBILITY & PERSISTENCE ============
    isRead: {
      type: Boolean,
      default: false
    },

    isArchived: {
      type: Boolean,
      default: false
    },

    isPinned: {
      type: Boolean,
      default: false
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      // Expires in 30 days
    },

    // ============ ADMIN & MODERATION ============
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    isSystemGenerated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// ============ INDEXES ============
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ 'fcm.fcmToken': 1 });
notificationSchema.index({ deliveryStatus: 1 });
notificationSchema.index({ expiresAt: 1 });

// TTL Index - auto-delete after expiration
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============ VIRTUAL FIELDS ============
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// ============ METHODS ============

// Prepare FCM payload
notificationSchema.methods.prepareFCMPayload = function() {
  this.fcm.fcmPayload = {
    notification: {
      title: this.title,
      body: this.body,
      icon: this.data.imageUrl,
      sound: 'default',
      clickAction: this.data.actionUrl
    },

    data: {
      notificationId: this.notificationId,
      entityType: this.data.entityType,
      entityId: this.data.entityId?.toString(),
      deepLink: this.data.actionUrl,
      type: this.type
    },

    android: {
      priority: this.priority === 'High' || this.priority === 'Urgent' ? 'high' : 'normal',
      ttl: '86400s',
      notification: {
        sound: 'default',
        tag: this.category,
        color: '#00A99D'
      }
    },

    apns: {
      headers: {
        'apns-priority': this.priority === 'High' || this.priority === 'Urgent' ? '10' : '5',
        'apns-expiration': Math.floor(this.expiresAt.getTime() / 1000).toString()
      },

      payload: {
        aps: {
          sound: this.userPreferences.sound !== 'Silent' ? 'default' : undefined,
          badge: this.data.badgeCount,
          'mutable-content': true,
          'custom-data': {
            notificationId: this.notificationId,
            type: this.type
          }
        }
      }
    },

    webpush: {
      headers: {
        'TTL': '86400'
      },

      notification: {
        title: this.title,
        body: this.body,
        icon: this.data.imageUrl,
        badge: this.data.imageUrl,
        tag: this.category,
        requireInteraction: this.priority === 'Urgent'
      }
    }
  };

  return this.fcm.fcmPayload;
};

// Mark as sent
notificationSchema.methods.markAsSent = async function(messageId) {
  this.deliveryStatus = 'Sent to FCM';
  this.sentAt = new Date();
  this.fcm.fcmResponse = {
    success: true,
    messageId,
    timestamp: new Date()
  };

  return await this.save();
};

// Mark as delivered
notificationSchema.methods.markAsDelivered = async function() {
  this.deliveryStatus = 'Delivered';
  this.deliveredAt = new Date();
  this.engagement.sent = true;

  return await this.save();
};

// Mark as clicked
notificationSchema.methods.markAsClicked = async function() {
  this.deliveryStatus = 'Clicked';
  this.clickedAt = new Date();
  this.engagement.clicked = true;
  this.engagement.openCount += 1;

  if (!this.engagement.timeToFirstOpen && this.sentAt) {
    this.engagement.timeToFirstOpen = Math.floor(
      (this.clickedAt - this.sentAt) / 1000
    );
  }

  return await this.save();
};

// Mark as read
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.engagement.opened = true;

  return await this.save();
};

// Handle FCM failure and retry
notificationSchema.methods.handleFCMFailure = async function(error) {
  this.fcm.retryCount += 1;

  if (this.fcm.retryCount < this.fcm.maxRetries) {
    // Retry after 5 minutes
    this.fcm.nextRetryAt = new Date(Date.now() + 5 * 60 * 1000);
    this.deliveryStatus = 'Pending';
  } else {
    this.deliveryStatus = 'Failed';
    this.fcm.fcmResponse = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
  }

  this.fcm.lastRetryAt = new Date();

  return await this.save();
};

// Get notification summary
notificationSchema.methods.getSummary = function() {
  return {
    notificationId: this.notificationId,
    type: this.type,
    title: this.title,
    body: this.body,
    icon: this.data.icon,
    createdAt: this.createdAt,
    isRead: this.isRead,
    deliveryStatus: this.deliveryStatus
  };
};

// Check if should send (respecting DND)
notificationSchema.methods.shouldSend = function() {
  if (!this.userPreferences.doNotDisturb) {
    return true;
  }

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [startHour, startMin] = this.userPreferences.quietHoursStart.split(':');
  const [endHour, endMin] = this.userPreferences.quietHoursEnd.split(':');

  const startTime = parseInt(`${startHour}${startMin}`);
  const endTime = parseInt(`${endHour}${endMin}`);
  const currentTimeInt = parseInt(currentTime.replace(':', ''));

  // If quiet hours cross midnight
  if (startTime > endTime) {
    return !(currentTimeInt >= startTime || currentTimeInt < endTime);
  }

  return !(currentTimeInt >= startTime && currentTimeInt < endTime);
};

module.exports = mongoose.model('Notification', notificationSchema);
