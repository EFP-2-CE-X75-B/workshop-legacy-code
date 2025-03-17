import { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { DefaultDisplayStrategy, CompactDisplayStrategy } from '../strategies/notificationDisplayStrategies';
import type { NotificationDisplayStrategy } from '../strategies/notificationDisplayStrategies';
import { NotificationItem } from './NotificationItem';
import { Notification, NotificationType } from '../types/notification';
import { useWebSocket } from '../hooks/useWebSocket';

export function NotificationHub() {
  const { notifications, markAsRead, clearNotifications } = useNotifications();
  const { theme } = useTheme();
  const [isCompact, setIsCompact] = useState(false);
  const [displayStrategy, setDisplayStrategy] = useState<NotificationDisplayStrategy>(
    new DefaultDisplayStrategy()
  );

  const { sendNotification } = useWebSocket({
    email: 'steve.lebleu1979@gmail.com',
    webhook: {
      url: 'http://localhost:3002/webhook',
      headers: {
        'Authorization': 'Bearer react-client'
      }
    }
  });

  console.log('Current notifications in hub:', notifications);

  // Strategy Pattern: Changement de stratégie d'affichage
  const toggleDisplayMode = () => {
    setIsCompact(!isCompact);
    setDisplayStrategy(current => 
      current instanceof DefaultDisplayStrategy 
        ? new CompactDisplayStrategy()
        : new DefaultDisplayStrategy()
    );
  };

  const handleTestNotification = () => {
    sendNotification({
      type: 'info',
      message: 'Test notification from UI',
      metadata: { source: 'ui' }
    });
  };

  return (
    <div className={`notification-hub ${theme}`}>
      <div className="notification-controls">
        <button onClick={toggleDisplayMode}>
          {isCompact ? 'Normal View' : 'Compact View'}
        </button>
        <button onClick={handleTestNotification}>
          Send Test
        </button>
        <button className="danger" onClick={clearNotifications}>
          Clear All
        </button>
      </div>

      <div className="notification-list">
        {displayStrategy.shouldGroup(notifications) ? (
          // Affichage groupé
          <div className="notification-groups">
            {/* Grouper par type */}
            {Object.entries(
              notifications.reduce<Record<NotificationType, Notification[]>>((groups, notification) => ({
                ...groups,
                [notification.type]: [...(groups[notification.type] || []), notification]
              }), {
                info: [],
                warning: [],
                error: [],
                success: []
              })
            ).map(([type, groupNotifications]) => (
              <div key={type} className="notification-group">
                <h3>{type} ({groupNotifications.length})</h3>
                {groupNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    strategy={displayStrategy}
                    onRead={markAsRead}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Affichage simple
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              strategy={displayStrategy}
              onRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
} 