import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ChatWidget from "../components/chat/ChatWidget";
import * as taskService from "../services/taskService";
import { useAuth } from "../context/AuthContext";

const PRIORITY_FILTERS = [
  { value: "", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function Dashboard() {
<<<<<<< HEAD
  const { user } = useAuth();
  const navigate = useNavigate();
=======
  const { user, logout } = useAuth();
>>>>>>> c346e08b67fe3868abcd7e94cb3fe9f9d23aed83

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [allTasks, setAllTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    fetchTasks();
  }, [search, priorityFilter, statusFilter]);

  useEffect(() => {
    refreshStats();
  }, []);

  async function fetchTasks() {
    if (!hasLoadedOnce) setIsLoading(true);
    setError("");
    try {
      const { data } = await taskService.getTasks({
        search: search || undefined,
        priority: priorityFilter || undefined,
        status: statusFilter || undefined,
      });
      setTasks(data);
      setHasLoadedOnce(true);
    } catch {
      setError("Couldn't load your tasks. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshStats() {
    try {
      const { data } = await taskService.getTasks();
      setAllTasks(data);
      setStats({
        total: data.length,
        pending: data.filter((t) => t.status === "pending").length,
        in_progress: data.filter((t) => t.status === "in_progress").length,
        completed: data.filter((t) => t.status === "completed").length,
      });
    } catch {
      // non-critical
    }
  }

  const hasActiveFilters = search || priorityFilter || statusFilter;

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setPriorityFilter("");
    setStatusFilter("");
  }

  function openCreateModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  async function handleModalSubmit(formData) {
    try {
      if (editingTask) {
        const { data } = await taskService.updateTask(editingTask.id, formData);
        setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      } else {
        const { data } = await taskService.createTask(formData);
        setTasks((prev) => [data, ...prev]);
      }
      setIsModalOpen(false);
      refreshStats();
    } catch {
      setError("Couldn't save the task. Please try again.");
    }
  }

  async function handleDelete(taskId) {
    if (!window.confirm("Delete this task? This can't be undone.")) return;

    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await taskService.deleteTask(taskId);
      refreshStats();
    } catch {
      setTasks(previousTasks);
      setError("Couldn't delete the task. Please try again.");
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      refreshStats();
    } catch {
      setTasks(previousTasks);
      setError("Couldn't update the task status.");
    }
  }

<<<<<<< HEAD
=======
  const [allTasks, setAllTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });

  async function refreshStats() {
    try {
      const { data } = await taskService.getTasks();
      setAllTasks(data);
      setStats({
        total: data.length,
        pending: data.filter((t) => t.status === "pending").length,
        in_progress: data.filter((t) => t.status === "in_progress").length,
        completed: data.filter((t) => t.status === "completed").length,
      });
    } catch (err) {
      // Non-critical
    }
  }

  useEffect(() => {
    refreshStats();
  }, []);

>>>>>>> c346e08b67fe3868abcd7e94cb3fe9f9d23aed83
  const categoryProgress = useMemo(() => {
    const groups = {};
    allTasks.forEach((t) => {
      const key = t.category?.trim() || "Uncategorized";
      if (!groups[key]) groups[key] = { total: 0, completed: 0 };
      groups[key].total += 1;
      if (t.status === "completed") groups[key].completed += 1;
    });
    return Object.entries(groups)
      .map(([name, { total, completed }]) => ({
        name,
        total,
        completed,
        pct: total ? Math.round((completed / total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  }, [allTasks]);

  const dueThisWeek = useMemo(() => {
    const today = startOfDay(new Date());
    const buckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return { date: d, label: WEEKDAY_LABELS[d.getDay()], count: 0 };
    });
    allTasks.forEach((t) => {
      if (!t.due_date) return;
      const due = startOfDay(t.due_date);
      const bucket = buckets.find((b) => b.date.getTime() === due.getTime());
      if (bucket) bucket.count += 1;
    });
    return buckets;
  }, [allTasks]);

  const maxDueCount = Math.max(1, ...dueThisWeek.map((b) => b.count));

<<<<<<< HEAD
  const upcomingTasks = useMemo(() => {
    return allTasks
=======
  const upcomingGrouped = useMemo(() => {
    const withDates = allTasks
>>>>>>> c346e08b67fe3868abcd7e94cb3fe9f9d23aed83
      .filter((t) => t.due_date && t.status !== "completed")
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 4);
  }, [allTasks]);

<<<<<<< HEAD

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort(
        (a, b) =>
          new Date(b.created_at || b.due_date || 0) - new Date(a.created_at || a.due_date || 0)
      )
      .slice(0, 4);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#F7F3EC]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <Sidebar upcomingTasks={upcomingTasks} onTaskClick={openEditModal} />

      {/* fixed header */}
      <div className="fixed top-16 lg:top-0 left-0 right-0 lg:left-64 z-10 h-20 bg-white border-b border-[#E4DCC8] px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A29C]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-[#F7F3EC] border border-[#E4DCC8] rounded-lg text-[#2B2118] placeholder:text-[#A6A29C] pl-11 pr-8 py-2.5 text-sm outline-none focus:border-[#5C3A21]/50 transition-colors"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A29C] hover:text-[#5C3A21]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#5C3A21] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#4A2E19] transition-colors duration-200 shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Task
        </button>
      </div>

      {/* main content */}
      <div className="lg:ml-64 pt-36 lg:pt-20 px-4 sm:px-6 lg:px-8 pb-28">
        <p className="text-xs uppercase tracking-[0.15em] text-[#A6A29C] font-medium mb-1 mt-6">
          {getGreeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </p>
        <h2 className="text-[26px] font-bold text-[#2B2118] tracking-tight mb-6">
          {stats.pending + stats.in_progress > 0
            ? `${stats.pending + stats.in_progress} task${
                stats.pending + stats.in_progress === 1 ? "" : "s"
              } on your plate`
            : "You're all caught up"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatTile value={stats.total} label="Total" />
          <StatTile value={stats.pending} label="Pending" accent="text-[#B8863B]" />
          <StatTile value={stats.in_progress} label="In progress" accent="text-[#5C6B5C]" />
          <StatTile value={stats.completed} label="Completed" accent="text-[#3F6B4E]" />
        </div>

=======
  return (
    <div
      className="min-h-screen bg-[#F7F3EC]"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      <Sidebar upcomingGrouped={upcomingGrouped} onTaskClick={openEditModal} />

      {/* mobile-only top bar since sidebar hides below lg */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-[#2B2118] px-5 flex items-center justify-between">
        <span className="text-white font-bold">
          TaskFlow <span className="text-[#D9A15B]">AI</span>
        </span>
        <button onClick={logout} className="text-[#B8AF9C] hover:text-white transition-colors">
          <LogOut size={18} />
        </button>
      </div>

      {/* fixed header — search + New Task, sits beside sidebar on desktop, below mobile bar on mobile */}
      <div className="fixed top-16 lg:top-0 left-0 right-0 lg:left-64 z-10 h-20 bg-white border-b border-[#E4DCC8] px-8 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A29C]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-[#F7F3EC] border border-[#E4DCC8] rounded-lg text-[#2B2118] placeholder:text-[#A6A29C] pl-11 pr-8 py-2.5 text-sm outline-none focus:border-[#5C3A21]/50 transition-colors"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A29C] hover:text-[#5C3A21]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#5C3A21] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#4A2E19] transition-colors duration-200 shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Task
        </button>
      </div>

      {/* main content — offset for fixed sidebar (left) and fixed header (top) */}
      <div className="lg:ml-64 pt-36 lg:pt-20 px-8 pb-8">
        <p className="text-xs uppercase tracking-[0.15em] text-[#A6A29C] font-medium mb-1 mt-6">
          {getGreeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </p>
        <h2 className="text-[26px] font-bold text-[#2B2118] tracking-tight mb-6">
          {stats.pending + stats.in_progress > 0
            ? `${stats.pending + stats.in_progress} task${
                stats.pending + stats.in_progress === 1 ? "" : "s"
              } on your plate`
            : "You're all caught up"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatTile value={stats.total} label="Total" />
          <StatTile value={stats.pending} label="Pending" accent="text-[#B8863B]" />
          <StatTile value={stats.in_progress} label="In progress" accent="text-[#5C6B5C]" />
          <StatTile value={stats.completed} label="Completed" accent="text-[#3F6B4E]" />
        </div>

>>>>>>> c346e08b67fe3868abcd7e94cb3fe9f9d23aed83
        {categoryProgress.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#2B2118] mb-3">By category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {categoryProgress.map((c) => (
                <div key={c.name} className="bg-white border border-[#E4DCC8] rounded-xl p-4">
                  <p className="text-sm font-medium text-[#2B2118] mb-2 truncate">{c.name}</p>
                  <div className="flex items-center justify-between text-xs text-[#A6A29C] mb-2">
                    <span>{c.pct}%</span>
                    <span>{c.completed}/{c.total} tasks</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E4DCC8] overflow-hidden">
                    <div
                      className="h-full bg-[#5C3A21] rounded-full"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 bg-white border border-[#E4DCC8] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#2B2118] mb-4">Tasks due this week</h3>
          <div className="flex items-end justify-between gap-2 h-28">
            {dueThisWeek.map((b) => (
              <div key={b.label + b.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-20">
                  <div
                    className="w-full max-w-[28px] rounded-t bg-[#5C3A21]/80"
                    style={{ height: `${(b.count / maxDueCount) * 100}%`, minHeight: b.count ? "4px" : "0px" }}
                    title={`${b.count} task${b.count === 1 ? "" : "s"}`}
                  />
                </div>
                <span className="text-[11px] text-[#A6A29C]">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        <h3 className="text-sm font-semibold text-[#2B2118] mb-3">Recent tasks</h3>

        {/* filters + view all */}
=======
>>>>>>> c346e08b67fe3868abcd7e94cb3fe9f9d23aed83
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#A6A29C] mr-1">Priority</span>
            {PRIORITY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setPriorityFilter(f.value)}
                className={`px-3 py-1 rounded-full transition-colors duration-150 ${
                  priorityFilter === f.value
                    ? "bg-[#5C3A21] text-white"
                    : "bg-white border border-[#E4DCC8] text-[#7A7266] hover:border-[#5C3A21]/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#A6A29C] mr-1">Status</span>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1 rounded-full transition-colors duration-150 ${
                  statusFilter === f.value
                    ? "bg-[#5C3A21] text-white"
                    : "bg-white border border-[#E4DCC8] text-[#7A7266] hover:border-[#5C3A21]/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
<<<<<<< HEAD
            <button onClick={clearFilters} className="text-red-700/70 hover:text-red-700">
              Clear filters
            </button>
          )}

          <button
            onClick={() => navigate("/tasks")}
            className="ml-auto text-sm text-[#5C3A21] font-semibold hover:underline"
          >
            View all tasks →
          </button>
=======
            <button
              onClick={clearFilters}
              className="text-red-700/70 hover:text-red-700 ml-auto"
            >
              Clear filters
            </button>
          )}
>>>>>>> c346e08b67fe3868abcd7e94cb3fe9f9d23aed83
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center text-[#A6A29C] py-20 text-sm">Loading your tasks...</div>
        )}

        {!isLoading && tasks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#A6A29C] mb-4 text-sm">
<<<<<<< HEAD
              {hasActiveFilters ? "No tasks match your filters." : "No tasks yet — create your first one."}
=======
              {hasActiveFilters
                ? "No tasks match your filters."
                : "No tasks yet — create your first one."}
>>>>>>> c346e08b67fe3868abcd7e94cb3fe9f9d23aed83
            </p>
            {hasActiveFilters ? (
              <button onClick={clearFilters} className="text-[#5C3A21] text-sm font-semibold hover:underline">
                Clear filters
              </button>
            ) : (
              <button onClick={openCreateModal} className="text-[#5C3A21] text-sm font-semibold hover:underline">
                + Add a task
              </button>
            )}
          </div>
        )}

<<<<<<< HEAD
        {!isLoading && recentTasks.length > 0 && (
          <div className="border border-[#E4DCC8] rounded-xl overflow-hidden divide-y divide-[#E4DCC8] bg-white">
            {recentTasks.map((task) => (
=======
        {!isLoading && tasks.length > 0 && (
          <div className="border border-[#E4DCC8] rounded-xl overflow-hidden divide-y divide-[#E4DCC8] bg-white">
            {tasks.map((task) => (
>>>>>>> c346e08b67fe3868abcd7e94cb3fe9f9d23aed83
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          initialData={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      <ChatWidget />
    </div>
  );
}

function StatTile({ value, label, accent = "text-[#2B2118]" }) {
  return (
    <div className="bg-white border border-[#E4DCC8] rounded-xl p-4">
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      <p className="text-xs text-[#A6A29C] mt-0.5">{label}</p>
    </div>
  );
}

export default Dashboard;
