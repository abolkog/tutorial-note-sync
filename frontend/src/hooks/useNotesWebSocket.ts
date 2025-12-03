import { setWebSocketConnectionId } from '@/lib/webSocketSession';
import { useAuth } from '@clerk/react-router';
import { useEffect, useRef } from 'react';

type useNotesWebSocketProps = {
  setActiveNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
  setData: React.Dispatch<React.SetStateAction<AppData | undefined>>;
};

export function useNotesWebSocket({ setActiveNote, setData }: useNotesWebSocketProps) {
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
        setData((prev) => ({
          notes: [newNote, ...(prev?.notes || [])],
          lastKey: prev?.lastKey,
        }));
        setActiveNote(newNote);
        break;
      }
      case 'note.updated': {
        const updated = payload.data as Note;
        setData((prev) => {
          const notes = (prev?.notes || []).map((note) =>
            note.noteId === updated.noteId ? { ...note, ...updated } : note
          );
          return { notes, lastKey: prev?.lastKey };
        });

        setActiveNote(updated);
        break;
      }
      case 'note.deleted': {
        const noteId = payload.data as string;
        setData((prev) => {
          const notes = (prev?.notes || []).filter((note) => (note.noteId === noteId ? null : note));
          return { notes, lastKey: prev?.lastKey };
        });

        setActiveNote(undefined);
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
