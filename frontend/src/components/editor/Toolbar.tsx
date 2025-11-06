import { Editor } from '@tiptap/react';
import { Heading1, Heading2, Heading3, Bold, Italic, List } from 'lucide-react';

import { Button } from '../ui/button';

type ToolBarProps = {
  editor?: Editor;
  onSave: VoidFunction;
  isValid: boolean;
  saving: boolean;
};

export default function ToolBar({ editor, onSave, isValid, saving }: ToolBarProps) {
  return (
    <div className="flex justify-between">
      <div className="space-x-2 mb-4">
        <Button variant="outline" onClick={() => editor?.chain().toggleBold().run()}>
          <Bold />
        </Button>
        <Button variant="outline" onClick={() => editor?.chain().toggleItalic().run()}>
          <Italic />
        </Button>
        <Button variant="outline" onClick={() => editor?.chain().toggleHeading({ level: 1 }).run()}>
          <Heading1 />
        </Button>
        <Button variant="outline" onClick={() => editor?.chain().toggleHeading({ level: 2 }).run()}>
          <Heading2 />
        </Button>
        <Button variant="outline" onClick={() => editor?.chain().toggleHeading({ level: 3 }).run()}>
          <Heading3 />
        </Button>
        <Button variant="outline" onClick={() => editor?.chain().toggleBulletList().run()}>
          <List />
        </Button>
      </div>
      <div>
        <Button disabled={!isValid || saving} onClick={onSave}>
          {saving ? 'Saving ...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
