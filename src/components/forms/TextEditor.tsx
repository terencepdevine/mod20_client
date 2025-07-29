import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Label from "./Label";

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
  const editorId = `texteditor-${name}`;
  
  return (
    <div className="flex flex-col">
      {label && <Label htmlFor={editorId}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <Editor
            id={editorId}
            apiKey="a5kyw7zkfv5lyjk0mb0l14kpfafoyj4zt6qffz67go9kf6vc"
            value={value}
            onEditorChange={(newValue) => onChange(newValue)}
            init={{
              skin: "oxide-dark",
              placeholder: placeholder,
              height: 300,
              menubar: false,
              plugins: [
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "code",
                "formatting",
              ],
              toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link blockquote | h1 h2 h3 h4 h5 h6 | code",
              style_formats: [
                { title: "Header 1", block: "h1" },
                { title: "Header 2", block: "h2" },
                { title: "Header 3", block: "h3" },
                { title: "Header 4", block: "h4" },
                { title: "Header 5", block: "h5" },
                { title: "Header 6", block: "h6" },
                { title: "Blockquote", block: "blockquote" },
              ],
              content_style: `
          body { background-color: #111827; color: #d1d5db; } 
          a { color: #60a5fa; } 
          h1, h2, h3, h4, h5, h6 { color: #ffffff; } 
        `,
            }}
          />
        )}
      />
    </div>
  );
};

export default TextEditor;
