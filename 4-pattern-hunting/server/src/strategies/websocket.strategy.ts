import { WebSocket } from 'ws';
import { DeliveryStrategy } from '../types/delivery-strategy.interface';
import { Notification } from '../types/notification.interface';

/**
 * The WebSocketStrategy class is responsible for sending notifications via websocket.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */
export class WebSocketStrategy implements DeliveryStrategy {
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  async send(notification: Notification): Promise<boolean> {
    try {
      this.ws.send(JSON.stringify(notification));
      return true;
    } catch (error) {
      console.error('WebSocket delivery failed:', error);
      return false;
    }
  }
}