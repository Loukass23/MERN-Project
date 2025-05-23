import { useState } from "react";
import { DuckOptions } from "../@types";
import { ImageUploader } from "./ImageUploader";
import { DuckFormFields } from "./DuckFormFields";
import { API_ENDPOINTS } from "../config/api";
import { motion } from "framer-motion";

interface CreateDuckFormProps {
  onDuckCreated: () => void;
  options: DuckOptions;
  onCancel: () => void;
}

export default function CreateDuckForm({
  onDuckCreated,
  options,
  onCancel,
}: CreateDuckFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    breed: "",
    isRubberDuck: false,
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to create a duck");
        return;
      }

      if (!imageFile) {
        setError("Please select an image for your duck");
        return;
      }

      if (!formData.name.trim()) {
        setError("Please provide a name for your duck");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("image", imageFile);
      formDataToSend.append("name", formData.name);
      if (formData.gender) formDataToSend.append("gender", formData.gender);
      if (formData.breed) formDataToSend.append("breed", formData.breed);
      formDataToSend.append("isRubberDuck", String(formData.isRubberDuck));
      if (formData.description)
        formDataToSend.append("description", formData.description);

      const response = await fetch(API_ENDPOINTS.DUCKS.BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create duck");
      }

      onDuckCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 border border-blue-100"
    >
      <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <span className="bg-blue-100 p-2 rounded-full">🦆</span>
        <span>Introduce Your Duck</span>
      </h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-blue-700 mb-1 font-medium">
            Duck's Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="e.g. Sir Quacksalot"
          />
        </div>

        <div>
          <label className="block text-blue-700 mb-1 font-medium">
            Duck Image *
          </label>
          <ImageUploader
            previewUrl={previewUrl}
            onChange={handleFileChange}
            required
          />
        </div>

        <DuckFormFields
          formData={formData}
          options={options}
          onChange={handleChange}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="inline-block animate-spin">🌀</span>
                Creating...
              </span>
            ) : (
              "Add to Pond"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
