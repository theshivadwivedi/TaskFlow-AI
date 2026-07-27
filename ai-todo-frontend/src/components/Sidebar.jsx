import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Sidebar({ upcomingGrouped = [], onTaskClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
<aside
  className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-screen bg-[#2B2118] px-5 py-6 z-20"
  style={{ fontFamily: "'Satoshi', sans-serif" }}
>
      <div className="px-2 mb-6">
        <span className="text-white font-bold text-lg tracking-tight">
          TaskFlow <span className="text-[#D9A15B]">AI</span>
        </span>
      </div>

      <nav className="space-y-1 mb-6">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#5C3A21] text-white text-sm font-medium">
          <LayoutDashboard size={17} />
          Dashboard
        </div>
      </nav>

      {/* upcoming — scrolls internally if the list gets long */}
      <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
        <p className="text-xs uppercase tracking-[0.1em] text-[#B8AF9C] font-medium px-2 mb-3">
          Upcoming
        </p>

        {upcomingGrouped.length === 0 && (
          <p className="text-sm text-[#8A8071] px-2">No upcoming due dates.</p>
        )}

        <div className="space-y-4">
          {upcomingGrouped.map((group) => (
            <div key={group.label}>
              <p className="text-xs text-[#8A8071] px-2 mb-1.5">{group.label}</p>
              <div className="space-y-1">
                {group.tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onTaskClick?.(t)}
                    className="w-full text-left bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 hover:border-[#D9A15B]/40 transition-colors"
                  >
                    <p className="text-sm font-medium text-white truncate">{t.title}</p>
                    {t.category && (
                      <p className="text-xs text-[#8A8071] mt-0.5 truncate">{t.category}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-white/10 space-y-1 shrink-0">
        {user && (
          <div className="px-3 py-2 text-xs text-[#B8AF9C] truncate">
            Signed in as <span className="text-white font-medium">{user.name}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#B8AF9C] hover:bg-white/5 hover:text-white transition-colors duration-150"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
