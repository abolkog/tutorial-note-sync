import { setWebSocketConnectionId } from '@/lib/webSocketSession';
import { useAuth } from '@clerk/react-router';
import { useEffect, useRef } from 'react';

type UseNotesWebSocketProps = Pick<UseNoteStateResult, 'addNoteInState' | 'updateNoteInState' | 'removeNoteInState'>;

export function useNotesWebSocket({ addNoteInState, updateNoteInState, removeNoteInState }: UseNotesWebSocketProps) {
  const { userId } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const mountedRef = useRef(false);

  function handleWSMessage(message: string) {
    const payload = JSON.parse(message);
    switch (payload.action) {
      case 'registered': {
        const { connectionId } = payload.data;
        setWebSocketConnectionId(connectionId);
        break;
      }
      case 'note.created': {
        const newNote = payload.data as Note;
        addNoteInState(newNote);
        break;
      }
      case 'note.updated': {
        const updated = payload.data as Note;
        updateNoteInState(updated);
        break;
      }
      case 'note.deleted': {
        const noteId = payload.data as string;
        removeNoteInState(noteId);
        break;
      }
      default:
        return;
    }
  }

  useEffect(() => {
    const webSocketURL = import.meta.env.VITE_WS_BASE_URL;
    if (!webSocketURL) return;

    if (mountedRef.current && wsRef.current) return;
    mountedRef.current = true;

    const ws = new WebSocket(webSocketURL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!userId) return;
      try {
        ws.send(JSON.stringify({ userId, action: 'register' }));
      } catch (e) {
        console.error('Error registering', e);
      }
    };

    ws.onmessage = (evt) => {
      handleWSMessage(evt.data);
    };

    ws.onerror = (e) => {
      console.error('Websocket error', e);
    };

    ws.onclose = () => {
      wsRef.current = null;
      mountedRef.current = false;
    };

    return () => {
      try {
        if (ws.readyState === WebSocket.CONNECTING) return;

        if (ws.readyState === WebSocket.OPEN) ws.close();
      } catch {
        console.error('Failed to close websocket');
      }
    };
  }, [userId]);
}
