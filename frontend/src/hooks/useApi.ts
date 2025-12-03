import { getWebSocketConnectionId } from '@/lib/webSocketSession';
import { useAuth } from '@clerk/react-router';

export function useApi() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const { getToken } = useAuth();

  async function getHeaders(withConnectionId = false) {
    const token = await getToken();
    if (!token) throw new Error('No auth token from Clerk.');

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    if (!withConnectionId) return headers;

    const connectionId = getWebSocketConnectionId();

    return {
      ...headers,
      'x-ws-connectionId': connectionId ?? '',
    };
  }

  async function listNotes(lastKey?: string) {
    const url = new URL(baseUrl);
    const headers = await getHeaders();
    if (lastKey) url.searchParams.set('lastKey', lastKey);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) throw new Error('Unable to fetch notes');

    const result = await response.json();
    return {
      data: result.data || [],
      lastKey: result.lastKey,
    };
  }

  async function createNote(payload: NotePayload) {
    const headers = await getHeaders(true);
    const response = await fetch(baseUrl, {
      headers,
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Unable to create new note');

    const result = await response.json();
    return result.note;
  }

  async function updateNote(noteId: string, payload: NotePayload): Promise<Note> {
    const headers = await getHeaders(true);

    const response = await fetch(`${baseUrl}/${noteId}`, {
      headers,
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Unable to update the note');

    const result = await response.json();
    return result.note;
  }

  async function deleteNote(noteId: string): Promise<void> {
    const headers = await getHeaders(true);

    const response = await fetch(`${baseUrl}/${noteId}`, {
      headers,
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Unable to update the note');
  }

  return {
    listNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}
