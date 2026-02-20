"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

type Role = { id: number; name: string };

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Friendly UI error states
  const [formError, setFormError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [rolesError, setRolesError] = useState<string | null>(null);

  const closeDropdown = () => setShowRoleDropdown(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setRolesError(null);
      try {
        const res = await apiFetch("/user_roles");
        const data = await res.json().catch(() => []);
        setRoles(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.error("Failed to fetch roles:", e);
        setRoles([]);
        setRolesError(
          e?.message || "Could not load roles. Please refresh the page.",
        );
      }
    };

    fetchRoles();
  }, []);

  async function resolveVehicleIdForDriver(
    userId: number,
  ): Promise<number | null> {
    try {
      const res = await apiFetch(`/vehicles?user_id=${userId}`);
      const json = await res.json().catch(() => ({}));
      const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.vehicles)
          ? json.vehicles
          : [];
      const v = list.find((x: any) => Number(x?.user_id) === Number(userId));
      if (v?.id) return Number(v.id);
    } catch (_) {}

    try {
      const res = await apiFetch("/vehicles");
      const json = await res.json().catch(() => ({}));
      const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.vehicles)
          ? json.vehicles
          : [];
      const v = list.find((x: any) => Number(x?.user_id) === Number(userId));
      if (v?.id) return Number(v.id);
    } catch (_) {}

    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // reset errors
    setFormError(null);
    setRoleError(null);
    closeDropdown();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!selectedRole?.id) {
      setRoleError("Please select your role to continue.");
      setFormError("Please fix the highlighted field.");
      return;
    }

    setIsLoading(true);

    const payload = { email, password, role_id: selectedRole.id };

    try {
      // apiFetch throws on non-OK responses
      const res = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (data?.user?.name) localStorage.setItem("username", data.user.name);

      const userId = Number(data?.user?.id ?? data?.user_id ?? data?.id ?? NaN);
      if (Number.isFinite(userId))
        localStorage.setItem("user_id", String(userId));
      else localStorage.removeItem("user_id");

      const roleName = String(data?.user?.role ?? "").toLowerCase();

      if (roleName === "driver") {
        localStorage.removeItem("vehicle_id");

        const directVehicleId = Number(
          data?.vehicle_id ?? data?.user?.vehicle_id ?? NaN,
        );
        if (Number.isFinite(directVehicleId)) {
          localStorage.setItem("vehicle_id", String(directVehicleId));
        } else if (Number.isFinite(userId)) {
          const resolved = await resolveVehicleIdForDriver(userId);
          if (resolved) localStorage.setItem("vehicle_id", String(resolved));
        }
      }

      if (roleName === "admin") window.location.href = "/dashboard/admin";
      else if (roleName === "parent")
        window.location.href = "/dashboard/parent";
      else window.location.href = "/dashboard/driver";
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || "Network/server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 px-4 bg-linear-to-br from-blue-50 via-white to-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 text-center border-b border-gray-100">
          <div className="flex justify-center mb-2">
            <div className="relative w-[100px] h-[100px]">
              <Image
                src="/images/logominitruck.png"
                alt="Mini Track Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-1">
            Kid&apos;s Transportation Tracker
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-3">Sign In</h2>
          <p className="text-gray-600 text-sm mt-2">
            Enter your email and password below to sign into your account
          </p>
        </div>

        <div className="p-8">
          {/* Main error banner */}
          {formError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="font-medium">Couldn’t sign you in</div>
              <div className="mt-1">{formError}</div>
            </div>
          )}

          {/* Roles fetch warning (non-blocking) */}
          {rolesError && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {rolesError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleDropdown((v) => !v);
                    setRoleError(null);
                    setFormError(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 border rounded-lg hover:border-gray-400 transition-colors text-left ${
                    roleError ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      {selectedRole ? selectedRole.name : "Select Role"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      showRoleDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {roleError && (
                  <p className="mt-2 text-xs text-red-600">{roleError}</p>
                )}

                {showRoleDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    {roles.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No roles available.
                      </div>
                    ) : (
                      roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setSelectedRole(role);
                            setShowRoleDropdown(false);
                            setRoleError(null);
                            setFormError(null);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                            selectedRole?.id === role.id
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          <User className="w-4 h-4" />
                          {role.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={() => setFormError(null)}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              New to Mini-track?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors inline-flex items-center gap-1 group"
              >
                Sign Up Here
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}