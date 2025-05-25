import React, { useState, useRef } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { motion } from "framer-motion";

interface ProfilePictureCropperProps {
  src: string;
  onSave: (blob: Blob) => void;
  onClose: () => void;
}

const ProfilePictureCropper: React.FC<ProfilePictureCropperProps> = ({
  src,
  onSave,
  onClose,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleSave = () => {
    if (!completedCrop || !imageRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    // smaller dimension (circle)
    const size = Math.min(
      completedCrop.width! * scaleX,
      completedCrop.height! * scaleY
    );

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;

    // circular mask
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw the cropped image centered in the circle
    ctx.drawImage(
      imageRef.current,
      completedCrop.x! * scaleX,
      completedCrop.y! * scaleY,
      completedCrop.width! * scaleX,
      completedCrop.height! * scaleY,
      0,
      0,
      size,
      size
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onSave(blob);
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Crop Profile Picture
        </h2>
        <div className="mb-6">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1} // Keep aspect ratio 1:1 to ensure a perfect circle
            circularCrop={true} // Show circular crop area
          >
            <img
              ref={imageRef}
              src={src}
              alt="Crop preview"
              className="max-w-full max-h-[60vh] rounded-lg"
            />
          </ReactCrop>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePictureCropper;
