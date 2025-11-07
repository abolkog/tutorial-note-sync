import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ToolBar from './Toolbar';
import { useAppData } from '@/hooks/useAppData';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

export default function Editor() {
  const [saving, setSaving] = useState(false);
  const { activeNote, createNote, updateNote } = useAppData();

  const [noteTitle, setNoteTitle] = useState(activeNote?.title || '');

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[80vh] p-6 text-gray-900 overflow-y-auto',
      },
    },
    onUpdate: () => setIsValid(Boolean(noteTitle.length && editor.getText().length)),
  });
  const [isValid, setIsValid] = useState(Boolean(noteTitle.length && editor.getText().length));

  useEffect(() => {
    if (!editor) return;

    if (!activeNote) {
      editor.commands.clearContent();
      setNoteTitle('');
      return;
    }

    editor.commands.setContent(activeNote.content);
    setNoteTitle(activeNote.title);
  }, [editor, activeNote]);

  useEffect(() => {
    setIsValid(Boolean(noteTitle.length && editor.getText().length));
  }, [noteTitle, editor]);

  async function handleSave() {
    if (saving) return;
    setSaving(true);

    const title = noteTitle.trim();
    const content = editor.getHTML();

    if (!activeNote || !activeNote.noteId) {
      await createNote({ title, content });
    } else {
      await updateNote(activeNote.noteId, { title, content });
    }

    setSaving(false);
  }

  return (
    <div className="min-h-screen font-sans antialiased w-full">
      <ToolBar editor={editor} onSave={handleSave} isValid={isValid} saving={saving} />
      <div className="mb-2">
        <Input value={noteTitle} placeholder="Note Title" onChange={(e) => setNoteTitle(e.target.value)} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
