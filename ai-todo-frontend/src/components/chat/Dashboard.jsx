import { useEffect, useState } from "react";
import { Plus, ListTodo, Clock, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ChatWidget from "../components/chat/ChatWidget";
import * as taskService from "../services/taskService";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError("Couldn't load your tasks. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
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
    } catch (err) {
      setTasks(previousTasks);
      setError("Couldn't update the task status.");
    }
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-6xl font-bold text-gray-900">My Tasks</h2>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
              <ListTodo size={18} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-400">Total Tasks</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <Clock size={18} className="text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-xs text-gray-400">Pending</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <Loader2 size={18} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.in_progress}</p>
            <p className="text-xs text-gray-400">In Progress</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center text-gray-400 py-20">Loading your tasks...</div>
        )}

        {!isLoading && tasks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No tasks yet — create your first one.</p>
            <button
              onClick={openCreateModal}
              className="text-indigo-600 font-semibold hover:underline"
            >
              + Add a task
            </button>
          </div>
        )}

        {!isLoading && tasks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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