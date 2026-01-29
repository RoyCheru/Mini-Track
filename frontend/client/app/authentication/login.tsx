"use client";

export default function SignInPage() {
  return (
<div className="min-h-screen flex items-center justify-center">
  <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
   <h1 className="text-2xl font-bold text-center mb-6">
    Sign in to your account
   </h1>
  </div>

   {/* Form */}
        <form className="space-y-4"></form>
        
  <div>
  <label className="block text-sm font-medium mb-1">
    Email address
  </label>
  <input
    type="email"
    placeholder="you@example.com"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
  />
</div>
 <div>
  <label className="block text-sm font-medium mb-1">
    Password
  </label>
  <input
    type="password"
    placeholder="••••••••"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
  />
</div>


</div>

  );
}
