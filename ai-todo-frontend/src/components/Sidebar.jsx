import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Sidebar({ upcomingTasks = [], onTaskClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function goTo(path) {
    navigate(path);
    setIsMobileOpen(false);
  }

  function handleTaskClick(task) {
    onTaskClick?.(task);
    setIsMobileOpen(false);
  }

  const isActive = (path) => location.pathname === path;

  const NavLinks = () => (
    <nav className="space-y-1 mb-6">
      <button
        onClick={() => goTo("/dashboard")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
          isActive("/dashboard")
            ? "bg-[#5C3A21] text-white"
            : "text-[#B8AF9C] hover:bg-white/5 hover:text-white"
        }`}
      >
        <LayoutDashboard size={17} />
        Dashboard
      </button>

      <button
        onClick={() => goTo("/tasks")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
          isActive("/tasks")
            ? "bg-[#5C3A21] text-white"
            : "text-[#B8AF9C] hover:bg-white/5 hover:text-white"
        }`}
      >
        <ListTodo size={17} />
        All Tasks
      </button>
    </nav>
  );

  const UpcomingList = () => (
    <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
      <p className="text-xs uppercase tracking-[0.1em] text-[#B8AF9C] font-medium px-2 mb-3">
        Upcoming
      </p>

      {upcomingTasks.length === 0 && (
        <p className="text-sm text-[#8A8071] px-2">No upcoming tasks.</p>
      )}

      <div className="space-y-1">
        {upcomingTasks.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTaskClick(t)}
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
  );

  const Footer = () => (
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
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-screen bg-[#2B2118] px-5 py-6 z-20"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        <div className="px-2 mb-6">
          <span className="text-white font-bold text-lg tracking-tight">
            TaskFlow <span className="text-[#D9A15B]">AI</span>
          </span>
        </div>
        <NavLinks />
        <UpcomingList />
        <Footer />
      </aside>

      {/* Mobile/tablet top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-[#2B2118] px-4 flex items-center justify-between"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-[#B8AF9C] hover:text-white transition-colors p-1 -ml-1"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className="text-white font-bold text-base">
          TaskFlow <span className="text-[#D9A15B]">AI</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-[#B8AF9C] hover:text-white transition-colors p-1 -mr-1"
          aria-label="Logout"
        >
          <LogOut size={19} />
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-[78%] max-w-xs bg-[#2B2118] px-5 py-6 flex flex-col">
            <div className="flex items-center justify-between px-2 mb-6">
              <span className="text-white font-bold text-lg tracking-tight">
                TaskFlow <span className="text-[#D9A15B]">AI</span>
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-[#B8AF9C] hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <NavLinks />
            <UpcomingList />
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
