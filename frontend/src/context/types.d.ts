type Note = {
  userId: string;
  noteId: string;
  title: string;
  content: string;
  createdAt: string;
};

type AppData = {
  notes: Note[];
  lastKey?: string;
};

type DataContextType = {
  isLoading: boolean;
  isLoadingMore: boolean;
  data: AppData | undefined;
  error: Error | null;
  loadMore: () => Promise<void>;
};
