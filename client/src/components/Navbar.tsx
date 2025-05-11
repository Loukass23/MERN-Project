import { Link } from "react-router";
import duckLogo from "../assets/images/duck-logo.png";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  // console.log("Navbar render - isAuthenticated:", isAuthenticated);
  // console.log("User data:", user);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/30 transition-all duration-300 border-b border-white/20">
      <div className="flex items-center justify-between h-16 w-full">
        <Link to="/" className="flex items-center group">
          <img
            className="h-30 w-52 rounded-full group-hover:scale-110 transition-transform duration-300"
            src={duckLogo}
            alt="Duck Logo"
          />
        </Link>
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <Link
                to={`/profile/${user?.id}`}
                className="px-3 py-2 rounded-full text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
              >
                <span className="mr-1">👤</span>
                {user?.username || "Profile"}
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-yellow-600 bg-white/80 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
              >
                <span className="mr-1">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-3 py-2 rounded-full text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
              >
                <span className="mr-1">🦆</span>
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-yellow-600 bg-white/80 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
              >
                <span className="mr-1">🐥</span>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
