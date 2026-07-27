import { useEffect, useState, useMemo } from "react";
import { Search, X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ChatWidget from "../components/chat/ChatWidget";
import * as taskService from "../services/taskService";

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

const PAGE_SIZE = 10;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function AllTasks() {
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priorityFilter, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await taskService.getTasks();
      setAllTasks(data);
    } catch {
      setError("Couldn't load your tasks. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }

  // filter client-side
  const filtered = useMemo(() => {
    return allTasks.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(search.toLowerCase());
      const matchPriority = !priorityFilter || t.priority === priorityFilter;
      const matchStatus = !statusFilter || t.status === statusFilter;
      return matchSearch && matchPriority && matchStatus;
    });
  }, [allTasks, search, priorityFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasActiveFilters = search || priorityFilter || statusFilter;

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setPriorityFilter("");
    setStatusFilter("");
    setCurrentPage(1);
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
        setAllTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      } else {
        const { data } = await taskService.createTask(formData);
        setAllTasks((prev) => [data, ...prev]);
      }
      setIsModalOpen(false);
    } catch {
      setError("Couldn't save the task. Please try again.");
    }
  }

  async function handleDelete(taskId) {
    if (!window.confirm("Delete this task? This can't be undone.")) return;
    const previous = allTasks;
    setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await taskService.deleteTask(taskId);
    } catch {
      setAllTasks(previous);
      setError("Couldn't delete the task. Please try again.");
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    const previous = allTasks;
    setAllTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await taskService.updateTask(taskId, { status: newStatus });
    } catch {
      setAllTasks(previous);
      setError("Couldn't update the task status.");
    }
  }

  // sidebar upcoming — 4 soonest non-completed tasks with due date
  const upcomingTasks = useMemo(() => {
    return allTasks
      .filter((t) => t.due_date && t.status !== "completed")
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 4);
  }, [allTasks]);

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
        <div className="mt-6 mb-4">
          <h2 className="text-[26px] font-bold text-[#2B2118] tracking-tight">All Tasks</h2>
          <p className="text-sm text-[#A6A29C] mt-0.5">
            {filtered.length} task{filtered.length === 1 ? "" : "s"}
            {hasActiveFilters ? " match your filters" : " total"}
          </p>
        </div>

        {/* filters */}
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
          <button onClick={clearFilters} className="text-red-700/70 hover:text-red-700">
            Clear filters
          </button>
        )}
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center text-[#A6A29C] py-20 text-sm">Loading your tasks...</div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#A6A29C] mb-4 text-sm">
              {hasActiveFilters ? "No tasks match your filters." : "No tasks yet — create your first one."}
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

        {!isLoading && filtered.length > 0 && (
          <>
            <div className="border border-[#E4DCC8] rounded-xl overflow-hidden divide-y divide-[#E4DCC8] bg-white">
              {paginated.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {/* pagination (responsive wrap) */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                <p className="text-sm text-[#A6A29C]">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4DCC8] text-sm text-[#7A7266] bg-white hover:border-[#5C3A21]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={15} />
                    Prev
                  </button>

                  <div className="flex items-center gap-1 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "..." ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-[#A6A29C] text-sm">
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => setCurrentPage(item)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === item
                                ? "bg-[#5C3A21] text-white"
                                : "bg-white border border-[#E4DCC8] text-[#7A7266] hover:border-[#5C3A21]/40"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4DCC8] text-sm text-[#7A7266] bg-white hover:border-[#5C3A21]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
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

export default AllTasks;