// app/signin/page.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles = ["Admin", "Driver", "Parent"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Single Container with Drop Shadow */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100">
        
        {/* Logo and Header */}
        <div className="p-8 text-center border-b border-gray-100">
          {/* Image Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative w-100 h-100">
            
              <Image
                src="/images/logominitruck.png" 
                alt="Mini Track Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
      
          <p className="text-gray-500 text-sm mt-1">Kid's Transportation Tracker</p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-6">Sign In</h2>
          <p className="text-gray-600 text-sm mt-2">
            Enter your email and password below to sign into your account
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{selectedRole}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showRoleDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {/* Dropdown Menu */}
                {showRoleDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    {roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${selectedRole === role ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                      >
                        <User className="w-4 h-4" />
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
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