import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
import { resetPassword } from "../services/authServices";

const schema = z
  .object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(formData) {
    setServerError("");
    setSuccessMessage("");

    if (!token) {
      setServerError("This reset link is invalid or has expired.");
      return;
    }

    try {
      await resetPassword({ token, new_password: formData.new_password });
      setSuccessMessage("Your password has been reset. Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setServerError(
        error.response?.data?.detail || "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-5 lg:p-8">
      <div className="w-full max-w-7xl bg-white rounded-[32px] shadow-2xl p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[85vh]">
          {/* LEFT SIDE */}
          <div className="hidden lg:flex w-1/2 rounded-[28px] overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop"
              alt="workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70"></div>
            <div className="absolute top-8 left-8 text-white">
              <h1 className="text-3xl font-bold">TaskFlow AI</h1>
            </div>
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm">
                AI Powered Productivity
              </span>
              <h2 className="text-5xl font-bold mt-6 leading-tight">
                Organize Your Work Smarter
              </h2>
              <p className="mt-5 text-gray-200 leading-7 max-w-md">
                Manage your tasks, collaborate efficiently and let AI help you
                prioritize what matters most.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md">
              <span className="text-indigo-600 font-semibold">Welcome 👋</span>

              <h1 className="text-5xl font-bold text-gray-900 mt-3">
                Reset Password
              </h1>

              <p className="text-gray-500 mt-4 mb-10 leading-7">
                Choose a new password for your account.
              </p>

              {serverError && (
                <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {serverError}
                </div>
              )}

              {successMessage && (
                <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
                  {successMessage}
                </div>
              )}

              {!successMessage && (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <PasswordField
                    label="New Password"
                    placeholder="Enter your new password"
                    error={errors.new_password?.message}
                    {...register("new_password")}
                  />

                  <PasswordField
                    label="Confirm Password"
                    placeholder="Re-enter your new password"
                    error={errors.confirm_password?.message}
                    {...register("confirm_password")}
                  />

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}

              <div className="mt-8 text-center text-gray-500">
                <Link to="/" className="text-indigo-600 font-semibold">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;