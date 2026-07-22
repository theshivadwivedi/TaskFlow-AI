import { useNavigate } from "react-router-dom";
import { LogOut, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-[#0B0E17] border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center">
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <h1
          className="text-xl font-bold text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          TaskFlow AI
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <span className="hidden sm:flex items-center text-sm font-medium text-white/50">
            Hi,&nbsp;
            <span className="text-white font-semibold">{user.name}</span>
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
            text-white/50
            hover:bg-red-500/10
            hover:text-red-400
            transition-all
            duration-200
          "
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;