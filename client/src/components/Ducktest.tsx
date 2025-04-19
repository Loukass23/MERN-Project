import duckVideo from "../assets/videos/ducks.mp4";
import fallbackPNG from "../assets/images/testingduck.png";
import { Link } from "react-router";

export default function DuckLanding() {
  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        className="absolute w-full h-full object-cover"
        poster={fallbackPNG}
      >
        <source src={duckVideo} type="video/mp4" />
        <img
          src={fallbackPNG}
          alt="Duck animation"
          className="w-full h-full object-cover"
        />
      </video>

      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 font-comic leading-tight">
          Quack-tastic Adventures Await!
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white mb-6 sm:mb-8 font-sans px-2 sm:px-0">
          Discover the most beautiful ducks from around the world in our
          feathery collection
        </p>
        <Link to="/Ducks" className="inline-block">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center mx-auto">
            <span>Explore Ducks</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </Link>
      </div>

      {/* Water effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-blue-200 to-transparent opacity-50"></div>
    </div>
  );
}
