import "./globals.css";

export const metadata = {
  title: "Auth App",
  description: "Authentication pages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
