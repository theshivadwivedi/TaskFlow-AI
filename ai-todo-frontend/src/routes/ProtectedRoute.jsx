import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Blocks dashboard from unauthenticated users
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

// Blocks login/signup from already-authenticated users
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div
      style={{ fontFamily: "'Satoshi', sans-serif", backgroundColor: "#F7F3EC" }}
      className="min-h-screen flex flex-col items-center justify-center gap-3"
    >
      <div
        className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: "#E4DCC8", borderTopColor: "#5C3A21" }}
      />
      <p style={{ color: "#7A7266" }} className="text-sm">
        Loading...
      </p>
    </div>
  );
}

export default ProtectedRoute;