import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
        TaskFlow AI
      </h1>

<div className="flex items-center gap-6">
  {user && (
    <span className="hidden sm:flex items-center text-lg font-semibold text-gray-800">
      Hi,&nbsp;
      <span className="text-indigo-600 font-bold">
        {user.name}
      </span>
    </span>
  )}

  <button
    onClick={handleLogout}
    className="
      flex
      items-center
      gap-2
      px-4
      py-2
      rounded-xl
      font-semibold
      text-gray-700
      hover:bg-red-50
      hover:text-red-600
      transition-all
      duration-300
    "
  >
    <LogOut size={20} strokeWidth={2.5} />
    <span>Logout</span>
  </button>
</div>
    </nav>
  );
}

export default Navbar;