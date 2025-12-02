import { useMemo, type ReactNode } from 'react';
import { DataContext } from './DataContext';
import { useNotesApi } from '@/hooks/useNotesApi';
import { useNotesWebSocket } from '@/hooks/useNotesWebSocket';

type DataProviderProps = {
  children: ReactNode;
};

export function DataProvider({ children }: DataProviderProps) {
  const {
    isLoading,
    isLoadingMore,
    loadMore,
    createNote,
    updateNote,
    deleteNote,
    data,
    error,
    activeNote,
    setActiveNote,
  } = useNotesApi();

  useNotesWebSocket();

  const value = useMemo<DataContextType>(
    () => ({
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
    }),
    [isLoading, data, error, loadMore, createNote, updateNote, deleteNote, isLoadingMore, activeNote, setActiveNote]
  );
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
