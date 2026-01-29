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