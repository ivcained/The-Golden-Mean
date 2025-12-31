/**
 * Timer View Component
 * 
 * Main sobriety tracking interface displaying real-time progress
 * and accumulated benefits.
 * 
 * Features:
 * - Real-time countdown display (days/hours/minutes/seconds)
 * - Summary tab with progress stats
 * - Savings tab with financial calculations
 * - Daily cost editing
 * - Reset functionality
 * - Community access button
 */

"use client";

import React from "react";

interface AddictionData {
  id?: string;
  startDate: string;
  startTime: string;
  addiction: string;
  customAddiction: string;
  dailyCost: number;
  motivation?: string;
  pledgeDate?: string;
  walletAddress?: string;
  authStrategy?: string;
  isActive?: boolean;
}

interface TimerViewProps {
  addiction: string;
  startDate: string;
  timerDisplay: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  activeTab: "summary" | "savings";
  setActiveTab: (tab: "summary" | "savings") => void;
  dailyCost: number;
  isEditingCost: boolean;
  tempCost: string;
  setTempCost: (val: string) => void;
  setIsEditingCost: (val: boolean) => void;
  handleCostUpdate: () => void;
  handleReset: () => void;
  onOpenCommunity: () => void;
  allAddictions: AddictionData[];
  currentAddictionId?: string;
  onSwitchAddiction: (id: string) => void;
  onAddNewAddiction: () => void;
}

