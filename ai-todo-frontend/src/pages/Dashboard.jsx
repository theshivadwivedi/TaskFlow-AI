import { useEffect, useState } from "react";
import { Plus, ListTodo, Clock, Loader2, CheckCircle2, Search, X } from "lucide-react";
import Navbar from "../components/Navbar";
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { user } = useAuth();
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

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    fetchTasks();
  }, [search, priorityFilter, statusFilter]);

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
    } catch (err) {
      setError("Couldn't load your tasks. Please try refreshing.");
    } finally {
      setIsLoading(false);
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      setTasks(previousTasks);
      setError("Couldn't update the task status.");
    }
  }

  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });

  async function refreshStats() {
    try {
      const { data } = await taskService.getTasks();
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

  return (
    <div className="min-h-screen bg-[#0B0E17] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-10" />
      <div className="pointer-events-none absolute top-96 -left-24 w-96 h-96 bg-violet-500 rounded-full blur-[100px] opacity-10" />

      <Navbar />

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-7 mb-6 shadow-lg">
          <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/10 rounded-full" />
          <div className="absolute right-16 bottom-0 w-24 h-24 bg-white/10 rounded-full" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">
                {getGreeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {stats.pending + stats.in_progress > 0
                  ? `You have ${stats.pending + stats.in_progress} task${
                      stats.pending + stats.in_progress === 1 ? "" : "s"
                    } to work on`
                  : "You're all caught up!"}
              </h2>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition shrink-0"
            >
              <Plus size={18} />
              New Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#12151F] rounded-2xl p-4 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-3">
              <ListTodo size={19} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.total}</p>
            <p className="text-xs text-white/40 font-medium mt-0.5">Total Tasks</p>
          </div>

          <div className="bg-[#12151F] rounded-2xl p-4 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center mb-3">
              <Clock size={19} className="text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.pending}</p>
            <p className="text-xs text-white/40 font-medium mt-0.5">Pending</p>
          </div>

          <div className="bg-[#12151F] rounded-2xl p-4 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mb-3">
              <Loader2 size={19} className="text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.in_progress}</p>
            <p className="text-xs text-white/40 font-medium mt-0.5">In Progress</p>
          </div>

          <div className="bg-[#12151F] rounded-2xl p-4 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-3">
              <CheckCircle2 size={19} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.completed}</p>
            <p className="text-xs text-white/40 font-medium mt-0.5">Completed</p>
          </div>
        </div>

        <div className="bg-[#12151F] rounded-2xl border border-white/10 p-4 mb-6">
          <div className="relative mb-3">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tasks by title..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 pl-11 pr-10 py-2.5 text-sm outline-none focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10 transition"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-white/40 mr-1">Priority:</span>
              {PRIORITY_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setPriorityFilter(f.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                    priorityFilter === f.value
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-white/40 mr-1">Status:</span>
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                    statusFilter === f.value
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-red-400 hover:text-red-300 ml-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center text-white/40 py-20">Loading your tasks...</div>
        )}

        {!isLoading && tasks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 mb-4">
              {hasActiveFilters
                ? "No tasks match your filters."
                : "No tasks yet — create your first one."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="text-indigo-400 font-semibold hover:text-indigo-300"
              >
                Clear filters
              </button>
            ) : (
              <button
                onClick={openCreateModal}
                className="text-indigo-400 font-semibold hover:text-indigo-300"
              >
                + Add a task
              </button>
            )}
          </div>
        )}

        {!isLoading && tasks.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-white mb-4">My Tasks</h3>
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </>
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

export default Dashboard;