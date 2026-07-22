import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "lucide-react";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
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
        setSuccessMessage(
          "If an account with that email exists, a reset link has been sent."
        );
      }
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
              <span className="text-indigo-600 font-semibold">
                Welcome 👋
              </span>

              <h1 className="text-5xl font-bold text-gray-900 mt-3">
                {mode === "login" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot" && "Forgot Password"}
              </h1>

              <p className="text-gray-500 mt-4 mb-10 leading-7">
                {mode === "login" && "Welcome back! Please login to continue."}
                {mode === "signup" && "Create your account to get started."}
                {mode === "forgot" && "Enter your email to reset your password."}
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

              {/* FORM */}
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {mode === "signup" && (
                  <InputField
                    label="Full Name"
                    type="text"
                    placeholder="Your name"
                    icon={User}
                    error={errors.name?.message}
                    {...register("name")}
                  />
                )}

                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="example@gmail.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                {mode !== "forgot" && (
                  <PasswordField
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register("password")}
                  />
                )}

                {mode === "login" && (
                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      Remember me
                    </label>

                    <Link to="/forgot-password" className="text-indigo-600">
                      Forgot Password?
                    </Link>
                  </div>
                )}

                <div className="space-y-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Please wait..."
                      : mode === "login"
                      ? "Sign In"
                      : mode === "signup"
                      ? "Create Account"
                      : "Send Reset Link"}
                  </Button>

                  {/* {mode !== "forgot" && (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-gray-500 text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div> */}
{/* 
                      <button
                        type="button"
                        className="
                          w-full
                          border
                          border-gray-300
                          rounded-xl
                          py-4
                          flex
                          items-center
                          justify-center
                          gap-3
                          hover:bg-gray-50
                          transition
                        "
                      >
                        <img
                          src="https://www.svgrepo.com/show/475656/google-color.svg"
                          className="w-5 h-5"
                          alt="google"
                        />
                        Continue with Google
                      </button>
                    </>
                  )} */}
                </div>
              </form>

              <div className="mt-8 text-center text-gray-500">
                {mode === "login" && (
                  <>
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-indigo-600 font-semibold">
                      Sign Up
                    </Link>
                  </>
                )}

                {mode === "signup" && (
                  <>
                    Already have an account?{" "}
                    <Link to="/" className="text-indigo-600 font-semibold">
                      Login
                    </Link>
                  </>
                )}

                {mode === "forgot" && (
                  <Link to="/" className="text-indigo-600 font-semibold">
                    Back to Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;