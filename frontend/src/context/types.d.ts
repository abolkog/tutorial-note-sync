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
  error: Error | null;
  loadMore: () => Promise<void>;
  createNote: (payload: NotePayload) => Promise<void>;
  updateNote: (noteId: string, payload: NotePayload) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
};

type UseNoteStateResult = {
  data: AppData | undefined;
  setNotesInState: (params: AppData) => void;
  appendNotesInState: (params: AppData) => void;
  addNoteInState: (params: Note) => void;
  updateNoteInState: (params: Note) => void;
  removeNoteInState: (noteId: string) => void;
  activeNote: Note | undefined;
  setActiveNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
};

type DataContextType = UseNotesApiResult & Pick<UseNoteStateResult, 'data' | 'activeNote' | 'setActiveNote'>;
