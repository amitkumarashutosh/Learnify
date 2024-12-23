import { Course } from "@/types/course";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  input: Partial<Course>;
  setInput: React.Dispatch<React.SetStateAction<Partial<Course>>>;
}

export default function RichTextEditor({
  input,
  setInput,
}: RichTextEditorProps) {
  const handleChange = (content: string) => {
    setInput({ ...input, description: content });
  };

  return (
    <ReactQuill
      theme="snow"
      value={input.description}
      onChange={handleChange}
    />
  );
}
