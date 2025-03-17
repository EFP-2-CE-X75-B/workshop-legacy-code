import { DeliveryStrategy } from '../types/delivery-strategy.interface';
import { Notification } from '../types/notification.interface';
import { Config } from '../config/config';

/**
 * The DeliveryHandler class is responsible for handling the delivery of notifications.
 * It is used to send notifications to the next handler in the chain.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */
class DeliveryHandler {
  private nextHandler: DeliveryHandler | null = null;

  private retryCount: number = 0;
  private readonly maxRetries: number;

  constructor(maxRetries: number = Config.getInstance().get('retryAttempts')) {
    this.maxRetries = maxRetries;
  }

  setNext(handler: DeliveryHandler): DeliveryHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(strategy: DeliveryStrategy, notification: Notification, target: string): Promise<boolean> {
    try {
      const success = await strategy.send(notification, target);
      
      if (success) return true;

      if (this.retryCount < this.maxRetries && this.nextHandler) {
        this.retryCount++;
        console.log(`Retry attempt ${this.retryCount} for notification ${notification.id}`);
        return this.nextHandler.handle(strategy, notification, target);
      }

      return false;
    } catch (error) {
      if (this.nextHandler) {
        return this.nextHandler.handle(strategy, notification, target);
      }
      return false;
    }
  }
}

/**
 * The NotificationDeliveryService class is responsible for delivering notifications.
 * It is used to deliver notifications to the next handler in the chain.
 * 
 * It's the main service using the Strategy and Chain of Responsibility patterns.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */

export class NotificationDeliveryService {
  private deliveryStrategies: Map<string, DeliveryStrategy>;
  private deliveryHandler: DeliveryHandler;

  constructor() {
    this.deliveryStrategies = new Map();
    
    // Configuration of the chain of responsibility
    this.deliveryHandler = new DeliveryHandler();
    const secondAttempt = new DeliveryHandler();
    const finalAttempt = new DeliveryHandler();

    this.deliveryHandler
      .setNext(secondAttempt)
      .setNext(finalAttempt);
  }

  registerStrategy(name: string, strategy: DeliveryStrategy): void {
    this.deliveryStrategies.set(name, strategy);
  }

  removeStrategy(name: string): void {
    this.deliveryStrategies.delete(name);
  }

  async deliver(notification: Notification, method: string, target: string): Promise<boolean> {
    const strategy = this.deliveryStrategies.get(method);
    
    if (!strategy) {
      console.error(`Delivery method ${method} not found`);
      return false;
    }

    try {
      return await this.deliveryHandler.handle(strategy, notification, target);
    } catch (error) {
      console.error(`Delivery failed for notification ${notification.id}:`, error);
      return false;
    }
  }

  async deliverToMultiple(notification: Notification, deliveryConfigs: Array<{ method: string; target: string }>): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    const promises = [];

    for (const deliveryConfig of deliveryConfigs) {
      promises.push(this.deliver(notification, deliveryConfig.method, deliveryConfig.target));
    }

    const responses = await Promise.all(promises);

    for (let i = 0; i < deliveryConfigs.length; i++) {
      results.set(`${deliveryConfigs[i].method}:${deliveryConfigs[i].target}`, responses[i]);
    }

    return results;
  }
} 