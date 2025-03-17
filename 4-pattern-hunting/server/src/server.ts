import { WebSocketServer } from 'ws';
import { Config } from './config/config';
import { NotificationSystem } from './core/notification-system';
import { NotificationDeliveryService } from './services/notification-delivery-service';
import { WebSocketStrategy, WebhookStrategy, EmailStrategy } from './strategies';
import { Notification } from './types/notification.interface';

// Facade Pattern
class NotificationServer {
  private wss: WebSocketServer;
  private notificationSystem: NotificationSystem;
  private deliveryService: NotificationDeliveryService;
  private config: Config;

  constructor() {
    this.config = Config.getInstance();
    this.notificationSystem = new NotificationSystem();
    this.deliveryService = new NotificationDeliveryService();
    
    // Register the default strategies
    this.deliveryService.registerStrategy('email', new EmailStrategy('steve.lebleu1979@gmail.com'));
    this.deliveryService.registerStrategy('webhook', new WebhookStrategy('http://localhost:3002/webhook'));

    this.wss = new WebSocketServer({
      port: this.config.get('port')
    });

    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws) => {
      const clientId = crypto.randomUUID();
      console.log(`Client connected: ${clientId}`);

      const wsStrategy = new WebSocketStrategy(ws);
      this.deliveryService.registerStrategy(`ws:${clientId}`, wsStrategy);
      this.notificationSystem.subscribe(clientId, ws);

      ws.on('message', (data) => {
        console.log('Message received:', data.toString());
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error('Error handling message:', error);
        }
      });

      ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        this.notificationSystem.unsubscribe(clientId);
        this.deliveryService.removeStrategy(`ws:${clientId}`);
      });
    });
  }

  private async handleClientMessage(clientId: string, message: any): Promise<void> {
    switch (message.type) {
      case 'subscribe_webhook':
        const webhookStrategy = new WebhookStrategy(message.webhookUrl);
        this.deliveryService.registerStrategy(`webhook:${clientId}`, webhookStrategy);
        break;

      case 'subscribe_email':
        const emailStrategy = new EmailStrategy(message.email);
        this.deliveryService.registerStrategy(`email:${clientId}`, emailStrategy);
        break;

      case 'notification':
        const notification: Notification = {
          id: crypto.randomUUID(),
          type: message.notificationType,
          message: message.content,
          timestamp: Date.now(),
          metadata: message.metadata
        };

        // Pass ID from the sender client
        this.notificationSystem.broadcast(notification, clientId);

        // Deliver via the configured methods
        if (message.deliveryMethods) {
          await this.deliveryService.deliverToMultiple(notification, message.deliveryMethods);
        }

        break;

      default:
        console.warn(`Unknown message type: ${message.type}`);
    }
  }

  start(): void {
    console.log(`Notification server running on port ${this.config.get('port')}`);
  }
}

// Start the websocket server
const server = new NotificationServer();
server.start(); 