export default function TimerView({
  addiction,
  startDate,
  timerDisplay,
  activeTab,
  setActiveTab,
  dailyCost,
  isEditingCost,
  tempCost,
  setTempCost,
  setIsEditingCost,
  handleCostUpdate,
  handleReset,
  onOpenCommunity,
  allAddictions,
  currentAddictionId,
  onSwitchAddiction,
  onAddNewAddiction,
}: TimerViewProps) {
  const [showAddictionMenu, setShowAddictionMenu] = React.useState(false);
  
  const totalDays = timerDisplay.days + timerDisplay.hours / 24;
  const currentSavings = totalDays * dailyCost;
  const projectedMonthlySavings = dailyCost * 30.44;
  const projectedYearlySavings = dailyCost * 365;
  const projected5YearSavings = dailyCost * 365 * 5;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);
  const getTwentyDollarBills = (n: number) => Math.floor(n / 20);

  const getMotivationalMessage = () => {
    if (projectedYearlySavings >= 5000)
      return "You're saving enough for an amazing vacation every year!";
    if (projectedYearlySavings >= 2000)
      return "You're saving enough to buy a new smartphone every year!";
    if (projectedYearlySavings >= 1000)
      return "You're saving enough for a nice weekend getaway every year!";
    if (projectedYearlySavings >= 500)
      return "You're building healthy savings habits!";
    return "Every bit saved is a step toward a healthier, wealthier you!";
  };

  const getMilestone = () => {
    if (timerDisplay.days >= 21) return "3 Weeks";
    if (timerDisplay.days >= 14) return "2 Weeks";
    if (timerDisplay.days >= 7) return "1 Week";
    if (timerDisplay.days >= 1)
      return `${timerDisplay.days} Day${timerDisplay.days > 1 ? "s" : ""}`;
    return "Just Started";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="w-full max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="w-8" /> {/* Empty spacer for alignment */}
          <div className="flex items-center gap-2 relative">
            <span className="text-lg text-slate-400">»</span>
            <button
              onClick={() => setShowAddictionMenu(!showAddictionMenu)}
              className="font-semibold text-white hover:text-cyan-400 flex items-center gap-1"
            >
              {addiction}
              {allAddictions.length > 1 && (
                <span className="text-sm">▼</span>
              )}
            </button>
            
            {/* Addiction dropdown menu */}
            {showAddictionMenu && allAddictions.length > 0 && (
              <div className="absolute top-full mt-2 right-0 bg-slate-800 rounded-xl shadow-lg border border-slate-700 py-2 z-10 min-w-[200px]">
                {allAddictions.map((add) => (
                  <button
                    key={add.id}
                    onClick={() => {
                      if (add.id) onSwitchAddiction(add.id);
                      setShowAddictionMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center justify-between ${
                      add.id === currentAddictionId ? "text-cyan-400" : "text-white"
                    }`}
                  >
                    <span>{add.addiction}</span>
                    {add.id === currentAddictionId && <span>✓</span>}
                  </button>
                ))}
                <div className="border-t border-slate-700 mt-2 pt-2">
                  <button
                    onClick={() => {
                      onAddNewAddiction();
                      setShowAddictionMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-700 text-cyan-400"
                  >
                    + Add Another Addiction
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="w-8" />
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === "summary"
                ? "bg-cyan-500 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab("savings")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === "savings"
                ? "bg-cyan-500 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            Savings
          </button>
          <button
            onClick={onOpenCommunity}
            className="px-4 py-2 rounded-full text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600"
          >
            Community
          </button>
        </div>

        {activeTab === "summary" && (
          <div>
            <div className="text-center mb-6">
              <p className="text-slate-400 mb-6">
                I&apos;ve been {addiction.toLowerCase()} free for
              </p>
              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="6"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="62"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="5"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#g1)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${
                      (timerDisplay.hours / 24) * 565.5
                    } 565.5`}
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="url(#g2)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${
                      (timerDisplay.minutes / 60) * 471.2
                    } 471.2`}
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="62"
                    fill="none"
                    stroke="url(#g3)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${
                      (timerDisplay.seconds / 60) * 389.6
                    } 389.6`}
                    transform="rotate(-90 100 100)"
                  />
                  <defs>
                    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-slate-900 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-cyan-400">
                      {timerDisplay.days}
                    </span>
                    <span className="text-cyan-400 text-sm">days</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <span className="text-3xl font-bold text-cyan-500">
                    {timerDisplay.hours}
                  </span>
                  <p className="text-slate-400 text-sm">hours</p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-cyan-500">
                    {timerDisplay.minutes}
                  </span>
                  <p className="text-slate-400 text-sm">minutes</p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-cyan-500">
                    {timerDisplay.seconds}
                  </span>
                  <p className="text-slate-400 text-sm">seconds</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Last milestone</h3>
              <div className="flex items-center gap-3 p-3 bg-slate-600/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400">🏆</span>
                </div>
                <div>
                  <p className="font-medium text-white">{getMilestone()}</p>
                  <p className="text-sm text-slate-400">
                    Started:{" "}
                    {new Date(startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "savings" && (
          <div>
            <div className="mb-6">
              <p className="text-slate-400 text-sm mb-2">Current savings</p>
              <h2 className="text-4xl font-bold text-white mb-1">
                {formatCurrency(currentSavings)}
              </h2>
              <p className="text-slate-500 text-sm">
                (or {getTwentyDollarBills(currentSavings)} twenty-dollar bills)
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i < Math.min(10, Math.floor(currentSavings / 20))
                        ? "bg-gradient-to-r from-green-400 to-cyan-400"
                        : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="border-t border-slate-700 py-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Days since start date</span>
                <span className="text-white font-semibold">
                  {timerDisplay.days} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Money spent per day</span>
                {isEditingCost ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={tempCost}
                      onChange={(e) => setTempCost(e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-700 text-white rounded text-right"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleCostUpdate()}
                    />
                    <button
                      onClick={handleCostUpdate}
                      className="text-cyan-400"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setTempCost(dailyCost.toString());
                      setIsEditingCost(true);
                    }}
                    className="text-cyan-400 font-semibold"
                  >
                    {formatCurrency(dailyCost)} ✎
                  </button>
                )}
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-white mb-4">
                Projected savings
              </h3>
              <div className="space-y-3 border-t border-slate-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly</span>
                  <span className="text-cyan-400 font-semibold">
                    {formatCurrency(projectedMonthlySavings)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-3">
                  <span className="text-slate-400">Yearly</span>
                  <span className="text-cyan-400 font-semibold">
                    {formatCurrency(projectedYearlySavings)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-3">
                  <span className="text-slate-400">5 Years</span>
                  <span className="text-cyan-400 font-semibold">
                    {formatCurrency(projected5YearSavings)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
              <p className="text-cyan-300 text-sm">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
