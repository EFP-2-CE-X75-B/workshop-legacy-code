import { useEffect, useCallback, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Notification } from '../types/notification';

interface NotificationConfig {
  email?: string;
  webhook?: {
    url: string;
    headers?: Record<string, string>;
  };
}

export function useWebSocket(config?: NotificationConfig) {
  const { addNotification } = useNotifications();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket('ws://localhost:3001');
    const ws = wsRef.current;

    ws.onopen = () => {
      console.log('Connected to notification server');
      if (config?.email) {
        ws.send(JSON.stringify({
          type: 'subscribe_email',
          email: config.email
        }));
      }
      if (config?.webhook) {
        ws.send(JSON.stringify({
          type: 'subscribe_webhook',
          webhookUrl: config.webhook.url,
          headers: config.webhook.headers
        }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      
      if (data.type === 'notification') {
        console.log('Adding notification:', data.notification);
        addNotification(data.notification);
      } else {
        console.log('Skipping notification:', data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed, attempting to reconnect...');
      // Attendre 5 secondes avant de tenter une reconnexion
      reconnectTimeoutRef.current = window.setTimeout(connect, 5000);
    };
  }, [config, addNotification]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'notification',
        notificationType: notification.type,
        content: notification.message,
        metadata: { ...notification.metadata, source: 'react-client' },
        deliveryMethods: [
          ...(config?.email ? [{ method: 'email', target: config.email }] : []),
          ...(config?.webhook ? [{ method: 'webhook', target: config.webhook.url }] : [])
        ]
      }));
    }
  }, [config]);

  return { sendNotification };
} 