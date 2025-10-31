const admin = require('firebase-admin');
const Notification = require('../models/Notification');

// ============ INITIALIZE FIREBASE ============
// Make sure your Firebase is initialized in your main server file
// require('dotenv').config();
// admin.initializeApp({
//   credential: admin.credential.cert(require(process.env.FIREBASE_CONFIG_PATH))
// });

class FCMService {
  constructor() {
    this.maxRetries = 3;
    this.retryDelay = 5 * 60 * 1000; // 5 minutes
    this.logger = console;
  }

  // ============ SEND SINGLE NOTIFICATION ============
  /**
   * Send notification to a single user
   * @param {String} fcmToken - FCM token of device
   * @param {Object} notification - Notification document
   * @returns {Object} Result with success status and messageId
   */
  async sendNotificationToDevice(fcmToken, notification) {
    try {
      if (!fcmToken) {
        throw new Error('FCM token is required');
      }

      if (!notification) {
        throw new Error('Notification object is required');
      }

      // Check if should send (respecting DND)
      if (!notification.shouldSend()) {
        this.logger.log('⏸️ Notification blocked by Do Not Disturb settings');
        return {
          success: false,
          reason: 'blocked_by_dnd',
          messageId: null
        };
      }

      // Prepare FCM payload
      const payload = notification.prepareFCMPayload();

      this.logger.log(
        `📤 Sending FCM notification to device: ${fcmToken.substring(0, 20)}...`
      );

      // Send via Firebase Admin SDK
      const messageId = await admin.messaging().sendToDevice(
        fcmToken,
        payload.notification,
        {
          data: payload.data,
          android: payload.android,
          apns: payload.apns,
          webpush: payload.webpush,
          ttl: 86400 // 24 hours
        }
      );

      // Update notification record
      await notification.markAsSent(messageId);

      this.logger.log(
        `✅ Notification sent successfully. MessageId: ${messageId}`
      );

      return {
        success: true,
        messageId,
        sentAt: new Date()
      };
    } catch (error) {
      this.logger.error('❌ Error sending FCM notification:', error);

      // Handle retry logic
      if (notification.fcm.retryCount < this.maxRetries) {
        await this.scheduleRetry(notification);
      } else {
        await notification.handleFCMFailure(error);
      }

      return {
        success: false,
        error: error.message,
        willRetry: notification.fcm.retryCount < this.maxRetries
      };
    }
  }

  // ============ SEND BULK NOTIFICATIONS ============
  /**
   * Send notifications to multiple users
   * @param {Array} userIds - Array of user IDs
   * @param {Object} notificationData - Common notification data
   * @returns {Object} Result with success/failure counts
   */
  async sendBulkNotifications(userIds, notificationData) {
    try {
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new Error('userIds must be a non-empty array');
      }

      if (!notificationData) {
        throw new Error('notificationData is required');
      }

      this.logger.log(
        `📤 Starting bulk notification send to ${userIds.length} users`
      );

      const results = {
        total: userIds.length,
        successful: 0,
        failed: 0,
        failures: [],
        messageIds: []
      };

      // Send notifications in batches to avoid overload
      const batchSize = 50;

      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);

        // Process batch in parallel
        const batchResults = await Promise.allSettled(
          batch.map((userId) =>
            this.sendNotificationToUser(userId, notificationData)
          )
        );

