import { Notification } from '../types/notification';
import { NotificationDisplayStrategy } from '../strategies/notificationDisplayStrategies';

interface NotificationItemProps {
  notification: Notification;
  strategy: NotificationDisplayStrategy;
  onRead: (id: string) => void;
}

export function NotificationItem({ notification, strategy, onRead }: NotificationItemProps) {
  const { id, type, message, timestamp, read } = notification;

  return (
    <div 
      className={`notification-item ${read ? 'read' : 'unread'}`}
      style={strategy.getStyle(type)}
      onClick={() => !read && onRead(id)}
    >
      <span className="icon">{strategy.getIcon(type)}</span>
      <div className="content">
        <p className="message">{message}</p>
        <span className="timestamp">{strategy.formatTimestamp(timestamp)}</span>
      </div>
    </div>
  );
} 