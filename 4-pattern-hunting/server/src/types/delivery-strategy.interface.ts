import { Notification } from './notification.interface';

/**
 * The DeliveryStrategy interface is used to define the strategy for delivering notifications.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */

export interface DeliveryStrategy {
  send(notification: Notification, target: string): Promise<boolean>;
}