        // Aggregate results
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            if (result.value.success) {
              results.successful += 1;
              results.messageIds.push(result.value.messageId);
            } else {
              results.failed += 1;
              results.failures.push({
                userId: batch[index],
                reason: result.value.error
              });
            }
          } else {
            results.failed += 1;
            results.failures.push({
              userId: batch[index],
              reason: result.reason.message
            });
          }
        });

        // Log batch progress
        this.logger.log(
          `📊 Batch ${Math.ceil((i + 1) / batchSize)} completed: ${results.successful}/${results.total} successful`
        );
      }

      this.logger.log(
        `✅ Bulk notification send completed: ${results.successful}/${results.total} successful`
      );

      return results;
    } catch (error) {
      this.logger.error('❌ Error in bulk notification send:', error);
      throw error;
    }
  }

  // ============ SEND TO SINGLE USER ============
  /**
   * Send notification to a user (from userId)
   * @param {ObjectId} userId - User ID
   * @param {Object} notificationData - Notification data
   * @returns {Object} Result
   */
  async sendNotificationToUser(userId, notificationData) {
    try {
      const User = require('../models/User');

      // Get user's FCM token from database
      // Note: You'll need to store FCM tokens in User model
      // Add this field to User schema: fcmTokens: [String]

      const user = await User.findById(userId).select('fcmTokens');

      if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
        return {
          success: false,
          reason: 'no_fcm_token',
          error: 'User has no FCM tokens'
        };
      }

      // Create notification document
      const notification = new Notification({
        notificationId: `NOT_${Date.now()}_${userId}`,
        userId,
        ...notificationData,
        'fcm.fcmToken': user.fcmTokens[0] // Use primary token
      });

      await notification.save();

      // Send to all user's devices
      const results = {
        successful: 0,
        failed: 0,
        devices: []
      };

      for (const fcmToken of user.fcmTokens) {
        try {
          const result = await this.sendNotificationToDevice(fcmToken, notification);

          if (result.success) {
            results.successful += 1;
            results.devices.push({
              token: fcmToken.substring(0, 20) + '...',
              status: 'sent',
              messageId: result.messageId
            });
          } else {
            results.failed += 1;
            results.devices.push({
              token: fcmToken.substring(0, 20) + '...',
              status: 'failed',
              reason: result.reason
            });
          }
        } catch (error) {
          results.failed += 1;
          results.devices.push({
            token: fcmToken.substring(0, 20) + '...',
            status: 'error',
            error: error.message
          });
        }
      }

      return {
        success: results.successful > 0,
        results
      };
    } catch (error) {
      this.logger.error('❌ Error sending notification to user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============ SCHEDULE RETRY ============
  /**
   * Schedule notification for retry
   * @param {Object} notification - Notification document
   * @returns {Promise}
   */
  async scheduleRetry(notification) {
    try {
      const nextRetryTime = new Date(Date.now() + this.retryDelay);

      notification.fcm.nextRetryAt = nextRetryTime;
      notification.fcm.lastRetryAt = new Date();
      notification.fcm.retryCount += 1;

      await notification.save();

      this.logger.log(
        `🔄 Notification scheduled for retry #${notification.fcm.retryCount} at ${nextRetryTime}`
      );

      // Schedule the actual retry
      setTimeout(
        () => this.retryFailedNotification(notification._id),
        this.retryDelay
      );

      return {
        scheduled: true,
        nextRetryAt: nextRetryTime,
        retryNumber: notification.fcm.retryCount
      };
    } catch (error) {
      this.logger.error('❌ Error scheduling retry:', error);
      throw error;
    }
  }

  // ============ RETRY FAILED NOTIFICATION ============
  /**
   * Retry a failed notification
   * @param {ObjectId} notificationId - Notification ID
   * @returns {Object} Result
   */
  async retryFailedNotification(notificationId) {
    try {
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (notification.deliveryStatus === 'Delivered') {
        this.logger.log('ℹ️ Notification already delivered, skipping retry');
        return { skipped: true };
      }

      this.logger.log(
        `🔄 Retrying notification #${notification.fcm.retryCount + 1}`
      );

      const result = await this.sendNotificationToDevice(
        notification.fcm.fcmToken,
        notification
      );

      return result;
    } catch (error) {
      this.logger.error('❌ Error retrying notification:', error);
      throw error;
    }
  }

  // ============ PROCESS FAILED NOTIFICATIONS ============
  /**
   * Process all pending failed notifications that need retry
   * Should be called by a cron job periodically
   */
  async processFailedNotifications() {
    try {
      this.logger.log('🔍 Processing failed notifications...');

      // Find notifications that need retry
      const failedNotifications = await Notification.find({
        $and: [
          { deliveryStatus: 'Pending' },
          { 'fcm.retryCount': { $lt: this.maxRetries } },
          { 'fcm.nextRetryAt': { $lte: new Date() } }
        ]
      });

      this.logger.log(`Found ${failedNotifications.length} notifications to retry`);

      let processedCount = 0;
      let successCount = 0;

      for (const notification of failedNotifications) {
        try {
          const result = await this.retryFailedNotification(notification._id);

          processedCount += 1;

          if (result.success) {
            successCount += 1;
          }
        } catch (error) {
          this.logger.error(
            `Failed to retry notification ${notification._id}:`,
            error
          );
        }
      }

      this.logger.log(
        `✅ Processed ${processedCount} notifications. ${successCount} succeeded.`
      );

      return {
        processed: processedCount,
        successful: successCount,
        failed: processedCount - successCount
      };
    } catch (error) {
      this.logger.error('❌ Error processing failed notifications:', error);
      throw error;
    }
  }

  // ============ SEND TO SEGMENT ============
  /**
   * Send notification to users matching criteria
   * @param {Object} query - MongoDB query to find users
   * @param {Object} notificationData - Notification data
   * @returns {Object} Result
   */
  async sendToSegment(query, notificationData) {
    try {
      const User = require('../models/User');

      this.logger.log('🎯 Finding users matching segment criteria...');

      const users = await User.find(query).select('_id');

      if (users.length === 0) {
        this.logger.log('⚠️ No users found matching criteria');
        return {
          success: false,
          reason: 'no_users_found',
          userCount: 0
        };
      }

      this.logger.log(`📤 Found ${users.length} users. Starting bulk send...`);

      const userIds = users.map((u) => u._id);

      const results = await this.sendBulkNotifications(
        userIds,
        notificationData
      );

      return {
        success: true,
        segment: {
          query,
          userCount: users.length
        },
        results
      };
    } catch (error) {
      this.logger.error('❌ Error sending to segment:', error);
      throw error;
    }
  }

  // ============ SEND NOTIFICATION BY TYPE ============
  /**
   * Send templated notification by type
   * @param {String} userId - User ID
   * @param {String} type - Notification type
   * @param {Object} data - Dynamic data
   * @returns {Object} Result
   */
  async sendNotificationByType(userId, type, data = {}) {
    try {
      const templates = {
        'Badge Unlocked': {
          title: `🏅 ${data.badgeName}`,
          body: data.message || 'You earned a new badge!',
          type: 'Badge Unlocked',
          category: 'Gamification',
          priority: 'High',
          icon: data.badgeIcon || '🏅'
        },

        'Streak Milestone': {
          title: `🔥 ${data.streakDays}-Day Streak!`,
          body: `Keep your ${data.streakDays}-day streak going!`,
          type: 'Streak',
          category: 'Gamification',
          priority: 'Medium'
        },

        'Study Reminder': {
          title: '📚 Time to Study',
          body: 'Don\'t break your streak - start studying now!',
          type: 'Study Reminder',
          category: 'Learning',
          priority: 'Medium'
        },

        'Performance Update': {
          title: '📈 Performance Update',
          body: `Your accuracy improved to ${data.accuracy}%`,
          type: 'Performance Update',
          category: 'Learning',
          priority: 'Medium'
        },

        'Exam Alert': {
          title: `⏰ ${data.examName}`,
          body: `Application closes in ${data.daysRemaining} days!`,
          type: 'Exam Alert',
          category: 'Exam',
          priority: 'High'
        },

        'Wellness Check': {
          title: '😊 How are you feeling?',
          body: 'Take a moment to check in on your wellness',
          type: 'Wellness Check',
          category: 'Health',
          priority: 'Low'
        },

        'New Content': {
          title: '✨ New Content Available',
          body: data.contentName || 'Check out new study materials',
          type: 'New Content',
          category: 'Learning',
          priority: 'Medium'
        }
      };

      const template = templates[type];

      if (!template) {
        throw new Error(`Unknown notification type: ${type}`);
      }

      const notificationData = {
        ...template,
        data: {
          entityType: data.entityType,
          entityId: data.entityId,
          actionUrl: data.actionUrl,
          ...data
        }
      };

      return await this.sendNotificationToUser(userId, notificationData);
    } catch (error) {
      this.logger.error('❌ Error sending templated notification:', error);
      throw error;
    }
  }

  // ============ TRACK NOTIFICATION EVENTS ============
  /**
   * Track when notification is clicked/opened
   * @param {String} notificationId - Notification ID
   * @param {String} event - Event type (clicked, opened, dismissed)
   * @returns {Promise}
   */
  async trackNotificationEvent(notificationId, event) {
    try {
      const notification = await Notification.findOne({
        notificationId
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      switch (event) {
        case 'clicked':
          await notification.markAsClicked();
          break;

        case 'opened':
          await notification.markAsRead();
          break;

        case 'dismissed':
          notification.deliveryStatus = 'Dismissed';
          await notification.save();
          break;

        default:
          throw new Error(`Unknown event: ${event}`);
      }

      this.logger.log(
        `✅ Tracked event '${event}' for notification ${notificationId}`
      );

      return {
        success: true,
        event,
        notificationId
      };
    } catch (error) {
      this.logger.error('❌ Error tracking notification event:', error);
      throw error;
    }
  }

  // ============ VALIDATE FCM TOKEN ============
  /**
   * Validate FCM token
   * @param {String} fcmToken - FCM token to validate
   * @returns {Boolean}
   */
  validateFCMToken(fcmToken) {
    if (!fcmToken || typeof fcmToken !== 'string') {
      return false;
    }

    // FCM tokens are typically 152+ characters
    return fcmToken.length > 100;
  }

  // ============ CLEAN UP EXPIRED NOTIFICATIONS ============
  /**
   * Clean up notifications that have expired
   * Should be called by a cron job
   */
  async cleanupExpiredNotifications() {
    try {
      this.logger.log('🧹 Cleaning up expired notifications...');

      const result = await Notification.deleteMany({
        expiresAt: { $lt: new Date() }
      });

      this.logger.log(
        `✅ Deleted ${result.deletedCount} expired notifications`
      );

      return {
        success: true,
        deletedCount: result.deletedCount
      };
    } catch (error) {
      this.logger.error('❌ Error cleaning up expired notifications:', error);
      throw error;
    }
  }
}

// Export as singleton
module.exports = new FCMService();
