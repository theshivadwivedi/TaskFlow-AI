import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import Button from "./Button";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  category: z.string().max(50).optional().or(z.literal("")),
  due_date: z
  .string()
  .optional()
  .or(z.literal(""))
  .refine(
    (val) => {
      if (!val) return true; // empty is fine — due date is optional
      const selected = new Date(val + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    },
    { message: "Due date can't be in the past" }
  ),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed"]),
});

const inputClass =
  "w-full rounded-lg border border-[#E4DCC8] bg-[#F7F3EC] text-[#2B2118] placeholder:text-[#B8B0A0] px-4 py-3 outline-none transition focus:outline-none focus:ring-0 focus:border-[#5C3A21]";

const labelClass = "block text-sm font-medium text-[#7A7266] mb-2";

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
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      <div className="bg-white rounded-2xl border border-[#E4DCC8] w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2B2118]">
            {isEditMode ? "Edit Task" : "Create Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#A6A29C] hover:text-[#5C3A21] transition-colors outline-none focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} placeholder="e.g. Fix login bug" {...register("title")} />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea className={inputClass} rows={3} placeholder="Optional details" {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <input className={inputClass} placeholder="e.g. Web Dev" {...register("category")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input type="date" className={inputClass} {...register("due_date")} />
              {errors.due_date && (
                <p className="text-sm text-red-500 mt-1">{errors.due_date.message}</p>
              )}
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Priority</label>
              <select className={inputClass} {...register("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={inputClass} {...register("status")}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
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
