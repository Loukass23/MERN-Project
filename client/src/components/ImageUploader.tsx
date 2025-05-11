import { useRef } from "react";

interface ImageUploaderProps {
  previewUrl?: string | null;
  onChange: (file: File) => void;
  currentImage?: string;
  required?: boolean;
  className?: string;
}

export function ImageUploader({
  previewUrl,
  onChange,
  currentImage,
  required = false,
  className = "",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        required={required}
      />
      <div
        onClick={triggerFileInput}
        className="w-full p-3 border-2 border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 flex items-center justify-center"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="h-32 object-cover rounded-lg"
          />
        ) : currentImage ? (
          <div className="relative h-32 w-full">
            <img
              src={currentImage}
              alt="Current"
              className="h-full w-full object-contain"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-bold">
              Change Image
            </div>
          </div>
        ) : (
          <span className="text-blue-500">Click to upload an image</span>
        )}
      </div>
    </div>
  );
}
