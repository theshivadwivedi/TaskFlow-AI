import { Pencil, Trash2, Calendar, Tag, CheckCircle2, Circle } from "lucide-react";

const priorityStyles = {
  high: "bg-red-500/10 text-red-400",
  medium: "bg-amber-500/10 text-amber-400",
  low: "bg-emerald-500/10 text-emerald-400",
};

const statusStyles = {
  pending: "bg-white/10 text-white/60",
  in_progress: "bg-blue-500/10 text-blue-400",
  completed: "bg-emerald-500/10 text-emerald-400",
};

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

const priorityBorder = {
  high: "border-l-red-400",
  medium: "border-l-amber-400",
  low: "border-l-emerald-400",
};

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isDone = task.status === "completed";

  function toggleDone() {
    onStatusChange(task.id, isDone ? "pending" : "completed");
  }

  return (
    <div
      className={`bg-[#12151F] rounded-2xl border border-white/10 border-l-4 ${priorityBorder[task.priority]} p-4 flex items-start gap-3 hover:border-white/20 transition-all duration-200`}
    >
      <button
        onClick={toggleDone}
        className="mt-0.5 shrink-0 text-white/20 hover:text-indigo-400 transition"
        aria-label={isDone ? "Mark as not done" : "Mark as done"}
      >
        {isDone ? (
          <CheckCircle2 size={22} className="text-emerald-400" />
        ) : (
          <Circle size={22} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`font-bold text-white text-[15px] leading-snug ${
              isDone ? "line-through text-white/30" : ""
            }`}
          >
            {task.title}
          </h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
          {task.category && (
            <span className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">
              <Tag size={10} />
              {task.category}
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-white/40 leading-relaxed mt-1 line-clamp-2">{task.description}</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 transition"
            aria-label="Edit task"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition"
            aria-label="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {task.due_date && (
            <span className="flex items-center gap-1 text-white/40 text-xs font-medium">
              <Calendar size={12} />
              {new Date(task.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          )}
        <select
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
        className={`text-[11px] font-semibold rounded-lg px-2 py-1 border-none outline-none cursor-pointer ${statusStyles[task.status]}`}
        style={{ colorScheme: "dark" }}
        >
        <option value="pending" style={{ backgroundColor: "#12151F", color: "#ffffff" }}>
            {statusLabels.pending}
        </option>
        <option value="in_progress" style={{ backgroundColor: "#12151F", color: "#ffffff" }}>
            {statusLabels.in_progress}
        </option>
        <option value="completed" style={{ backgroundColor: "#12151F", color: "#ffffff" }}>
            {statusLabels.completed}
        </option>
        </select>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;