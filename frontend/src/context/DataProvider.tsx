import { useMemo, type ReactNode } from 'react';
import { DataContext } from './DataContext';
import { useNotesApi } from '@/hooks/useNotesApi';
import { useNotesWebSocket } from '@/hooks/useNotesWebSocket';
import { useNoteState } from '@/hooks/useNoteState';

type DataProviderProps = {
  children: ReactNode;
};

export function DataProvider({ children }: DataProviderProps) {
  const {
    data,
    activeNote,
    setActiveNote,
    setNotesInState,
    addNoteInState,
    appendNotesInState,
    removeNoteInState,
    updateNoteInState,
  } = useNoteState();

  const { isLoading, isLoadingMore, loadMore, createNote, updateNote, deleteNote, error } = useNotesApi({
    data,
    setNotesInState,
    appendNotesInState,
    addNoteInState,
    updateNoteInState,
    removeNoteInState,
  });

  useNotesWebSocket({ addNoteInState, removeNoteInState, updateNoteInState });

  const value = useMemo<DataContextType>(
    () =>
      ({
        isLoading,
        data,
        error,
        loadMore,
        createNote,
        updateNote,
        deleteNote,
        isLoadingMore,
        activeNote,
        setActiveNote,
      } satisfies DataContextType),
    [isLoading, data, error, loadMore, createNote, updateNote, deleteNote, isLoadingMore, activeNote, setActiveNote]
  );
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
