import { Pencil, Trash2, Calendar, CheckCircle2, Circle, ChevronDown } from "lucide-react";

const priorityDot = {
  high: "bg-red-500",
  medium: "bg-[#B8863B]",
  low: "bg-[#3F6B4E]",
};

const statusColor = {
  pending: "text-[#A6A29C]",
  in_progress: "text-[#5C6B5C]",
  completed: "text-[#3F6B4E]",
};

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isDone = task.status === "completed";

  function toggleDone() {
    onStatusChange(task.id, isDone ? "pending" : "completed");
  }

  return (
    <div className="group bg-white hover:bg-[#FBF8F2] px-5 py-4 flex items-start gap-3 transition-colors duration-150">
      <button
        onClick={toggleDone}
        className="mt-0.5 shrink-0 text-[#D4CBB6] hover:text-[#5C3A21] transition-colors"
        aria-label={isDone ? "Mark as not done" : "Mark as done"}
      >
        {isDone ? <CheckCircle2 size={19} className="text-[#3F6B4E]" /> : <Circle size={19} />}
      </button>

      <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[task.priority]}`} title={`${task.priority} priority`} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3
            className={`font-medium text-[#2B2118] text-[15px] ${
              isDone ? "line-through text-[#A6A29C]" : ""
            }`}
          >
            {task.title}
          </h3>
          {task.category && (
            <span className="text-xs text-[#A6A29C]">· {task.category}</span>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-[#A6A29C] mt-0.5 line-clamp-1">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0 ml-2">
        {task.due_date && (
          <span className="flex items-center gap-1 text-[#A6A29C] text-xs">
            <Calendar size={12} />
            {new Date(task.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}

        <div className="relative">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className={`appearance-none bg-transparent text-xs font-medium pr-4 outline-none cursor-pointer ${statusColor[task.status]}`}
          >
            <option value="pending">{statusLabels.pending}</option>
            <option value="in_progress">{statusLabels.in_progress}</option>
            <option value="completed">{statusLabels.completed}</option>
          </select>
          <ChevronDown size={11} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#A6A29C] hover:text-[#5C3A21] hover:bg-[#F0EADA] transition-colors"
            aria-label="Edit task"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#A6A29C] hover:text-red-700 hover:bg-red-50 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;