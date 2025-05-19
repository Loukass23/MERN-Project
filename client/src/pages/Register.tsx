import { Link } from "react-router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Modal } from "../components/Modal";
import { API_ENDPOINTS } from "../config/api";

function Register() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Duckword don't match quack");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Log the user in after registration
      login(data.token, data.user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50 pt-16">
      {/* Pond Policy Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        playQuack={true}
        className="p-6 max-w-xs text-center"
      >
        <p className="text-lg font-medium text-gray-800 mb-2">
          🦆 <span className="text-yellow-500">Pond Policies</span> 🦆
        </p>
        <p className="text-sm text-gray-600">
          Quack responsibly: Be kind, post ducks, no bread crimes.
        </p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-4 px-4 py-1 rounded-full bg-yellow-400 text-white text-sm hover:bg-yellow-300 transition-colors"
        >
          Understood!
        </button>
      </Modal>
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Join Waddle Wonderland <span className="ml-2"></span>
          </h1>
          <p className="text-gray-600 mt-2">
            Create your nest and start waddling!
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-yellow-500">🐥</span>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="py-2 pl-10 block w-full rounded-full border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-white/70"
                placeholder="Duck Name"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-yellow-500">✉️</span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="py-2 pl-10 block w-full rounded-full border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-white/70"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-yellow-500">🔒</span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="py-2 pl-10 block w-full rounded-full border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-white/70"
                placeholder="Duckword (Password)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-yellow-500">🔄</span>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="py-2 pl-10 block w-full rounded-full border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-white/70"
                placeholder="Confirm Duckword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-yellow-500 hover:underline hover:text-yellow-400 text-sm font-medium"
              >
                Pond Policies
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-300 mt-4 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating your nest..." : "Join the Flock"}{" "}
            <span className="ml-1">🦆</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Already have a nest?{" "}
            <Link
              to="/login"
              className="font-medium text-yellow-500 hover:text-yellow-400 underline"
            >
              Waddle back in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
