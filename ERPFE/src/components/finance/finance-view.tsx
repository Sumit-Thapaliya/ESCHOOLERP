"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  WalletCards,
  CreditCard,
  Banknote,
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Send,
  Printer,
  Download,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import {
  MOCK_STUDENT_FEE_PROFILES,
  MOCK_TRANSACTIONS,
  MOCK_FEE_STRUCTURES,
} from "./finance-mock-data";
import {
  StudentFeeProfile,
  FeeTransaction,
  FeeStructurePlan,
  PaymentMode,
} from "./finance-types";

function FinanceInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab") || "collection";
  const activeTab: "collection" | "structures" | "defaulters" | "transactions" =
    ["collection", "structures", "defaulters", "transactions"].includes(rawTab)
      ? (rawTab as any)
      : "collection";

  const [profiles, setProfiles] = React.useState<StudentFeeProfile[]>(MOCK_STUDENT_FEE_PROFILES);
  const [selectedStudentId, setSelectedStudentId] = React.useState("stu-01");
  const [transactions, setTransactions] = React.useState<FeeTransaction[]>(MOCK_TRANSACTIONS);
  const [isPayModalOpen, setIsPayModalOpen] = React.useState(false);
  const [payAmount, setPayAmount] = React.useState(9000);
  const [payMode, setPayMode] = React.useState<PaymentMode>("Online");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = React.useState<FeeTransaction | null>(null);

  const selectedProfile =
    profiles.find((p) => p.studentId === selectedStudentId) || profiles[0];

  const updateTab = (newTab: typeof activeTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(payAmount);
    if (amountNum <= 0) return;

    // Update profile dues
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.studentId !== selectedProfile.studentId) return p;
        const newPaid = p.paidAmount + amountNum;
        const newDue = Math.max(0, p.totalFee - newPaid);
        return {
          ...p,
          paidAmount: newPaid,
          dueAmount: newDue,
          status: newDue === 0 ? "Paid" : "Partially Paid",
        };
      })
    );

    // Create transaction
    const newTx: FeeTransaction = {
      id: `tx-${Date.now()}`,
      transactionRef: `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      studentId: selectedProfile.studentId,
      studentName: selectedProfile.studentName,
      grade: `${selectedProfile.grade} - ${selectedProfile.section}`,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      mode: payMode,
      amount: amountNum,
      status: "Paid",
      receiptNo: `REC-${Math.floor(8000 + Math.random() * 1000)}`,
    };

    setTransactions([newTx, ...transactions]);
    setIsPayModalOpen(false);
    setSelectedTransactionForReceipt(newTx);
    setToastMessage(
      `Payment of ₹ ${amountNum.toLocaleString()} received successfully for ${
        selectedProfile.studentName
      } (${newTx.receiptNo})`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSendReminder = (profile: StudentFeeProfile) => {
    setToastMessage(`SMS fee reminder dispatched to ${profile.guardianName} (${profile.guardianPhone}) for ₹ ${profile.dueAmount.toLocaleString()}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const defaulters = profiles.filter((p) => p.dueAmount > 0);

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
              Fee & Financial Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Fee collection desk, installments, dues tracking, and financial receipt accounting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Cash Desk: Active
            </span>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => updateTab("collection")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "collection"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Fee Collection
          </button>

          <button
            type="button"
            onClick={() => updateTab("structures")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "structures"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Banknote className="w-4 h-4" />
            Fee Structures
          </button>

          <button
            type="button"
            onClick={() => updateTab("defaulters")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "defaulters"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Outstanding Dues ({defaulters.length})
          </button>

          <button
            type="button"
            onClick={() => updateTab("transactions")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "transactions"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Receipt className="w-4 h-4" />
            Transaction History
          </button>
        </div>
      </div>

      {/* TAB 1: FEE COLLECTION (Exact replica of Page 7 Mockup page_6_8_img-001.png) */}
      {activeTab === "collection" && (
        <div className="space-y-5">
          {/* Main Card Container */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
            {/* Header: Title and Student Dropdown */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h2 className="text-xl font-bold text-[#0F243E]">Fee Collection</h2>
              </div>

              {/* Student Selector Dropdown (From Mockup) */}
              <div className="relative">
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    const prof = profiles.find((p) => p.studentId === e.target.value);
                    if (prof) setPayAmount(prof.dueAmount);
                  }}
                  className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs transition-colors cursor-pointer"
                >
                  {profiles.map((p) => (
                    <option key={p.studentId} value={p.studentId}>
                      {p.studentName} ({p.grade} - {p.section})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Two Column Section: Fee Details (Left) and Payment Status (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Column: Fee Details */}
              <div className="md:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Fee Details
                </h3>

                <div className="divide-y divide-slate-100 text-xs">
                  {selectedProfile.fees.map((f) => (
                    <div key={f.id} className="py-2.5 flex items-center justify-between">
                      <span className="font-medium text-slate-700">{f.name}</span>
                      <span className="font-mono font-semibold text-slate-900">
                        ₹ {f.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}

                  {/* Total Row */}
                  <div className="pt-3 flex items-center justify-between text-sm font-bold text-slate-900">
                    <span>Total</span>
                    <span className="font-mono text-base">
                      ₹ {selectedProfile.totalFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Status (From Mockup) */}
              <div className="md:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Payment Status
                  </h3>

                  <div className="space-y-2.5">
                    {/* Paid Box */}
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-800">Paid</span>
                      <span className="font-mono text-sm font-bold text-emerald-700">
                        ₹ {selectedProfile.paidAmount.toLocaleString()}
                      </span>
                    </div>

                    {/* Due Box */}
                    <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-xs font-semibold text-rose-800">Due</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-rose-700">
                        ₹ {selectedProfile.dueAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button: Pay Now (Matches mockup green pill button) */}
                <div className="pt-4">
                  <button
                    type="button"
                    disabled={selectedProfile.dueAmount === 0}
                    onClick={() => {
                      setPayAmount(selectedProfile.dueAmount);
                      setIsPayModalOpen(true);
                    }}
                    className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-xs transition-colors cursor-pointer ${
                      selectedProfile.dueAmount === 0
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
                    }`}
                  >
                    {selectedProfile.dueAmount === 0 ? "Fully Paid" : "Pay Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Card: Recent Transactions (From Mockup) */}
            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Recent Transactions
                </h3>
                <span className="text-xs text-slate-400">
                  Student ID: {selectedProfile.studentId}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold">
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Mode</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions
                      .filter((t) => t.studentId === selectedProfile.studentId)
                      .map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-mono text-slate-700">{tx.date}</td>
                          <td className="px-5 py-3 text-slate-700 font-medium">{tx.mode}</td>
                          <td className="px-5 py-3 font-mono font-bold text-slate-900">
                            ₹ {tx.amount.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FEE STRUCTURES */}
      {activeTab === "structures" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_FEE_STRUCTURES.map((fs) => (
              <div
                key={fs.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">{fs.grade}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                    {fs.academicYear}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Tuition Fee (Term):</span>
                    <strong className="text-slate-800">₹ {fs.tuitionFee.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Library & Reading Room:</span>
                    <strong className="text-slate-800">₹ {fs.libraryFee.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Science & Computer Lab:</span>
                    <strong className="text-slate-800">₹ {fs.labFee.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Examination Fee:</span>
                    <strong className="text-slate-800">₹ {fs.examFee.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport Fee:</span>
                    <strong className="text-slate-800">₹ {fs.transportFee.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-slate-900">
                  <span>Total Per Term:</span>
                  <span className="font-mono text-blue-600 text-sm">
                    ₹ {fs.totalPerTerm.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OUTSTANDING DUES & DEFAULTERS */}
      {activeTab === "defaulters" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Students with Pending Fee Dues ({defaulters.length})
              </h3>
              <span className="text-xs text-slate-500">
                Total Overdue:{" "}
                <strong className="text-rose-600 font-mono">
                  ₹ {defaulters.reduce((acc, cur) => acc + cur.dueAmount, 0).toLocaleString()}
                </strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-5 py-3.5">Student Details</th>
                    <th className="px-5 py-3.5">Grade</th>
                    <th className="px-5 py-3.5">Guardian & Phone</th>
                    <th className="px-5 py-3.5">Total Fee</th>
                    <th className="px-5 py-3.5">Paid</th>
                    <th className="px-5 py-3.5">Balance Due</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {defaulters.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{st.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{st.admissionNo}</div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">
                        {st.grade} - {st.section}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-slate-800">{st.guardianName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{st.guardianPhone}</div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-700">
                        ₹ {st.totalFee.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-emerald-700 font-semibold">
                        ₹ {st.paidAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-rose-700 font-bold">
                        ₹ {st.dueAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSendReminder(st)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Remind SMS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSACTION LOG */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                School Collection Records ({transactions.length})
              </h3>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Register
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="px-5 py-3.5">Receipt No</th>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Payment Mode</th>
                    <th className="px-5 py-3.5">Amount Paid</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Receipt Slip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{tx.receiptNo}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{tx.studentName}</div>
                        <div className="text-[11px] text-slate-400">{tx.grade}</div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">{tx.date}</td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium">{tx.mode}</td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                        ₹ {tx.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTransactionForReceipt(tx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          View Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pay Now Modal */}
      {isPayModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-md p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Record Fee Payment</h3>
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Paying For</label>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedProfile.studentName} ({selectedProfile.grade} - {selectedProfile.section})
                </div>
                <div className="text-slate-400 font-mono text-[11px]">{selectedProfile.admissionNo}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedProfile.dueAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Current total due: ₹ {selectedProfile.dueAmount.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Channel / Mode</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="Online">Online Payment Gateway</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Bank Transfer">Bank Direct Deposit / Cheque</option>
                  <option value="eSewa / Khalti">Digital Wallet (eSewa / Khalti)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-xs"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Official Fee Payment Receipt */}
      {selectedTransactionForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 text-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Official Cash / Bank Voucher
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTransactionForReceipt(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                SUNRISE SECONDARY ENGLISH BOARDING SCHOOL
              </h2>
              <p className="text-[11px] text-slate-600">
                Kathmandu Metropolitan City, Ward 31 &bull; PAN: 301928475
              </p>
              <div className="mt-2 inline-block bg-slate-900 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase">
                Fee Collection Receipt
              </div>
            </div>

            {/* Receipt Metadata */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Receipt No</span>
                <span className="font-mono font-bold text-blue-700 text-sm">{selectedTransactionForReceipt.receiptNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Issue Date</span>
                <span className="font-mono font-bold text-slate-900">{selectedTransactionForReceipt.date}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Student Name</span>
                <span className="font-bold text-slate-900">{selectedTransactionForReceipt.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Class / Grade</span>
                <span className="font-bold text-slate-900">{selectedTransactionForReceipt.grade}</span>
              </div>
            </div>

            {/* Particulars Table */}
            <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Particulars / Description</th>
                    <th className="py-2 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  <tr>
                    <td className="py-2 px-3">Tuition & Academic Term Fee</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      ₹ {Math.round(selectedTransactionForReceipt.amount * 0.75).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Library, Computer & Laboratory Dues</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      ₹ {Math.round(selectedTransactionForReceipt.amount * 0.25).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td className="py-2.5 px-3">Total Amount Paid</td>
                    <td className="py-2.5 px-3 text-right font-mono text-sm text-emerald-700">
                      ₹ {selectedTransactionForReceipt.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Details */}
            <div className="mt-3 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Payment Mode</span>
                <span className="font-semibold text-emerald-900">{selectedTransactionForReceipt.mode}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Transaction Reference</span>
                <span className="font-mono text-slate-700 text-[11px]">{selectedTransactionForReceipt.transactionRef}</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 text-center text-[11px] text-slate-600">
              <div className="border-t border-slate-300 pt-1">
                <span className="font-semibold text-slate-800 block">Cashier / Accountant</span>
                Finance Department
              </div>
              <div className="border-t border-slate-300 pt-1">
                <span className="font-semibold text-slate-800 block">Authorized School Stamp</span>
                Official Administration
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
              <button
                type="button"
                onClick={() => setSelectedTransactionForReceipt(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close Slip
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 inline-flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FinanceView() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
          Loading financial desk...
        </div>
      }
    >
      <FinanceInner />
    </React.Suspense>
  );
}
