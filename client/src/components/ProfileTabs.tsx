import { DuckListType, User } from "../@types";
import { DucksTab } from "./DucksTab";
import { LikedDucksTab } from "./LikedDucksTab";
import { LoadingIndicator } from "./LoadingIndicator";
import { motion } from "framer-motion";

interface ProfileTabsProps {
  userDucks: DuckListType;
  likedDucks: DuckListType;
  user: User;
  isCurrentUserProfile: boolean;
  onEditDuck: (duck: any) => void;
  activeTab: "myDucks" | "likedDucks";
  setActiveTab: (tab: "myDucks" | "likedDucks") => void;
  isLoading: boolean;
}

export function ProfileTabs({
  userDucks,
  likedDucks,
  user,
  isCurrentUserProfile,
  onEditDuck,
  activeTab,
  setActiveTab,
  isLoading,
}: ProfileTabsProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 relative overflow-hidden">
      {/* wave effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden z-0">
        <div className="wave-layer-3 opacity-20 w-full h-full"></div>
      </div>

      <div className="relative z-10">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setActiveTab("myDucks")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === "myDucks"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isCurrentUserProfile ? "My Ducks" : `${user.username}'s Ducks`}
            </button>
            {isCurrentUserProfile && (
              <button
                onClick={() => setActiveTab("likedDucks")}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeTab === "likedDucks"
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Liked Ducks
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingIndicator text="Loading ducks..." />
        ) : activeTab === "myDucks" || !isCurrentUserProfile ? (
          <DucksTab
            ducks={userDucks}
            user={user}
            isCurrentUserProfile={isCurrentUserProfile}
            onEditDuck={onEditDuck}
          />
        ) : likedDucks.length > 0 ? (
          <LikedDucksTab ducks={likedDucks} />
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-8xl mb-4">🦆</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No liked ducks yet!
            </h3>
            <p className="text-gray-500">Find some ducks you love!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
