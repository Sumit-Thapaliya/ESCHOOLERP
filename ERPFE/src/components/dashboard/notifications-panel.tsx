"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Check,
  Filter,
  User,
  History,
} from "lucide-react";
import { MOCK_ALERTS, MOCK_ACTIVITY } from "./dashboard-mock-data";
import type { ExceptionAlert } from "./dashboard-types";
import { toast } from "sonner";
import { cn } from "cn";

export function NotificationsPanel() {
  const [alerts, setAlerts] = React.useState<ExceptionAlert[]>(MOCK_ALERTS);
  const [activeCategory, setActiveCategory] = React.useState<
    "all" | "finance" | "attendance" | "approvals"
  >("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (activeCategory === "all") return true;
    return alert.category === activeCategory;
  });

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
    toast.success("Exception marked as reviewed");
  };

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    toast.success("All alerts marked as read");
  };

  const getSeverityBadge = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "bg-rose-50 text-[#D64545] border-rose-200";
      case "medium":
        return "bg-amber-50 text-[#E69A2E] border-amber-200";
      case "low":
      default:
        return "bg-blue-50 text-[#2570D3] border-blue-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Exceptions & Alerts Panel (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-[#DDE5F0] bg-white p-5 shadow-2xs">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900">
                  Exceptions & administrative alerts
                </h3>
                <span className="rounded-full bg-[#D64545]/10 px-2 py-0.5 text-[10px] font-bold text-[#D64545]">
                  {alerts.filter((a) => !a.isRead).length} pending
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Actionable flags requiring executive intervention or escalation
              </p>
            </div>

            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer self-start sm:self-auto"
            >
              Mark all reviewed
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                activeCategory === "all"
                  ? "bg-[#12294D] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              All alerts ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("finance")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                activeCategory === "finance"
                  ? "bg-[#12294D] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Finance ({alerts.filter((a) => a.category === "finance").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("attendance")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                activeCategory === "attendance"
                  ? "bg-[#12294D] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Attendance ({alerts.filter((a) => a.category === "attendance").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("approvals")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                activeCategory === "approvals"
                  ? "bg-[#12294D] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Approvals ({alerts.filter((a) => a.category === "approvals").length})
            </button>
          </div>

          {/* Alert List */}
          <div className="mt-4 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No exceptions in this category. All systems are operational.
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3.5 transition-all",
                    alert.isRead
                      ? "border-slate-100 bg-slate-50/50 opacity-70"
                      : "border-slate-200 bg-white shadow-2xs hover:border-slate-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <span
                        className={cn(
                          "flex h-2 w-2 rounded-full",
                          alert.isRead
                            ? "bg-slate-300"
                            : alert.severity === "high"
                            ? "bg-[#D64545]"
                            : alert.severity === "medium"
                            ? "bg-[#E69A2E]"
                            : "bg-[#2570D3]"
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">
                          {alert.title}
                        </span>
                        <span
                          className={cn(
                            "rounded border px-1.5 py-0.2 text-[10px] font-medium uppercase",
                            getSeverityBadge(alert.severity)
                          )}
                        >
                          {alert.severity} priority
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!alert.isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(alert.id)}
                        className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {alert.actionLabel && (
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(`Opening ${alert.actionLabel} for ${alert.recordId}`)
                        }
                        className="inline-flex items-center gap-1 rounded-md bg-[#2570D3] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#1C5BB0] transition-colors"
                      >
                        <span>{alert.actionLabel}</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with SMS & WhatsApp gateway logs</span>
          <span>Automatic refresh: 60s</span>
        </div>
      </div>

      {/* 2. Recent Administrative Activity Feed (5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-[#DDE5F0] bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                Recent administrative activity
              </h3>
              <p className="text-xs text-slate-500">
                Audit stream of ledger entries, approvals and records
              </p>
            </div>
            <History className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {MOCK_ACTIVITY.map((item) => (
              <div key={item.id} className="py-3 flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  {item.user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <p className="text-xs text-slate-800">
                      <strong className="font-semibold">{item.user.name}</strong>{" "}
                      <span className="text-slate-500">({item.user.role})</span>
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {item.action}{" "}
                    <span className="font-medium text-slate-800">
                      {item.target}
                    </span>
                  </p>
                  {item.badge && (
                    <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-right">
          <button
            type="button"
            onClick={() => toast.info("Opening full institutional audit trail")}
            className="text-xs font-medium text-[#2570D3] hover:underline"
          >
            View complete audit trail →
          </button>
        </div>
      </div>
    </div>
  );
}
