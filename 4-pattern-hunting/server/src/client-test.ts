import WebSocket from 'ws';
import { Config } from './config/config';

const PORT = Config.getInstance().get('port');
const ws = new WebSocket(`ws://localhost:${PORT}`);

/**
 * Subscribe to notifications using email and webhook when the websocket is open, and send a test notification with multiple methods
 */
ws.on('open', () => {
  console.log('Connected to notification server');

  // Subscribe to email notifications
  ws.send(JSON.stringify({
    type: 'subscribe_email',
    email: 'test@example.com',
    preferences: {
      frequency: 'immediate'
    }
  }));

  // Subscribe to webhook notifications
  ws.send(JSON.stringify({
    type: 'subscribe_webhook',
    webhookUrl: 'http://localhost:3002/webhook',
    headers: {
      'Authorization': 'Bearer test123'
    }
  }));

  // Send a test notification with multiple methods
  ws.send(JSON.stringify({
    type: 'notification',
    notificationType: 'info',
    content: 'Test notification',
    metadata: { source: 'test-client' },
    deliveryMethods: [
      { method: 'email', target: 'test@example.com' },
      { method: 'webhook', target: 'http://localhost:3002/webhook' }
    ]
  }));
});

/**
 * Log the received websocket notifications
 */
ws.on('message', (data) => {
  console.log('Received:', JSON.parse(data.toString()));
}); 