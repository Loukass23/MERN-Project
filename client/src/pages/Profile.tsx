import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <>
      <div className="mt-12 min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-green-400 mb-12">
            welcome to your profile! {user?.username}
          </h1>
        </div>
      </div>
    </>
  );
}
export default Profile;
