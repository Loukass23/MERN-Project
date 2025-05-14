// components/ReplyForm.tsx
import { FormEvent, useState } from "react";

interface ReplyFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialContent?: string;
  isEditing?: boolean;
}

export function ReplyForm({
  onSubmit,
  onCancel,
  initialContent = "",
  isEditing = false,
}: ReplyFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 ml-10">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isEditing ? "Edit your comment..." : "Write your reply..."}
        className="w-full border border-gray-300 rounded-lg p-2"
        rows={3}
        autoFocus
      />
      <div className="mt-2 space-x-2">
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          {isEditing ? "Save" : "Post Reply"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-200 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
