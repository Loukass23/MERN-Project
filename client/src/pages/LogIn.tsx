import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";

const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
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
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

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
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Waddle Wonderland <span className="ml-2">🦆</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Quack-quack! Ready to waddle back in?
          </p>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center mt-2">{error}</div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            {/* <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label> */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-yellow-500">🐤</span>
              </div>
              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                required
                className="py-2 pl-10 block w-full rounded-full border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-white/70"
                placeholder="Username"
                value={formData.login}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            {/* <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label> */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-yellow-500">🔑</span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="py-2 pl-10 block w-full rounded-full border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-white/70"
                placeholder="DuckWord (Password)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-yellow-500 hover:text-yellow-400"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-300 mt-4 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Waddling..." : "Waddle In"}{" "}
            <span className="ml-1">→</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            New to the pond?{" "}
            <Link
              to="/signup"
              className="font-medium text-yellow-500 hover:text-yellow-400 underline"
            >
              Join the Wonderland!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
