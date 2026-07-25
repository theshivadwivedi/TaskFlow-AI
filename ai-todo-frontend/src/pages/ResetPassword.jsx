import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import PasswordField from "../components/PasswordField";
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
      setServerError(error.response?.data?.detail || "Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="min-h-screen flex bg-[#FBF8F2]"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {/* LEFT — illustration panel */}
      <div className="hidden lg:flex w-[45%] bg-[#EFE7D6] relative items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(circle, #C9BC9C 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <svg width="220" height="140" viewBox="0 0 220 140" fill="none" className="mb-8">
            <path d="M20 90 L75 40 L125 70 L175 20" stroke="#5C3A21" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="20" cy="90" r="4" fill="#5C3A21" />
            <circle cx="75" cy="40" r="4" fill="#5C3A21" />
            <circle cx="125" cy="70" r="4" fill="#5C3A21" />
            <circle cx="175" cy="20" r="4" fill="#B8863B" />
          </svg>
          <div className="w-12 h-12 rounded-full bg-[#5C3A21] flex items-center justify-center mb-6">
            <ArrowRight size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#2B2118] mb-3">Almost there</h2>
          <p className="text-[#7A7266] text-sm max-w-xs leading-relaxed">
            Choose a new password and you'll be right back to planning.
          </p>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-[#2B2118] mb-1">Set new password</h1>
          <p className="text-[#A6A29C] text-sm mb-8">Choose a new password for your account</p>

          {serverError && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-lg bg-[#F0EADA] border border-[#E4DCC8] px-4 py-3 text-sm text-[#4A2E19]">
              {successMessage}
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <PasswordField
                label="New Password *"
                placeholder="Enter your new password"
                error={errors.new_password?.message}
                {...register("new_password")}
              />

              <PasswordField
                label="Confirm Password *"
                placeholder="Re-enter your new password"
                error={errors.confirm_password?.message}
                {...register("confirm_password")}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5C3A21] py-3.5 font-semibold text-white hover:bg-[#4A2E19] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Resetting..." : "Reset password"}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-[#7A7266] text-sm">
            <Link to="/" className="text-[#5C3A21] font-semibold hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;