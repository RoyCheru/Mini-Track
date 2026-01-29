import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Auth App",
  description: "Authentication pages",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}

