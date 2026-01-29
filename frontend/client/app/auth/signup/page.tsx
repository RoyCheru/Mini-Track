// app/signup/page.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-100">
          {/* Image Logo - Replace src with your image path */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24">
             
              <img
                src="/images/logominitruck.png" 
                alt="Mini Track Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if image doesn't load
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              
              {/* Fallback logo (shows if image fails to load) */}
              <div 
                id="logo-fallback" 
                className="hidden w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl items-center justify-center"
              >
                <div className="text-white text-center">
                  <div className="text-xl font-bold">MT</div>
                  <div className="text-xs">Track</div>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-6">Sign In</h2>
          <p className="text-gray-500 text-sm mt-1">Create Your Account</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="John Doe" required className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input type="tel" placeholder="(123) 456-7890" required className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="you@email.com" required className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" required className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" required className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4">
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}