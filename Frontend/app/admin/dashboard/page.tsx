"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  FileText,
  Users,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Database,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import axios from "axios";

interface Institution {
  id: number;
  name: string;
  status: string;
  approved: number;
}

function DashboardContent() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<string>("Loading...");
  const [usersChange, setUsersChange] = useState<string>("");

  const [institutionStats, setInstitutionStats] = useState({
    total: "Loading...",
    change: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const institutionsRes = await axios.get(
          "http://localhost:5000/api/admin/institutions",
          {
            withCredentials: true,
          }
        );

        console.log("Institutions API response:", institutionsRes.data);

        const institutionsData =
          institutionsRes.data.institutions || institutionsRes.data;

        if (Array.isArray(institutionsData)) {
          setInstitutions(institutionsData);
        } else {
          setInstitutions([]);
          console.warn("Institutions data is not an array", institutionsData);
        }

        setInstitutionStats({
          total: institutionsRes.data.total?.toString() || "0",
          change: institutionsRes.data.change || "",
        });

        const usersRes = await axios.get(
          "http://localhost:5000/api/admin/user-stats",
          {
            withCredentials: true,
          }
        );

        setTotalUsers(usersRes.data.totalUsers?.toString() || "0");
        setUsersChange(usersRes.data.change || "");
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setTotalUsers("Error");
        setUsersChange("");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeCount = institutions.filter(
    (i) => i.status?.toLowerCase() === "active"
  ).length;

  const pendingCount = institutions.filter(
    (i) => i.status?.trim().toLowerCase() === "pending"
  ).length;

  const suspendedCount = institutions.filter(
    (i) => i.status?.toLowerCase() === "suspended"
  ).length;

  const [activeTab, setActiveTab] = useState("institutions");
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5000/api/admin/institutions", {
          withCredentials: true,
        });
      } catch (error) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  const stats = [
    {
      title: "Registered Institutions",
      value: institutionStats.total,
      change: institutionStats.change || "+2 this week",
      icon: Building2,
      color: "bg-blue-500/10 border-blue-500/20",
      iconColor: "text-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      glowColor: "shadow-blue-500/10",
    },
    {
      title: "Active API Requests",
      value: "156",
      change: "+12 this Month",
      icon: FileText,
      color: "bg-indigo-500/10 border-indigo-500/20",
      iconColor: "text-indigo-500",
      textColor: "text-indigo-600 dark:text-indigo-400",
      glowColor: "shadow-indigo-500/10",
    },
    {
      title: "Pending Approvals",
      value: pendingCount.toString(),
      change: `${pendingCount} awaiting action`,
      icon: Clock,
      color: "bg-amber-500/10 border-amber-500/20",
      iconColor: "text-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      glowColor: "shadow-amber-500/10",
    },
    {
      title: "Total Registered Users",
      value: totalUsers,
      change: usersChange || "+5 new signups",
      icon: Users,
      color: "bg-purple-500/10 border-purple-500/20",
      iconColor: "text-purple-500",
      textColor: "text-purple-600 dark:text-purple-400",
      glowColor: "shadow-purple-500/10",
    },
  ];

  const recentActivities = [
    {
      type: "registration",
      title: "New institution registered",
      time: "2 min ago",
      details: {
        institution: "FinTech Solutions Ltd",
        registrationId: "REG-2024-009",
        contactPerson: "Alice Johnson",
        email: "alice.johnson@fintech.com",
        type: "Financial Technology",
        status: "Pending Approval",
        submittedDocuments: [
          "Business License",
          "Tax Certificate",
          "Compliance Report",
        ],
        nextSteps: "Awaiting document verification and compliance review",
      },
    },
    {
      type: "request",
      title: "Data request completed",
      time: "5 min ago",
      details: {
        requestId: "REQ-2024-006",
        consumer: "TechCorp Ltd",
        provider: "DataBank Solutions",
        dataType: "Customer Credit Scores",
        recordsProcessed: 1247,
        processingTime: "3 minutes 45 seconds",
        dataSize: "1.8 MB",
        status: "Successfully Completed",
        focalPerson: "John Smith",
      },
    },
    {
      type: "failure",
      title: "Request failed",
      time: "15 min ago",
      details: {
        requestId: "REQ-2024-007",
        consumer: "FinancePlus",
        provider: "RiskAssess Corp",
        dataType: "Risk Assessment for Mortgage Applications",
        failureReason: "Insufficient data provided",
        missingItems: ["Customer consent forms", "Income verification"],
        status: "Failed",
        focalPerson: "Sarah Johnson",
        nextSteps: "Consumer needs to resubmit with required documentation",
      },
    },
    {
      type: "user",
      title: "Admin user logged in",
      time: "1 hour ago",
      details: {
        userId: "admin@system.com",
        userName: "System Administrator",
        loginTime: "2024-01-15 15:30:00",
        ipAddress: "192.168.1.100",
        userAgent: "Chrome 120.0.0.0 on Windows 10",
        sessionDuration: "Active (45 minutes)",
        actionsPerformed: [
          "Viewed dashboard",
          "Checked notifications",
          "Reviewed requests",
        ],
        lastActivity: "Viewing system activity",
      },
    },
  ];

  return (
    <main className="px-8 py-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Admin Overview
            </h1>
            <Badge className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md px-2.5 py-0.5 text-xs shadow-sm">
              Administrator Access
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            Control, audit, and analyze the Inter-Institutional Data Exchange ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/admin/institutions")}
            variant="outline"
            className="rounded-lg shadow-sm font-medium hover:bg-gray-100"
          >
            Manage Institutions
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`bg-white border border-gray-200/80 shadow-sm rounded-2xl hover:shadow-md hover:border-gray-300 transition-all duration-300 ${stat.glowColor}`}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.color} border`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 rounded-md font-medium text-xs px-2 py-0.5 flex items-center gap-1 border border-gray-200/50"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Live
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <p className={`text-xs font-medium ${stat.textColor}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-gray-200 pb-2">
          <TabsList className="bg-gray-100/80 p-1 rounded-xl border border-gray-200/60 inline-flex">
            <TabsTrigger
              value="institutions"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              <Building2 className="w-4 h-4" />
              <span>Institutions</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              <Activity className="w-4 h-4" />
              <span>System Activity</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Institutions Tab */}
        <TabsContent value="institutions" className="outline-none space-y-6">
          <Card className="border border-gray-200/80 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    Institution Directory
                  </CardTitle>
                  <CardDescription className="text-gray-500 text-sm">
                    Overview and fast verification actions for registered institutions.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-white">
              {/* Institution Sub-Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 bg-emerald-500/[0.04] rounded-2xl border border-emerald-500/10 flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 border border-emerald-500/20">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                      Active
                    </p>
                    <p className="text-2xl font-bold text-emerald-950">
                      {activeCount}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-amber-500/[0.04] rounded-2xl border border-amber-500/10 flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 border border-amber-500/20">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Awaiting Action
                    </p>
                    <p className="text-2xl font-bold text-amber-950">
                      {pendingCount}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-rose-500/[0.04] rounded-2xl border border-rose-500/10 flex items-center gap-4">
                  <div className="p-3 bg-rose-500/10 rounded-xl text-rose-600 border border-rose-500/20">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                      Suspended
                    </p>
                    <p className="text-2xl font-bold text-rose-950">
                      {suspendedCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Institutions List Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-150">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-100">
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Institution ID
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Name
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Approved Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {institutions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Database className="w-8 h-8 text-gray-300" />
                            <p>No registered institutions found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      institutions.map((inst) => (
                        <tr
                          key={inst.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                            #{inst.id}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {inst.name}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                inst.status?.toLowerCase() === "active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : inst.status?.toLowerCase() === "pending"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  inst.status?.toLowerCase() === "active"
                                    ? "bg-emerald-500"
                                    : inst.status?.toLowerCase() === "pending"
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                                }`}
                              />
                              {inst.status || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {inst.approved === 1 ? (
                              <Badge className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold border-emerald-300 rounded-md">
                                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold border-amber-300 rounded-md">
                                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                                Unverified
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="outline-none space-y-6">
          <Card className="border border-gray-200/80 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-100 p-6">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-500" />
                Live Security & Audit Logs
              </CardTitle>
              <CardDescription className="text-gray-500 text-sm">
                Trace real-time network transfers, registrations, failures, and access audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity List Panel */}
                <div className="lg:col-span-1 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Recent Events
                  </p>
                  <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                    {recentActivities.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedActivity(act)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedActivity === act
                            ? "border-blue-500 bg-blue-500/[0.03] shadow-sm"
                            : "border-gray-200 hover:bg-gray-50/80"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">
                            {act.title}
                          </p>
                          <Badge
                            className={`rounded-md font-semibold text-[10px] uppercase tracking-wider px-1.5 py-0.5 flex-shrink-0 ${
                              act.type === "registration"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : act.type === "request"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : act.type === "failure"
                                    ? "bg-rose-100 text-rose-800 border-rose-200"
                                    : "bg-blue-100 text-blue-800 border-blue-200"
                            }`}
                          >
                            {act.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">
                          {act.time}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details Viewer Panel */}
                <div className="lg:col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Audit Detail View
                  </p>
                  {selectedActivity && selectedActivity.details ? (
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-5">
                      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600">
                          <Info className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">
                            {selectedActivity.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium">
                            Status: <span className="font-semibold text-gray-600">{selectedActivity.details.status || "Completed"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(selectedActivity.details).map(
                          ([key, value]) => {
                            if (key === "status" || key === "submittedDocuments") return null;
                            return (
                              <div
                                key={key}
                                className="bg-white p-3.5 rounded-xl border border-gray-200/60 shadow-2xs"
                              >
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (s) => s.toUpperCase())}
                                </span>
                                <span className="text-sm font-semibold text-gray-800 break-words">
                                  {String(value)}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* Render Documents if registration type */}
                      {selectedActivity.details.submittedDocuments && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200/60 space-y-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            Submitted Documents
                          </span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {selectedActivity.details.submittedDocuments.map(
                              (doc: string, dIdx: number) => (
                                <Badge
                                  key={dIdx}
                                  variant="outline"
                                  className="bg-gray-50 border-gray-200 text-gray-700 text-xs font-semibold py-1 px-2.5 rounded-md"
                                >
                                  {doc}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-12 rounded-2xl text-center border border-dashed border-gray-300/80 flex flex-col items-center justify-center min-h-[300px]">
                      <Activity className="w-12 h-12 text-gray-450 mb-3 stroke-[1.5]" />
                      <p className="font-bold text-gray-700 text-base mb-1">
                        No Event Selected
                      </p>
                      <p className="text-gray-400 text-xs max-w-xs leading-normal">
                        Select an event from the left panel to review compliance, focal points, and security payloads.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading Dashboard...</div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
