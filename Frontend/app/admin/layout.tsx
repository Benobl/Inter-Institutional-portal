import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { NotificationsProvider } from "@/components/NotificationsContext";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Data Exchange Portal",
  description: "A modern data sharing dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationsProvider>
          <Suspense fallback={<div className="p-4 text-center text-gray-500">Loading Header...</div>}>
            <Header />
          </Suspense>
          {children}
        </NotificationsProvider>
      </body>
    </html>
  );
}
