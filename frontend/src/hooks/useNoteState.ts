import { useState, useCallback } from 'react';

export function useNoteState(): UseNoteStateResult {
  const [data, setData] = useState<AppData | undefined>(undefined);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);

  const setNotesInState = useCallback(({ notes, lastKey }: AppData) => {
    setData({ notes, lastKey });
  }, []);

  const appendNotesInState = useCallback(({ notes, lastKey }: AppData) => {
    setData((prev) => ({
      notes: [...(prev?.notes || []), ...(notes || [])],
      lastKey,
    }));
  }, []);

  const addNoteInState = useCallback((newNote: Note) => {
    setData((prev) => ({
      notes: [newNote, ...(prev?.notes || [])],
      lastKey: prev?.lastKey,
    }));
    setActiveNote(newNote);
  }, []);

  const updateNoteInState = useCallback((updated: Note) => {
    setData((prev) => ({
      notes: (prev?.notes || []).map((note) => (note.noteId === updated.noteId ? { ...note, ...updated } : note)),
      lastKey: prev?.lastKey,
    }));
    setActiveNote(updated);
  }, []);

  const removeNoteInState = useCallback((noteId: string) => {
    setData((prev) => ({
      notes: (prev?.notes || []).filter((note) => note.noteId !== noteId),
      lastKey: prev?.lastKey,
    }));
    setActiveNote(undefined);
  }, []);

  return {
    data,
    activeNote,
    setActiveNote,
    setNotesInState,
    appendNotesInState,
    addNoteInState,
    updateNoteInState,
    removeNoteInState,
  };
}
