import { Link } from "react-router";
import { useState } from "react";
import PondPolicyModal from "../components/PondPolicyModal";

function Register() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50 pt-16">
      <PondPolicyModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Join Waddle Wonderland <span className="ml-2"></span>
          </h1>
          <p className="text-gray-600 mt-2">
            Create your nest and start waddling!
          </p>
        </div>

        <form className="space-y-4">
          <div>
            {/* <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duck Name
            </label> */}
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
              />
            </div>
          </div>

          <div>
            {/* <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label> */}
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
              />
            </div>
          </div>

          <div>
            {/* <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label> */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-yellow-500">🔄</span>
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="py-2 pl-10 block w-full rounded-full border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-white/70"
                placeholder="Confirm Duckword"
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-300 mt-4"
          >
            Join the Flock <span className="ml-1">🦆</span>
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
