import React from "react";
import { Controller } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Label from "../Label/Label";
import "./TextEditor.scss";

interface TextEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  control,
  name,
  label,
  placeholder = "Enter Text...",
  defaultValue = "",
}) => {
  return (
    <div className="text-editor-wrapper">
      {label && <Label>{label}</Label>}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <TiptapEditor
            content={value || defaultValue}
            onUpdate={onChange}
            placeholder={placeholder}
          />
        )}
      />
    </div>
  );
};

interface TiptapEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onUpdate,
  placeholder,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "tiptap-blockquote",
          },
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: "tiptap-heading",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "tiptap-link",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
  });

  // Update editor content when content prop changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="text-editor">
      <div className="text-editor__toolbar">
        <div className="text-editor__toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`text-editor__button`}
            title="Undo"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`text-editor__button`}
            title="Redo"
          >
            ↷
          </button>
        </div>

        <div className="text-editor__toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`text-editor__button ${editor.isActive("bold") ? "text-editor__button--active" : ""}`}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`text-editor__button ${editor.isActive("italic") ? "text-editor__button--active" : ""}`}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={setLink}
            className={`text-editor__button ${editor.isActive("link") ? "text-editor__button--active" : ""}`}
            title="Add Link"
          >
            🔗
          </button>
        </div>

        <div className="text-editor__toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`text-editor__button ${editor.isActive({ textAlign: "left" }) ? "text-editor__button--active" : ""}`}
            title="Align Left"
          >
            ⬅
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`text-editor__button ${editor.isActive({ textAlign: "center" }) ? "text-editor__button--active" : ""}`}
            title="Align Center"
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`text-editor__button ${editor.isActive({ textAlign: "right" }) ? "text-editor__button--active" : ""}`}
            title="Align Right"
          >
            ➡
          </button>
        </div>

        <div className="text-editor__toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`text-editor__button ${editor.isActive("bulletList") ? "text-editor__button--active" : ""}`}
            title="Bullet List"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`text-editor__button ${editor.isActive("orderedList") ? "text-editor__button--active" : ""}`}
            title="Ordered List"
          >
            1.
          </button>
        </div>

        <div className="text-editor__toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`text-editor__button ${editor.isActive("blockquote") ? "text-editor__button--active" : ""}`}
            title="Blockquote"
          >
            "
          </button>
        </div>

        <div className="text-editor__toolbar-group">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: level as any }).run()
              }
              className={`text-editor__button ${
                editor.isActive("heading", { level }) 
                  ? "text-editor__button--active" 
                  : ""
              }`}
              title={`Heading ${level}`}
            >
              H{level}
            </button>
          ))}
        </div>
      </div>

      <div className="text-editor__content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextEditor;
