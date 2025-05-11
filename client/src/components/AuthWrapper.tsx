import { useAuth } from "../context/AuthContext";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="...">Loading auth...</div>;
  }

  return <>{children}</>;
}
