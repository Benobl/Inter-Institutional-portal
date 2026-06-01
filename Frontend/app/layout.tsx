import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "Mesob Data Exchange Portal",
  description: "A modern data sharing dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
