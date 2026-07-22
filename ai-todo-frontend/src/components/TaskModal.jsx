import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import Button from "./Button";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  category: z.string().max(50).optional().or(z.literal("")),
  due_date: z.string().optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed"]),
});

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 px-4 py-3 outline-none transition focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10";

const labelClass = "block text-sm font-medium text-white/50 mb-2";

function TaskModal({ initialData, onClose, onSubmit }) {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      due_date: initialData?.due_date ? initialData.due_date.slice(0, 10) : "",
      priority: initialData?.priority || "medium",
      status: initialData?.status || "pending",
    },
  });

  async function handleFormSubmit(formData) {
    const payload = {
      ...formData,
      description: formData.description || undefined,
      category: formData.category || undefined,
      due_date: formData.due_date || undefined,
    };
    await onSubmit(payload);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#12151F] rounded-3xl border border-white/10 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditMode ? "Edit Task" : "Create Task"}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} placeholder="e.g. Fix login bug" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              rows={3}
              placeholder="Optional details"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <input className={inputClass} placeholder="e.g. Web Dev" {...register("category")} />
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                className={inputClass}
                style={{ colorScheme: "dark" }}
                {...register("due_date")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Priority</label>
              <select className={inputClass} style={{ colorScheme: "dark" }} {...register("priority")}>
                <option value="low"style={{ backgroundColor: "#12151F", color: "#ffffff" }}>Low</option>
                <option value="medium"style={{ backgroundColor: "#12151F", color: "#ffffff" }}>Medium</option>
                <option value="high"style={{ backgroundColor: "#12151F", color: "#ffffff" }}>High</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={inputClass} style={{ colorScheme: "dark" }} {...register("status")}>
                <option value="pending" style={{ backgroundColor: "#12151F", color: "#ffffff" }}>Pending</option>
                <option value="in_progress" style={{ backgroundColor: "#12151F", color: "#ffffff" }}>In Progress</option>
                <option value="completed" style={{ backgroundColor: "#12151F", color: "#ffffff" }}>Completed</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;