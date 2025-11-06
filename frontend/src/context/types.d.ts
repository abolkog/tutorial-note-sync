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

type UseNotesApiResult = {
  isLoading: boolean;
  isLoadingMore: boolean;
  data: AppData | undefined;
  error: Error | null;
  loadMore: () => Promise<void>;
};

type DataContextType = UseNotesApiResult & {
  activeNote: Note | undefined;
  setActiveNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
};
