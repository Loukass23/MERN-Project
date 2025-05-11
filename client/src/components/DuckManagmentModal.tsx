import { useState, useEffect } from "react";
import { DuckType, DuckOptions } from "../@types";
import { useAuth } from "../context/AuthContext";
import { Modal } from "./Modal";
import { ImageUploader } from "./ImageUploader";
import { DuckFormFields } from "./DuckFormFields";
import { ErrorDisplay } from "./ErrorDisplay";

interface DuckManagementModalProps {
  duck: DuckType;
  options: DuckOptions;
  onClose: () => void;
  onUpdate: (updatedDuck: DuckType) => void;
  onDelete: (duckId: string) => void;
}

export default function DuckManagementModal({
  duck,
  options,
  onClose,
  onUpdate,
  onDelete,
}: DuckManagementModalProps) {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    name: duck.name,
    breed: duck.breed || "",
    gender: duck.gender || "",
    description: duck.description || "",
    isRubberDuck: duck.isRubberDuck || false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>(
    {}
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        return value.trim() ? null : "Name is required";
      case "gender":
        return value && !options.genders.includes(value)
          ? "Please select a valid gender"
          : null;
      case "breed":
        return value && !options.breeds.includes(value)
          ? "Please select a valid breed"
          : null;
      case "description":
        return value.length > 500
          ? "Description must be less than 500 characters"
          : null;
      default:
        return null;
    }
  };

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

    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(
        name,
        type === "checkbox" ? String(checked) : value
      ),
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
      if (!token || !isAuthenticated || !user) {
        setError("You need to be logged in to update a duck");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.gender) formDataToSend.append("gender", formData.gender);
      if (formData.breed) formDataToSend.append("breed", formData.breed);
      formDataToSend.append("isRubberDuck", String(formData.isRubberDuck));
      if (formData.description)
        formDataToSend.append("description", formData.description);
      if (imageFile) formDataToSend.append("image", imageFile);

      const response = await fetch(
        `http://localhost:8000/api/ducks/${duck._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update duck");
      }

      const responseData = await response.json();
      onUpdate(responseData.duck);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token || !isAuthenticated || !user) {
        setError("You need to be logged in to delete a duck");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/ducks/${duck._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete duck");
      }

      onDelete(duck._id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Manage Duck</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && <ErrorDisplay error={error} className="mb-4" />}

        {showDeleteConfirm ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">🦆</div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              Are you sure you want to delete {duck.name}?
            </h3>
            <p className="text-gray-600 mb-6">
              This cute ducky will be removed from the pond forever!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300"
              >
                {isSubmitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DuckFormFields
              formData={formData}
              options={options}
              onChange={handleChange}
              errors={fieldErrors}
            />

            <div>
              <label className="block text-blue-700 mb-1">Duck Image</label>
              <ImageUploader
                previewUrl={previewUrl}
                onChange={handleFileChange}
                currentImage={duck.image}
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to keep current image
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                Delete Duck
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || Object.values(fieldErrors).some(Boolean)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
