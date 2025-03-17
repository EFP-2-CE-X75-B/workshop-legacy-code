import { DeliveryStrategy } from '../types/delivery-strategy.interface';
import { Notification } from '../types/notification.interface';

/**
 * The WebhookStrategy class is responsible for sending notifications via webhook.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */
export class WebhookStrategy implements DeliveryStrategy {
  private url: string;
  private headers?: Record<string, string>;

  constructor(webhookUrl: string, headers?: Record<string, string>) {
    this.url = webhookUrl;
    this.headers = headers;
  }

  async send(notification: Notification): Promise<boolean> {
    console.log('Webhook URL:', this.url);
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers
        },
        body: JSON.stringify(notification)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Webhook delivery failed:', error);
      return false;
    }
  }
}