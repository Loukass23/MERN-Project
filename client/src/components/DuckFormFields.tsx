import { DuckOptions } from "../@types";
import { motion } from "framer-motion";

interface DuckFormFieldsProps {
  formData: {
    name: string;
    gender: string;
    breed: string;
    isRubberDuck: boolean;
    description: string;
  };
  options: DuckOptions;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors?: Record<string, string | null>;
}

export function DuckFormFields({
  formData,
  options,
  onChange,
  errors = {},
}: DuckFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Gender and Breed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Gender Field */}
        <div className="relative">
          <label className=" text-blue-700 mb-2 font-medium flex items-center">
            <span className="bg-blue-100 p-1 rounded-full mr-2">🦆</span>
            Gender
          </label>
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={onChange}
              className={`w-full p-3 pl-10 border-2 rounded-xl focus:ring-2 transition-all appearance-none ${
                errors.gender
                  ? "border-red-400 focus:ring-red-200 bg-red-50"
                  : "border-blue-200 focus:border-blue-400 focus:ring-blue-200 hover:border-blue-300 bg-white"
              }`}
            >
              <option value="">Select Gender</option>
              {options.genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-3.5 text-blue-400">
              {formData.gender === "Male"
                ? "♂"
                : formData.gender === "Female"
                ? "♀"
                : "🦆"}
            </div>
          </div>
          {errors.gender && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-1 pl-1 flex items-center"
            >
              <span className="mr-1">⚠️</span> {errors.gender}
            </motion.p>
          )}
        </div>

        {/* Breed Field */}
        <div className="relative">
          <label className=" text-blue-700 mb-2 font-medium flex items-center">
            <span className="bg-blue-100 p-1 rounded-full mr-2">🦆</span>
            Breed
          </label>
          <div className="relative">
            <select
              name="breed"
              value={formData.breed}
              onChange={onChange}
              className={`w-full p-3 pl-10 border-2 rounded-xl focus:ring-2 transition-all appearance-none ${
                errors.breed
                  ? "border-red-400 focus:ring-red-200 bg-red-50"
                  : "border-blue-200 focus:border-blue-400 focus:ring-blue-200 hover:border-blue-300 bg-white"
              }`}
            >
              <option value="">Select Breed</option>
              {options.breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-3.5 text-blue-400">
              {formData.breed ? "🦆" : "🔍"}
            </div>
          </div>
          {errors.breed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-1 pl-1 flex items-center"
            >
              <span className="mr-1">⚠️</span> {errors.breed}
            </motion.p>
          )}
        </div>
      </div>

      {/* Rubber Duck Toggle  */}
      <motion.div
        className={`p-4 rounded-xl border-2 transition-all ${
          formData.isRubberDuck
            ? "bg-yellow-50 border-yellow-200"
            : "bg-blue-50 border-blue-200"
        }`}
        whileHover={{ scale: 1.01 }}
      >
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              id="isRubberDuck"
              name="isRubberDuck"
              checked={formData.isRubberDuck}
              onChange={onChange}
              className="sr-only"
            />
            <div
              className={`block w-12 h-6 rounded-full transition-colors ${
                formData.isRubberDuck ? "bg-yellow-400" : "bg-blue-400"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                formData.isRubberDuck ? "translate-x-6" : ""
              }`}
            >
              {formData.isRubberDuck && (
                <span className="absolute -top-3 -right-3 text-xl">🦆</span>
              )}
            </div>
          </div>
          <div className="ml-4 font-medium text-blue-700">
            {formData.isRubberDuck ? (
              <span className="text-yellow-600">Rubber Duck Activated!</span>
            ) : (
              "This is a rubber duck"
            )}
          </div>
        </label>
      </motion.div>

      {/* Description Field */}
      <div className="relative">
        <label className=" text-blue-700 mb-2 font-medium flex items-center">
          <span className="bg-blue-100 p-1 rounded-full mr-2">📝</span>
          Tell Us About Your Duck
        </label>
        <div className="relative">
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            maxLength={500}
            className={`w-full p-4 pr-12 border-2 rounded-xl focus:ring-2 transition-all min-h-[120px] ${
              errors.description
                ? "border-red-400 focus:ring-red-200 bg-red-50"
                : "border-blue-200 focus:border-blue-400 focus:ring-blue-200 hover:border-blue-300 bg-white"
            }`}
            placeholder="What makes your duck special? Quirks, habits, or favorite foods..."
          />
          <motion.div
            className="absolute right-3 bottom-3 text-xl"
            animate={{
              y: [0, -5, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {formData.description.length > 400
              ? "😟"
              : formData.description.length > 200
              ? "🤔"
              : "🦆"}
          </motion.div>
        </div>
        <div className="flex justify-between items-center mt-2">
          {errors.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm flex items-center"
            >
              <span className="mr-1">⚠️</span> {errors.description}
            </motion.p>
          )}
          <div
            className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
              formData.description.length >= 480
                ? "bg-red-100 text-red-700"
                : formData.description.length >= 400
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {formData.description.length}/500
          </div>
        </div>
      </div>
    </div>
  );
}
