import { WebSocket } from 'ws';
import { NotificationType } from '../types/notification.type';

/**
 * Observer Pattern
 * 
 * This interface is used to define the observer pattern.
 * It is used to force the implementer to notify the observer when the subject changes.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */
interface Observer {
  id: string;
  notify(notification: Notification): void;
}

/**
 * 
 */
interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * The NotificationSystem class is responsible for managing the notification system.
 * It is used to subscribe to notifications, send notifications, and get notifications.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */
export class NotificationSystem {
  private observers: Map<string, Observer>;

  constructor() {
    this.observers = new Map();
  }

  public subscribe(clientId: string, ws: WebSocket): void {
    this.observers.set(clientId, {
      id: clientId,
      notify: (notification: Notification) => {
        ws.send(JSON.stringify({
          type: 'notification',
          notification
        }));
      }
    });
  }

  public broadcast(notification: Notification, senderId?: string): void {
    console.log('Broadcasting notification:', notification);
    console.log('Current observers:', Array.from(this.observers.keys()));
    
    this.observers.forEach((observer, clientId) => {
      if (clientId !== senderId) {
        console.log(`Sending to client ${clientId}`);
        observer.notify(notification);
      } else {
        console.log(`Skipping sender ${clientId}`);
      }
    });
  }

  public unsubscribe(clientId: string): void {
    this.observers.delete(clientId);
  }
} 