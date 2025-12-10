import { useCallback, useEffect, useState } from 'react';
import { useApi } from './useApi';

type UseNoteApiProps = Omit<UseNoteStateResult, 'activeNote' | 'setActiveNote'>;

export function useNotesApi({
  data,
  setNotesInState,
  appendNotesInState,
  addNoteInState,
  updateNoteInState,
  removeNoteInState,
}: UseNoteApiProps): UseNotesApiResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const api = useApi();

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await api.listNotes();
        setNotesInState({ notes: res.data, lastKey: res.lastKey });
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
      appendNotesInState({ notes: res.data, lastKey: res.lastKey });
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, appendNotesInState, data?.lastKey, api]);

  const createNote = useCallback(
    async (payload: NotePayload) => {
      try {
        const newNote = await api.createNote(payload);
        addNoteInState(newNote);
      } catch (e) {
        setError(e as Error);
      }
    },
    [api, addNoteInState]
  );

  const updateNote = useCallback(
    async (noteId: string, payload: NotePayload) => {
      try {
        const updated = await api.updateNote(noteId, payload);
        updateNoteInState(updated);
      } catch (e) {
        setError(e as Error);
      }
    },
    [api, updateNoteInState]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        await api.deleteNote(noteId);
        removeNoteInState(noteId);
      } catch (e) {
        setError(e as Error);
      }
    },
    [api, removeNoteInState]
  );

  return {
    error,
    loadMore,
    createNote,
    updateNote,
    deleteNote,
    isLoading,
    isLoadingMore,
  };
}
