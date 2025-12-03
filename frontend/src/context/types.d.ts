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

type NotePayload = {
  title: string;
  content: string;
};

type UseNotesApiResult = {
  isLoading: boolean;
  isLoadingMore: boolean;
  data: AppData | undefined;
  error: Error | null;
  loadMore: () => Promise<void>;
  createNote: (payload: NotePayload) => Promise<void>;
  updateNote: (noteId: string, payload: NotePayload) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  activeNote: Note | undefined;
  setActiveNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
  setData: React.Dispatch<React.SetStateAction<AppData | undefined>>;
};

type DataContextType = UseNotesApiResult & {};
