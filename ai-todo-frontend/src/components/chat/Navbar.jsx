import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav
      className="bg-[#F7F3EC] border-b border-[#E4DCC8] px-8 py-5 flex items-center justify-between"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      <h1 className="text-[17px] font-bold text-[#2B2118] tracking-tight">
        TaskFlow <span className="text-[#5C3A21]">AI</span>
      </h1>

      <div className="flex items-center gap-6">
        {user && (
          <span className="hidden sm:inline text-sm text-[#7A7266]">
            Hi, <span className="text-[#2B2118] font-medium">{user.name}</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-[#7A7266] hover:text-[#5C3A21] transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;