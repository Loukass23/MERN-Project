import { DuckListType, User } from "../@types";
import { DucksTab } from "./DucksTab";
import { LikedDucksTab } from "./LikedDucksTab";
import { LoadingIndicator } from "./LoadingIndicator";

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
    <div className="bg-white rounded-3xl shadow-xl p-6">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab("myDucks")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === "myDucks"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isCurrentUserProfile ? "My Ducks" : `${user.username}'s Ducks`}
          </button>
          {isCurrentUserProfile && (
            <button
              onClick={() => setActiveTab("likedDucks")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === "likedDucks"
                  ? "bg-blue-500 text-white shadow-sm"
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
        <div className="text-center py-12">
          <div className="text-8xl mb-4">🦆</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No liked ducks yet!
          </h3>
        </div>
      )}
    </div>
  );
}
