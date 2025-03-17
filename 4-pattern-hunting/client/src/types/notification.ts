export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
  read?: boolean;
  metadata?: Record<string, any>;
}

export interface NotificationGroup {
  id: string;
  name: string;
  notifications: Notification[];
} 