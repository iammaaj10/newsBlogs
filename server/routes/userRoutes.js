import express from 'express';
import { 
  // ... other imports
  getNotifications,
  cleanupNotifications,
  handleLike,
  handleComment,
  handleFollow
} from '../controllers/userControllers.js';

const router = express.Router();

// ... other routes

// Notification routes
router.get('/notifications/:id', getNotifications);
router.delete('/cleanup-notifications', cleanupNotifications);

// Add these routes
router.post('/like', handleLike);
router.post('/comment', handleComment);
router.post('/follow', handleFollow);

export default router; 