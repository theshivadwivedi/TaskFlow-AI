import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, ArrowRight } from "lucide-react";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import { forgotPassword } from "../services/authServices";

const schemas = {
  login: z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  }),
  signup: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  forgot: z.object({
    email: z.string().email("Enter a valid email address"),
  }),
};

const COPY = {
  login: { heading: "Welcome back", subheading: "Sign in to your account", cta: "Sign in" },
  signup: { heading: "Create your account", subheading: "Start planning smarter with TaskFlow AI", cta: "Create account" },
  forgot: { heading: "Reset your password", subheading: "We'll send you a link to get back in", cta: "Send reset link" },
};

function Auth({ mode = "login" }) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemas[mode]),
  });

  useEffect(() => {
    setServerError("");
    setSuccessMessage("");
  }, [mode]);

  async function onSubmit(formData) {
    setServerError("");
    setSuccessMessage("");

    try {
      if (mode === "login") {
        await login(formData);
        navigate("/dashboard");
      }
      if (mode === "signup") {
        await signup(formData);
        navigate("/dashboard");
      }
      if (mode === "forgot") {
        await forgotPassword({ email: formData.email });
        setSuccessMessage("If an account with that email exists, a reset link has been sent.");
      }
    } catch (error) {
      setServerError(error.response?.data?.detail || "Something went wrong. Please try again.");
    }
  }

  const copy = COPY[mode];

  return (
    <div
      className="min-h-screen flex bg-[#FBF8F2]"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {/* LEFT — illustration panel */}
      <div className="hidden lg:flex w-[45%] bg-[#EFE7D6] relative items-center justify-center overflow-hidden">
        {/* dotted field */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(circle, #C9BC9C 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          {/* line-art path */}
          <svg width="220" height="140" viewBox="0 0 220 140" fill="none" className="mb-8">
            <path
              d="M20 90 L75 40 L125 70 L175 20"
              stroke="#5C3A21"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="90" r="4" fill="#5C3A21" />
            <circle cx="75" cy="40" r="4" fill="#5C3A21" />
            <circle cx="125" cy="70" r="4" fill="#5C3A21" />
            <circle cx="175" cy="20" r="4" fill="#B8863B" />
          </svg>

          <div className="w-12 h-12 rounded-full bg-[#5C3A21] flex items-center justify-center mb-6">
            <ArrowRight size={20} className="text-white" />
          </div>

          <h2 className="text-2xl font-bold text-[#2B2118] mb-3">TaskFlow AI</h2>
          <p className="text-[#7A7266] text-sm max-w-xs leading-relaxed">
            Sign in to organize your tasks and let AI help you focus on what
            matters most.
          </p>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-[#2B2118] mb-1">{copy.heading}</h1>
          <p className="text-[#A6A29C] text-sm mb-8">{copy.subheading}</p>

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

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {mode === "signup" && (
              <InputField
                label="Full Name *"
                type="text"
                placeholder="Your name"
                icon={User}
                error={errors.name?.message}
                {...register("name")}
              />
            )}

            <InputField
              label="Email *"
              type="email"
              placeholder="Enter your email address"
              error={errors.email?.message}
              {...register("email")}
            />

            {mode !== "forgot" && (
              <PasswordField
                label="Password *"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5C3A21] py-3.5 font-semibold text-white hover:bg-[#4A2E19] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Please wait..." : copy.cta}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>

          {mode === "login" && (
            <p className="text-center mt-5">
              <Link to="/forgot-password" className="text-sm text-[#5C3A21] hover:underline">
                Forgot password?
              </Link>
            </p>
          )}

          <div className="mt-8 text-center text-[#7A7266] text-sm">
            {mode === "login" && (
              <>
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#5C3A21] font-semibold hover:underline">
                  Sign Up
                </Link>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <Link to="/" className="text-[#5C3A21] font-semibold hover:underline">
                  Log in
                </Link>
              </>
            )}
            {mode === "forgot" && (
              <Link to="/" className="text-[#5C3A21] font-semibold hover:underline">
                Back to Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;