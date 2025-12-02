import { useAuth } from '@clerk/react-router';
import { useEffect, useRef } from 'react';

export function useNotesWebSocket() {
  const { userId } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const webSocketURL = import.meta.env.VITE_WS_BASE_URL;
    if (!webSocketURL || !userId) return;

    // Prevent duplicate connection
    if (mountedRef.current) return;

    mountedRef.current = true;

    const ws = new WebSocket(webSocketURL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WEBSOCKET OPEN');
      if (!userId) return;
      try {
        ws.send(JSON.stringify({ userId, action: 'register' }));
      } catch (e) {
        console.error('Error registering', e);
      }
    };

    ws.onmessage = (evt) => {
      const payload = JSON.parse(evt.data);
      console.log({
        data: payload,
        message: 'Websocket on Message',
      });
    };

    ws.onerror = (e) => {
      console.error('Websocket error', e);
    };

    ws.onclose = () => {
      wsRef.current = null;
      mountedRef.current = false;
    };

    return () => {
      // do not close in strict mode first cleanup
      if (ws.readyState === WebSocket.CONNECTING) return;

      try {
        if (ws.readyState === WebSocket.OPEN) ws.close();
      } catch {
        console.error('Failed to close the socket');
      }
    };
  }, [userId]);
}
