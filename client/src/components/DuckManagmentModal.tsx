import { useState, useEffect } from "react";
import { DuckType, DuckOptions } from "../@types";
import { useAuth } from "../context/AuthContext";
import { Modal } from "./Modal";
import { ImageUploader } from "./ImageUploader";
import { DuckFormFields } from "./DuckFormFields";
import { ErrorDisplay } from "./ErrorDisplay";
import { API_ENDPOINTS } from "../config/api";
import { motion } from "framer-motion";

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

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Run initial validation when modal opens
  useEffect(() => {
    validateForm();
  }, []);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        return value.trim() ? null : "Name is required";
      case "gender":
        return !options.genders.includes(value)
          ? "Please select a valid gender"
          : null;
      case "breed":
        return !options.breeds.includes(value)
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

  const validateForm = () => {
    const errors = {
      name: validateField("name", formData.name),
      gender: validateField("gender", formData.gender),
      breed: validateField("breed", formData.breed),
      description: validateField("description", formData.description),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some((error) => error !== null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, String(newValue)),
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

    // Validate entire form before submission
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

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

      const response = await fetch(API_ENDPOINTS.DUCKS.SINGLE_DUCK(duck._id), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

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

      const response = await fetch(API_ENDPOINTS.DUCKS.SINGLE_DUCK(duck._id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.gender &&
      formData.breed &&
      !Object.values(fieldErrors).some((error) => error !== null)
    );
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg">
      <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {showDeleteConfirm ? "Delete Duck" : "Manage Duck"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Error Display */}
        {error && <ErrorDisplay error={error} className="mb-6" />}

        {/* Delete Confirmation View */}
        {showDeleteConfirm ? (
          <motion.div
            className="text-center py-4 md:py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-5xl mb-4">🦆</div>
            <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Delete {duck.name}?
            </h3>
            <p className="text-gray-600 mb-6 md:mb-8">
              This duck will be removed permanently!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {isSubmitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Edit Duck Form */
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 gap-6">
              <DuckFormFields
                formData={formData}
                options={options}
                onChange={handleChange}
                errors={fieldErrors}
              />

              <div>
                <label className="block text-blue-700 font-medium mb-2">
                  Duck Image
                </label>
                <ImageUploader
                  previewUrl={previewUrl}
                  onChange={handleFileChange}
                  currentImage={duck.image}
                />
                <p className="text-xs md:text-sm text-gray-500 mt-2">
                  Leave empty to keep current image
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all shadow-sm w-full sm:w-auto"
                >
                  Delete Duck
                </button>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition-all shadow-sm w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 w-full sm:w-auto"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </motion.form>
        )}
      </div>
    </Modal>
  );
}
