"use client";

import * as React from "react";
import { Sliders, X, Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

export interface DashboardWidgetsState {
  quickActions: boolean;
  kpis: boolean;
  analytics: boolean;
  branchComparison: boolean;
  notifications: boolean;
}

interface CustomizeDashboardModalProps {
  open: boolean;
  onClose: () => void;
  widgets: DashboardWidgetsState;
  onUpdateWidgets: (next: DashboardWidgetsState) => void;
}

export function CustomizeDashboardModal({
  open,
  onClose,
  widgets,
  onUpdateWidgets,
}: CustomizeDashboardModalProps) {
  const [localState, setLocalState] = React.useState<DashboardWidgetsState>(widgets);

  React.useEffect(() => {
    setLocalState(widgets);
  }, [widgets, open]);

  if (!open) return null;

  const toggle = (key: keyof DashboardWidgetsState) => {
    setLocalState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onUpdateWidgets(localState);
    toast.success("Dashboard layout saved to your profile");
    onClose();
  };

  const WIDGET_OPTIONS: {
    key: keyof DashboardWidgetsState;
    title: string;
    description: string;
  }[] = [
    {
      key: "quickActions",
      title: "Quick actions bar",
      description: "Shortcuts for admission, fee counter, attendance register, and notices",
    },
    {
      key: "kpis",
      title: "KPI summary metric cards",
      description: "5 high-level cards tracking students, staff on duty, attendance %, fees MTD, and pending tasks",
    },
    {
      key: "analytics",
      title: "Visual trend charts",
      description: "30-day attendance line chart and categorized fee collection progress",
    },
    {
      key: "branchComparison",
      title: "Multi-branch campus comparison",
      description: "Cross-campus table comparing Kathmandu, Lalitpur, and Pokhara with sparklines",
    },
    {
      key: "notifications",
      title: "Exceptions & activity log",
      description: "Grouped reminder flags for dues and approvals plus real-time administrative feed",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2570D3]/10 text-[#2570D3]">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                Customize dashboard layout
              </h3>
              <p className="text-xs text-slate-500">
                Show, hide, or arrange operational widgets
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {WIDGET_OPTIONS.map((item) => {
            const isVisible = localState[item.key];

            return (
              <div
                key={item.key}
                onClick={() => toggle(item.key)}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-xl border p-3 cursor-pointer transition-colors",
                  isVisible
                    ? "border-[#2570D3]/30 bg-[#2570D3]/5"
                    : "border-slate-200 bg-slate-50/50 opacity-60"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-xs text-slate-900">
                      {item.title}
                    </p>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.2 text-[10px] font-medium",
                        isVisible
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      )}
                    >
                      {isVisible ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="shrink-0 pt-0.5">
                  {isVisible ? (
                    <Eye className="h-4 w-4 text-[#2570D3]" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#2570D3] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1C5BB0]"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
