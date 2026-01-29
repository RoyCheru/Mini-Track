import "./global.css"
import type { Metadata } from "next"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"

export const metadata: Metadata = {
  title: "Mini-Truck | School Minibus Booking",
  description: "Safe & affordable school transport with route tracking and real-time alerts.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Mini Track | Sign In",
  description: "Sign in to your Mini Track account",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 via-white to-gray-50">
        {children}
      </body>
    </html>
  );
}