let _connectionId: string | null = null;

const STORAGE_KEY = '@abolkog/note-sync-con-id';
export function setWebSocketConnectionId(id: string) {
  _connectionId = id;
  localStorage.setItem(STORAGE_KEY, id);
}

export function getWebSocketConnectionId() {
  if (_connectionId) return _connectionId;
  const value = localStorage.getItem(STORAGE_KEY);
  _connectionId = value;
  return value;
}
