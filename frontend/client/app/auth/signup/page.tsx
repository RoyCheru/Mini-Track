"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // UI error states (no alerts)
  const [formError, setFormError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // reset errors
    setFormError(null);
    setPasswordError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const phone_number = String(formData.get("phone_number") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setFormError("Please fix the highlighted field.");
      return;
    }

    // (optional) simple strength hint
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setFormError("Please fix the highlighted field.");
      return;
    }

    setIsLoading(true);

    const payload = {
      name,
      email,
      phone_number,
      password,
    };

    try {
      // apiFetch throws on non-OK responses
      const res = await apiFetch("/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (data?.user?.name) localStorage.setItem("username", data.user.name);

      // redirect to signin
      window.location.href = "/auth/signin";
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || "Network/server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-8 text-center border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24">
              <img
                src="/images/logominitruck.png"
                alt="Mini Track Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.getElementById("logo-fallback");
                  if (fallback) fallback.style.display = "flex";
                }}
              />

              <div
                id="logo-fallback"
                className="hidden w-full h-full bg-linear-to-r from-blue-600 to-blue-700 rounded-xl items-center justify-center"
              >
                <div className="text-white text-center">
                  <div className="text-xl font-bold">MT</div>
                  <div className="text-xs">Track</div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mt-6">Sign Up</h2>
          <p className="text-gray-500 text-sm mt-1">Create Your Account</p>
        </div>

        <div className="p-8">
          {/* Main error banner */}
          {formError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="font-medium">Couldn’t create your account</div>
              <div className="mt-1">{formError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  onChange={() => setFormError(null)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="(123) 456-7890"
                  required
                  onChange={() => setFormError(null)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                  onChange={() => setFormError(null)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={() => {
                    setFormError(null);
                    setPasswordError(null);
                  }}
                  className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    passwordError ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  onChange={() => {
                    setFormError(null);
                    setPasswordError(null);
                  }}
                  className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    passwordError ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="mt-2 text-xs text-red-600">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Sign In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
