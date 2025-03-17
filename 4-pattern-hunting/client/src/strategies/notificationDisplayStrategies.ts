import { Notification, NotificationType } from '../types/notification';

// Strategy Pattern: Interface pour les stratégies d'affichage
export interface NotificationDisplayStrategy {
  getIcon(type: NotificationType): string;
  getStyle(type: NotificationType): React.CSSProperties;
  formatTimestamp(timestamp: number): string;
  shouldGroup(notifications: Notification[]): boolean;
}

// Stratégie par défaut
export class DefaultDisplayStrategy implements NotificationDisplayStrategy {
  getIcon(type: NotificationType): string {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    };
    return icons[type];
  }

  getStyle(type: NotificationType): React.CSSProperties {
    const colors = {
      info: '#2196F3',
      warning: '#FF9800',
      error: '#F44336',
      success: '#4CAF50'
    };
    return {
      backgroundColor: colors[type] + '20',
      borderLeft: `4px solid ${colors[type]}`
    };
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  shouldGroup(notifications: Notification[]): boolean {
    return notifications.length > 3;
  }
}

// Stratégie compacte
export class CompactDisplayStrategy implements NotificationDisplayStrategy {
  getIcon(type: NotificationType): string {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    };
    return icons[type];
  }

  getStyle(type: NotificationType): React.CSSProperties {
    return {
      padding: '0.5rem',
      margin: '0.25rem',
      fontSize: '0.9rem'
    };
  }

  formatTimestamp(timestamp: number): string {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    return `${minutes}m ago`;
  }

  shouldGroup(notifications: Notification[]): boolean {
    return notifications.length > 5;
  }
} 