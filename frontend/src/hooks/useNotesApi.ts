import { useCallback, useEffect, useState } from 'react';
import { useApi } from './useApi';

export function useNotesApi(): UseNotesApiResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<AppData | undefined>(undefined);

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

  return {
    data,
    error,
    loadMore,
    isLoading,
    isLoadingMore,
  };
}
