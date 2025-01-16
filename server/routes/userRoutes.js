import express from 'express';
import { 
  // ... other imports
  getNotifications,
  cleanupNotifications
} from '../controllers/userControllers.js';

const router = express.Router();

// ... other routes

// Notification routes
router.get('/notifications/:id', getNotifications);
router.delete('/cleanup-notifications', cleanupNotifications);

export default router; 