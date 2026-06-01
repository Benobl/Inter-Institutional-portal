"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  FileText,
  BarChart3,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Institutions", href: "/admin/institutions", icon: Building2 },
  { name: "Requests", href: "/admin/requests", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Profile", href: "/admin/profile", icon: User },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin" || pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-60"
      } z-40 flex-shrink-0`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-base font-bold leading-tight tracking-tight text-gray-900">
              AdminPanel
            </p>
            <p className="text-xs text-blue-600 font-semibold">Mesob</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-gray-50 transition-colors z-50 text-gray-400 hover:text-gray-700"
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] uppercase font-semibold tracking-widest text-blue-600 px-3 pb-2">
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium text-sm ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 ${active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
              />
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 w-full font-medium text-sm ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-red-500" />
          {!collapsed && <span className="">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
