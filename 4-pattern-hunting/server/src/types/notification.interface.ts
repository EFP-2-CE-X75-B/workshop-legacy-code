import { NotificationType } from './notification.type';

/**
 * The Notification interface is used to define the notification object.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
  metadata?: Record<string, any>;
} 