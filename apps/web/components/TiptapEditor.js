'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Youtube } from '@tiptap/extension-youtube';
import { TextAlign } from '@tiptap/extension-text-align';
import { Bold, Italic, List, ListOrdered, Quote, Code, AlignLeft, AlignCenter, AlignRight, Link2, Image as ImageIcon, Video, Undo, Redo } from 'lucide-react';

const MenuBar = ({ editor, onImageUpload }) => {
  if (!editor) return null;

  const addImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file && onImageUpload) {
        try {
          const url = await onImageUpload(file);
          if (url) editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error("Image upload failed", error);
        }
      } else if (file) {
        // Fallback to data URI if no uploader provided
        const reader = new FileReader();
        reader.onload = (e) => {
          editor.chain().focus().setImage({ src: e.target.result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const addVideo = () => {
    const url = prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="tiptap-menu-bar" style={{ display: 'flex', gap: '8px', padding: '8px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><Bold size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><Italic size={16} /></button>
      
      <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />
      
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''} style={{ fontWeight: 'bold' }}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} style={{ fontWeight: 'bold' }}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} style={{ fontWeight: 'bold' }}>H3</button>

      <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />

      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}><AlignLeft size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}><AlignCenter size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}><AlignRight size={16} /></button>

      <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><List size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><ListOrdered size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}><Quote size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}><Code size={16} /></button>

      <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />

      <button type="button" onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}><Link2 size={16} /></button>
      <button type="button" onClick={addImage}><ImageIcon size={16} /></button>
      <button type="button" onClick={addVideo}><Video size={16} /></button>

      <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />

      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo size={16} /></button>
    </div>
  );
};

export default function TiptapEditor({ content, onChange, onImageUpload }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ inline: false }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="tiptap-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff' }}>
      <MenuBar editor={editor} onImageUpload={onImageUpload} />
      <div style={{ padding: '16px', minHeight: '300px' }} className="ProseMirror-wrapper">
        <EditorContent editor={editor} />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap-menu-bar button {
          background: transparent;
          border: none;
          color: #64748b;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tiptap-menu-bar button:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .tiptap-menu-bar button.is-active {
          background: #dbeafe;
          color: #2563eb;
        }
        .tiptap-menu-bar button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .ProseMirror {
          outline: none;
          color: #1e293b;
          line-height: 1.6;
        }
        .ProseMirror p { margin-bottom: 1em; }
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 { margin-top: 1.5em; margin-bottom: 0.5em; color: #0f172a; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0; }
        .ProseMirror iframe { max-width: 100%; border-radius: 8px; margin: 1em 0; }
        .ProseMirror blockquote { border-left: 3px solid #3b82f6; padding-left: 1em; margin-left: 0; color: #64748b; font-style: italic; }
        .ProseMirror pre { background: #f8fafc; color: #1e293b; padding: 1em; border-radius: 8px; overflow-x: auto; font-family: monospace; border: 1px solid #e2e8f0; }
        .ProseMirror a { color: #3b82f6; text-decoration: underline; }
      `}} />
    </div>
  );
}
