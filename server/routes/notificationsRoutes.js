// import express from "express"
// import {Notification} from "../models/notificationSchema.js"
// import auth from "../config/Auth.js"

// const router = express.Router();

// // GET /api/v1/notifications/:userId - Fetch user's notifications
// router.get('/notifications/:userId', auth, async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // Verify user can only access their own notifications
//     if (req.id !== userId) {
//       return res.status(403).json({
//         message: 'Unauthorized access',
//         success: false
//       });
//     }

//     const notifications = await Notification.find({ toUser: userId })
//       .populate('fromUser', 'name username profilePic')
//       .populate('blog', 'title')
//       .sort({ createdAt: -1 }) // Latest first
//       .limit(50); // Limit to 50 recent notifications

//     console.log(`📋 Fetched ${notifications.length} notifications for user ${userId}`);

//     return res.status(200).json({
//       notifications,
//       success: true
//     });
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     return res.status(500).json({
//       message: 'Failed to fetch notifications',
//       success: false
//     });
//   }
// });

// // DELETE /api/v1/notifications/:userId - Clear all notifications for user
// router.delete('/notifications/:userId', auth, async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // Verify user can only clear their own notifications
//     if (req.id !== userId) {
//       return res.status(403).json({
//         message: 'Unauthorized access',
//         success: false
//       });
//     }

//     const result = await Notification.deleteMany({ toUser: userId });
    
//     console.log(`🗑️ Cleared ${result.deletedCount} notifications for user ${userId}`);

//     return res.status(200).json({
//       message: `Cleared ${result.deletedCount} notifications`,
//       success: true,
//       deletedCount: result.deletedCount
//     });
//   } catch (error) {
//     console.error('Error clearing notifications:', error);
//     return res.status(500).json({
//       message: 'Failed to clear notifications',
//       success: false
//     });
//   }
// });

// router.delete('/notifications/single/:notificationId', auth, async (req, res) => {
//   try {
//     const { notificationId } = req.params;
//     const userId = req.id;

//     const notification = await notificationSchema.findOne({
//       _id: notificationId,
//       toUser: userId
//     });

//     if (!notification) {
//       return res.status(404).json({
//         message: 'Notification not found',
//         success: false
//       });
//     }

//     await notificationSchema.findByIdAndDelete(notificationId);

//     console.log(`🗑️ Deleted notification ${notificationId} for user ${userId}`);

//     return res.status(200).json({
//       message: 'Notification deleted successfully',
//       success: true
//     });
//   } catch (error) {
//     console.error('Error deleting notification:', error);
//     return res.status(500).json({
//       message: 'Failed to delete notification',
//       success: false
//     });
//   }
// });

// // PUT /api/v1/notifications/mark-read/:userId - Mark all notifications as read
// router.put('/notifications/mark-read/:userId', auth, async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     if (req.id !== userId) {
//       return res.status(403).json({
//         message: 'Unauthorized access',
//         success: false
//       });
//     }

//     const result = await notificationSchema.updateMany(
//       { toUser: userId, isRead: false },
//       { isRead: true }
//     );

//     console.log(`✅ Marked ${result.modifiedCount} notifications as read for user ${userId}`);

//     return res.status(200).json({
//       message: `Marked ${result.modifiedCount} notifications as read`,
//       success: true,
//       modifiedCount: result.modifiedCount
//     });
//   } catch (error) {
//     console.error('Error marking notifications as read:', error);
//     return res.status(500).json({
//       message: 'Failed to mark notifications as read',
//       success: false
//     });
//   }
// });

// export default router;