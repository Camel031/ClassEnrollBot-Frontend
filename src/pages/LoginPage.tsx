import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AcademicCapIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../stores/authStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setSubmitError(null);
    clearError();
    try {
      await login(data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const displayError = error ?? submitError;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-midnight-950">
      {/* Background effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 50% 0%, rgba(20, 184, 166, 0.15) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
            radial-gradient(at 100% 50%, rgba(45, 212, 191, 0.1) 0px, transparent 50%)
          `,
        }}
      />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-glow mb-4">
            <AcademicCapIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Enroll<span className="text-accent-400">Bot</span>
          </h1>
          <p className="text-midnight-400 mt-2">NTNU Course Enrollment Assistant</p>
        </div>

        <Card variant="glass" className="backdrop-blur-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-midnight-100">Welcome Back</h2>
            <p className="text-midnight-400 mt-1 text-sm">Sign in to your account</p>
          </div>

          {displayError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg animate-fade-in">
              <p className="text-sm text-rose-400">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              leftIcon={<EnvelopeIcon className="w-5 h-5" />}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              error={errors.password?.message}
            />

            <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-midnight-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-accent-400 hover:text-accent-300 font-medium transition-colors"
            >
              Create account
            </Link>
          </p>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-midnight-600 mt-8">
          By signing in, you agree to use this tool responsibly.
        </p>
      </div>
    </div>
  );
}
