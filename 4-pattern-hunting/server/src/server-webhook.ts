import express from 'express';
import { Notification } from './types/notification.interface';

/**
 * Just a simple Express HTTP server to simulate a webhook endpoint.
 * 
 * This server listens for notifications and displays them in the console
 * It demonstrates the Strategy pattern for notification delivery
 */
const app = express();
app.use(express.json());

const PORT = 3002;

/**
 * POST /webhook route
 * 
 * Receives notifications and displays them in the console
 * Simulates a webhook endpoint that could be used by another application
 * 
 * @param {Request} req - Express request containing the notification
 * @param {Response} res - Express response
 */
app.post('/webhook', (req, res) => {
  const notification: Notification = req.body;
  
  // Log received notification with date formatting
  console.log('Webhook received notification:', {
    type: notification.type,
    message: notification.message,
    timestamp: new Date(notification.timestamp).toLocaleString()
  });

  // Success response
  res.status(200).json({ success: true });
});

/**
 * Start webhook server
 * Listens on port 3002 to avoid conflicts with main server (3001)
 */
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
}); 