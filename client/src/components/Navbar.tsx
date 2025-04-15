import { useState } from "react";
import { Link } from "react-router";
import duckLogo from "../assets/images/duck-logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/30 hover:bg-white/50 transition-all duration-300 border-b border-white/20">
      <div className="flex items-center justify-between h-16 w-full px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <img
              className="h-28 w-42 rounded-full group-hover:scale-110 transition-transform duration-300"
              src={duckLogo}
              alt="Duck Logo"
            />
            {/* <span className="ml-3 text-xl font-comic text-yellow-600 font-bold hidden sm:inline-block">
              QuackWorld
            </span> */}
          </Link>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <Link
            to="/login"
            className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-yellow-600 bg-white/80 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
          >
            <span className="mr-1">🐥</span>
            Login
          </Link>
          <Link
            to="/signup"
            className="px-3 py-2 rounded-full text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
          >
            <span className="mr-1">🦆</span>
            Sign Up
          </Link>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-yellow-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } bg-white/90 backdrop-blur-sm transition-all duration-300`}
      >
        <div className="px-4 py-2 space-y-2">
          <Link
            to="/login"
            className="block px-3 py-2 rounded-full text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-white transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="mr-2">🐥</span>
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-3 py-2 rounded-full text-base font-medium text-white bg-yellow-500 hover:bg-yellow-400 transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="mr-2">🦆</span>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
