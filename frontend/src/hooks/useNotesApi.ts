import { useCallback, useEffect, useState } from 'react';
import { useApi } from './useApi';

export function useNotesApi(): UseNotesApiResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<AppData | undefined>(undefined);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);

  const api = useApi();

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await api.listNotes();
        setData({ notes: res.data, lastKey: res.lastKey });
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !data?.lastKey) return;

    setIsLoadingMore(true);
    try {
      const res = await api.listNotes(data.lastKey);
      setData((prev) => ({
        notes: [...(prev?.notes || []), ...(res.data || [])],
        lastKey: res.lastKey,
      }));
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, data?.lastKey, api]);

  const createNote = useCallback(
    async (payload: NotePayload) => {
      try {
        const newNote = await api.createNote(payload);
        setData((prev) => ({
          notes: [newNote, ...(prev?.notes || [])],
          lastKey: prev?.lastKey,
        }));
        setActiveNote(newNote);
      } catch (e) {
        setError(e as Error);
      }
    },
    [api]
  );

  const updateNote = useCallback(
    async (noteId: string, payload: NotePayload) => {
      try {
        const updated = await api.updateNote(noteId, payload);
        setData((prev) => {
          const notes = (prev?.notes || []).map((note) =>
            note.noteId === updated.noteId ? { ...note, ...updated } : note
          );
          return { notes, lastKey: prev?.lastKey };
        });

        setActiveNote(updated);
      } catch (e) {
        setError(e as Error);
      }
    },
    [api]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        await api.deleteNote(noteId);
        setData((prev) => {
          const notes = (prev?.notes || []).filter((note) => (note.noteId === noteId ? null : note));
          return { notes, lastKey: prev?.lastKey };
        });

        setActiveNote(undefined);
      } catch (e) {
        setError(e as Error);
      }
    },
    [api]
  );

  return {
    data,
    error,
    activeNote,
    setActiveNote,
    loadMore,
    createNote,
    updateNote,
    deleteNote,
    isLoading,
    isLoadingMore,
  };
}
