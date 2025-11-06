import { useMemo, useState, type ReactNode } from 'react';
import { DataContext } from './DataContext';
import { useNotesApi } from '@/hooks/useNotesApi';

type DataProviderProps = {
  children: ReactNode;
};

export function DataProvider({ children }: DataProviderProps) {
  const { isLoading, isLoadingMore, loadMore, data, error } = useNotesApi();
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);

  const value = useMemo<DataContextType>(
    () => ({
      isLoading,
      data,
      error,
      loadMore,
      isLoadingMore,
      activeNote,
      setActiveNote,
    }),
    [isLoading, data, error, loadMore, isLoadingMore, activeNote, setActiveNote]
  );
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
