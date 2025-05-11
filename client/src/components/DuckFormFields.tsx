import { DuckOptions } from "../@types";

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
    <div className="space-y-4">
      <div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-blue-700 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className={`w-full p-3 border-2 rounded-lg focus:ring-1 ${
              errors.gender
                ? "border-red-500 focus:ring-red-500"
                : "border-blue-200 focus:border-blue-500 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Gender</option>
            {options.genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        <div>
          <label className="block text-blue-700 mb-1">Breed</label>
          <select
            name="breed"
            value={formData.breed}
            onChange={onChange}
            className={`w-full p-3 border-2 rounded-lg focus:ring-1 ${
              errors.breed
                ? "border-red-500 focus:ring-red-500"
                : "border-blue-200 focus:border-blue-500 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Breed</option>
            {options.breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
          {errors.breed && (
            <p className="text-red-500 text-sm mt-1">{errors.breed}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isRubberDuck"
          checked={formData.isRubberDuck}
          onChange={onChange}
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="ml-2 text-blue-700">This is a rubber duck</label>
      </div>

      <div>
        <label className="block text-blue-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          maxLength={500}
          className={`w-full p-3 border-2 rounded-lg focus:ring-1 ${
            errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-blue-200 focus:border-blue-500 focus:ring-blue-500"
          }`}
          rows={3}
          placeholder="Tell us about your duck..."
        />
        <div className="flex justify-between mt-1">
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
          <span className="text-sm text-gray-500 ml-auto">
            {formData.description.length}/500
          </span>
        </div>
      </div>
    </div>
  );
}
