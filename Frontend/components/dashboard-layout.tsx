"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  BarChart3,
  Shield,
  Building2,
  Plus,
  Activity,
  Bell,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface UserData {
  id: number;
  email: string;
  role: string;
  avatar?: string | null;
  institution_id?: number | null;
}

interface InstitutionData {
  id: number;
  name: string;
  contact_person?: string;
  email?: string | null;
  phone?: string;
  address?: string;
  type?: string;
  status?: string;
  services?: string[] | string;
}

interface ApiResponse {
  user: UserData;
  institution?: InstitutionData | null;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "consumer" | "provider" | "contactperson";
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userData, setUserData] = useState<ApiResponse | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Load sidebar collapsed state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setIsSidebarCollapsed(savedState === "true");
    }
  }, []);

  // Sync collapsed state to localStorage
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  useEffect(() => {
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    fetchUserData();
    fetchUnreadNotificationsCount();
  }, [pathname]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          if (pathname !== "/login") {
            router.push("/login");
          }
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setUserData(data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const fetchUnreadNotificationsCount = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/unread", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setUnreadCount(data.length);
        }
      }
    } catch (err) {
      console.error("Failed to fetch unread notification count", err);
    }
  };

  const handleRefresh = () => {
    try {
      setIsRefreshing(true);
      fetchUserData();
      fetchUnreadNotificationsCount();
      router.refresh();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUserData(null);
      router.push("/login");
    }
  };

  const getNavigationItems = (): NavigationItem[] => {
    if (!userData) return [];

    const role = userData.user.role.toLowerCase();

    switch (role) {
      case "admin":
        return [
          { name: "Dashboard", href: "/admin/dashboard", icon: Home },
          {
            name: "Institutions",
            href: "/admin/institutions",
            icon: Building2,
          },
          { name: "API Requests", href: "/admin/requests", icon: FileText },
          { name: "Audit Logs", href: "/admin/audit-logs", icon: Shield },
          { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        ];
      case "consumer":
        return [
          { name: "Dashboard", href: "/consumer/dashboard", icon: Home },
          {
            name: "Submit Request",
            href: "/consumer/submit-request",
            icon: Plus,
          },
          { name: "My Requests", href: "/consumer/requests", icon: FileText },
          {
            name: "Notifications",
            href: "/consumer/notifications",
            icon: Bell,
          },
        ];
      case "provider":
      case "contactperson":
        return [
          { name: "Dashboard", href: "/provider/dashboard", icon: Home },
          {
            name: "Incoming Requests",
            href: "/provider/requests",
            icon: FileText,
          },
          { name: "Analytics", href: "/provider/analytics", icon: BarChart3 },
          {
            name: "Notifications",
            href: "/provider/notifications",
            icon: Bell,
          },
        ];
      default:
        return [];
    }
  };

  const getUserInfo = () => {
    if (!userData) {
      return null;
    }

    const { user, institution } = userData;

    const name =
      institution?.contact_person || user.email.split("@")[0] || "User";

    const avatar = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      name,
      email: user.email,
      avatar,
      institution: institution?.name,
      role: user.role,
    };
  };

  const getProfileUrl = (): string => {
    if (!userData) return "/login";

    const role = userData.user.role.toLowerCase();

    const profilePages: Record<string, string> = {
      admin: "/admin/profile",
      consumer: "/consumer/profile",
      provider: "/provider/profile",
      contactperson: "/consumer/profile",
    };

    return profilePages[role] || "/profile";
  };

  const getRoleDisplayName = (): string => {
    if (!userData) return "";

    return (
      userData.user.role.charAt(0).toUpperCase() + userData.user.role.slice(1)
    );
  };

  if (pathname === "/login") {
    return null;
  }

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm font-medium text-gray-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-sm">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="font-semibold text-gray-900 mb-1">Session Expired</p>
          <p className="text-sm text-gray-500 mb-4">Authentication token was invalid or expired.</p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  const navigationItems = getNavigationItems();
  const userInfo = getUserInfo();

  if (!userInfo) {
    return null;
  }

  const roleDisplayName = getRoleDisplayName();

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* 1. Left Sidebar (Desktop Only) */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200/80 shadow-xs relative transition-all duration-300 ease-in-out select-none flex-shrink-0 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Collapse Button toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-16 bg-white border border-gray-200 hover:border-gray-300 w-7 h-7 rounded-full flex items-center justify-center shadow-xs cursor-pointer z-50 text-gray-400 hover:text-gray-700 transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Logo Brand Header */}
        <div className={`h-16 flex items-center border-b border-gray-100 px-5 gap-3 ${isSidebarCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-lg text-gray-900 tracking-tight block">
                DataExchange
              </span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest leading-none block mt-0.5">
                {roleDisplayName} Portal
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm group ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                } ${isSidebarCollapsed ? "justify-center" : ""}`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <IconComponent
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}
                {/* Notification Badge indicator inside My Requests/Incoming or Notifications */}
                {!isSidebarCollapsed && item.name === "Notifications" && unreadCount > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-500 text-white font-bold text-xs px-2 py-0.5 rounded-full flex-shrink-0 shadow-xs border-0">
                    {unreadCount}
                  </Badge>
                )}
                {isSidebarCollapsed && item.name === "Notifications" && unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Role / Profile Switch details */}
        <div className="p-3 border-t border-gray-100">
          {!isSidebarCollapsed ? (
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-gray-200 flex-shrink-0 shadow-xs">
                <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
                  {userInfo.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-gray-800 truncate leading-snug">
                  {userInfo.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate leading-none mt-0.5">
                  {userInfo.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar className="h-9 w-9 border border-gray-200 shadow-xs">
                <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
                  {userInfo.avatar}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main content container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200/80 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 sticky top-0 z-40">
          {/* Logo / Drawer Trigger for Mobile */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-500 hover:text-gray-900 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm font-bold text-sm">
                DE
              </div>
              <span className="font-bold text-lg text-gray-900">DataExchange</span>
            </div>
            {/* Breadcrumb Info or Institutional details */}
            <div className="hidden lg:flex items-center gap-2">
              {userInfo.institution ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">{userInfo.institution}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">Federal Data Exchange System</span>
                </div>
              )}
            </div>
          </div>

          {/* User drop down menu & Refresh button */}
          <div className="flex items-center space-x-3.5">
            {/* Live Indicator Notification Dot */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
              onClick={() => router.push(userData.user.role.toLowerCase() === "admin" ? "/admin/notifications" : `/${userData.user.role.toLowerCase()}/notifications`)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
            >
              <RefreshCw
                className={`h-4.5 w-4.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
              />
            </Button>

            <div className="h-5 w-[1px] bg-gray-200" />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 focus:outline-none group text-left cursor-pointer">
                  <Avatar className="h-8.5 w-8.5 border border-gray-200 group-hover:border-gray-300 transition-colors shadow-xs">
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
                      {userInfo.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-gray-800 leading-none group-hover:text-blue-600 transition-colors">
                      {userInfo.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-none font-medium">
                      {roleDisplayName}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900">
                      {userInfo.name}
                    </p>
                    <p className="text-xs leading-none text-gray-400 truncate mt-0.5">
                      {userInfo.email}
                    </p>
                    <Badge variant="secondary" className="w-fit text-[10px] font-semibold mt-1.5 border-0">
                      {roleDisplayName}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getProfileUrl()} className="flex items-center w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 hover:text-red-700 focus:text-red-700 cursor-pointer"
                  onSelect={(event) => {
                    event.preventDefault();
                    handleLogout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Mobile Sidebar Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Mask layer overlay */}
            <div
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer layout */}
            <aside className="relative flex flex-col bg-white w-64 max-w-xs h-full shadow-2xl z-50">
              <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm font-bold text-sm">
                    DE
                  </div>
                  <span className="font-bold text-lg text-gray-900">DataExchange</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const IconComponent = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate flex-1">{item.name}</span>
                      {item.name === "Notifications" && unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white font-bold text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-100 space-y-2">
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-gray-200">
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
                      {userInfo.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {userInfo.name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {userInfo.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs font-semibold rounded-xl h-10 shadow-3xs"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </div>
            </aside>
          </div>
        )}

        {/* 3. Main body page scroll area */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-gray-50/50">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
