"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  MessageSquareText,
  Pin,
  Calendar,
  Send,
  Plus,
  Eye,
  Paperclip,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Megaphone,
  Bell,
  Clock,
  X,
  Check,
} from "lucide-react";
import { MOCK_NOTICES, MOCK_BROADCASTS } from "./communication-mock-data";
import {
  NoticeItem,
  BroadcastLog,
  NoticeCategory,
  TargetAudience,
} from "./communication-types";

function CommunicationInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab") || "notices";
  const activeTab: "notices" | "broadcasts" | "compose" =
    ["notices", "broadcasts", "compose"].includes(rawTab)
      ? (rawTab as any)
      : "notices";

  const [notices, setNotices] = React.useState<NoticeItem[]>(MOCK_NOTICES);
  const [broadcasts, setBroadcasts] = React.useState<BroadcastLog[]>(MOCK_BROADCASTS);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isComposeModalOpen, setIsComposeModalOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // New Notice Form State
  const [newTitle, setNewTitle] = React.useState("");
  const [newContent, setNewContent] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<NoticeCategory>("Academic");
  const [newAudience, setNewAudience] = React.useState<TargetAudience>("All School");
  const [newIsPinned, setNewIsPinned] = React.useState(false);

  // Broadcast Form State
  const [bcastTitle, setBcastTitle] = React.useState("");
  const [bcastChannel, setBcastChannel] = React.useState<"SMS" | "App Push Notification">("SMS");
  const [bcastGroup, setBcastGroup] = React.useState("All Parents");
  const [bcastMessage, setBcastMessage] = React.useState("");

  const updateTab = (newTab: typeof activeTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const notice: NoticeItem = {
      id: `not-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      audience: newAudience,
      publishedBy: "School Administration Office",
      publishDate: new Date().toISOString().split("T")[0],
      isPinned: newIsPinned,
      viewsCount: 1,
    };

    setNotices([notice, ...notices]);
    setIsComposeModalOpen(false);
    setNewTitle("");
    setNewContent("");
    setToastMessage(`Notice "${notice.title}" published successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcastTitle.trim() || !bcastMessage.trim()) return;

    const bcast: BroadcastLog = {
      id: `bc-${Date.now()}`,
      campaignTitle: bcastTitle.trim(),
      channel: bcastChannel,
      targetGroup: bcastGroup,
      recipientCount: 120,
      sentDate: `${new Date().toISOString().split("T")[0]} 10:00 AM`,
      deliveredPct: 99,
      status: "Delivered",
    };

    setBroadcasts([bcast, ...broadcasts]);
    setBcastTitle("");
    setBcastMessage("");
    setToastMessage(`Broadcast "${bcast.campaignTitle}" sent to 120 recipients via ${bcast.channel}!`);
    setTimeout(() => setToastMessage(null), 5000);
    updateTab("broadcasts");
  };

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory !== "all" && n.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  const getCategoryColor = (cat: NoticeCategory) => {
    switch (cat) {
      case "Examination":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Holiday":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Sports":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Emergency":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Communication & Notifications
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Official school circulars, notice board feeds, SMS alerts, and app push broadcasts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsComposeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Compose Notice
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => updateTab("notices")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "notices"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Notice Board ({notices.length})
          </button>

          <button
            type="button"
            onClick={() => updateTab("compose")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "compose"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Send className="w-4 h-4" />
            Send SMS / Push Broadcast
          </button>

          <button
            type="button"
            onClick={() => updateTab("broadcasts")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "broadcasts"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Clock className="w-4 h-4" />
            Broadcast Delivery Logs
          </button>
        </div>
      </div>

      {/* TAB 1: NOTICES FEED */}
      {activeTab === "notices" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {["all", "Academic", "Examination", "Holiday", "Sports"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search circulars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notices Cards Grid */}
          <div className="space-y-3">
            {filteredNotices.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      {n.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                          <Pin className="w-3 h-3 rotate-45" />
                          Pinned
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(
                          n.category
                        )}`}
                      >
                        {n.category}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Audience: <strong className="text-slate-700">{n.audience}</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 pt-1">{n.title}</h3>
                  </div>

                  <span className="text-xs font-mono text-slate-400 shrink-0">
                    {n.publishDate}
                  </span>
                </div>

                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">{n.content}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">
                    Issued by: <strong className="text-slate-700">{n.publishedBy}</strong>
                  </span>

                  <div className="flex items-center gap-3">
                    {n.hasAttachment && (
                      <span className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline cursor-pointer">
                        <Paperclip className="w-3.5 h-3.5" />
                        {n.attachmentName}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {n.viewsCount} reads
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SEND BROADCAST */}
      {activeTab === "compose" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Broadcast SMS or Mobile Push</h2>
            <p className="text-xs text-slate-500">Dispatch instant notifications to parents and guardians</p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campaign Title</label>
              <input
                type="text"
                required
                value={bcastTitle}
                onChange={(e) => setBcastTitle(e.target.value)}
                placeholder="e.g. Sports Day Uniform Notice"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dispatch Channel</label>
                <select
                  value={bcastChannel}
                  onChange={(e) => setBcastChannel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="SMS">SMS Gateway (Telecom)</option>
                  <option value="App Push Notification">Parent Mobile App Push</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Recipient Group</label>
                <select
                  value={bcastGroup}
                  onChange={(e) => setBcastGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="All Parents">All Enrolled Parents (1,240)</option>
                  <option value="Grade 8 Parents">Grade 8 Parents (85)</option>
                  <option value="Grade 10 Parents">Grade 10 Parents (80)</option>
                  <option value="All Faculty & Staff">All Faculty & Staff (48)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message Content (Max 160 chars for SMS)</label>
              <textarea
                required
                rows={4}
                value={bcastMessage}
                onChange={(e) => setBcastMessage(e.target.value)}
                placeholder="Type your official announcement here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="text-right text-[11px] text-slate-400 mt-1">
                {bcastMessage.length} characters (1 SMS credit)
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Send Broadcast Now
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: BROADCAST LOGS */}
      {activeTab === "broadcasts" && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Broadcast Dispatch History</h3>
            <span className="text-xs text-slate-400">Gateway Status: Operational</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3.5">Campaign Title</th>
                  <th className="px-5 py-3.5">Channel</th>
                  <th className="px-5 py-3.5">Recipients</th>
                  <th className="px-5 py-3.5">Sent Timestamp</th>
                  <th className="px-5 py-3.5 text-center">Delivery Rate</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {broadcasts.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{b.campaignTitle}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">{b.channel}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {b.targetGroup} ({b.recipientCount})
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">{b.sentDate}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-emerald-700">
                      {b.deliveredPct}%
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compose Notice Modal */}
      {isComposeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-lg p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Publish School Circular</h3>
              <button
                type="button"
                onClick={() => setIsComposeModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Circular / Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Exhibition Registration"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Sports">Sports</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="All School">All School</option>
                    <option value="All Parents">All Parents</option>
                    <option value="All Teachers">All Teachers</option>
                    <option value="Grade 8 - A">Grade 8 - A</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Description / Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed notification content for students and guardians..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin-check"
                  checked={newIsPinned}
                  onChange={(e) => setNewIsPinned(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 cursor-pointer"
                />
                <label htmlFor="pin-check" className="text-slate-700 font-medium cursor-pointer">
                  Pin to top of school board
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposeModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function CommunicationView() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
          Loading communications...
        </div>
      }
    >
      <CommunicationInner />
    </React.Suspense>
  );
}
