/**
 * Pledge View Component
 * 
 * The initial commitment screen where users make their pledge to start
 * their recovery journey. Captures motivation and optional wallet connection
 * for additional features.
 * 
 * Features:
 * - Motivation text capture
 * - Optional Web3 wallet authentication
 * - Support for multiple auth strategies (Farcaster, Google, Email)
 * - Visual commitment ceremony
 */

"use client";

import React, { useState } from "react";
import WalletLogin from "~/components/wallet/WalletLogin";
import { useFrameContext } from "~/components/providers/FrameProvider";

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface MiniAppContext {
  user?: FarcasterUser;
}

interface PledgeViewProps {
  onPledgeConfirmed: (motivation: string, walletAddress?: string) => void;
  onClose: () => void;
}

const pledgeOptions = [
  {
    id: "stay-sober",
    text: "Today, I will stay sober",
    emoji: "🌟",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "quit",
    text: "Today, I will quit",
    emoji: "🚀",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "change",
    text: "Today, I will change",
    emoji: "✨",
    color: "from-green-500 to-teal-500",
  },
  {
    id: "recover",
    text: "Today, I will recover",
    emoji: "💪",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "transform",
    text: "Today, I will transform",
    emoji: "🦋",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "begin",
    text: "Today, I begin again",
    emoji: "🌅",
    color: "from-amber-500 to-orange-500",
  },
];

const motivationOptions = [
  {
    id: "kids",
    text: "For my kids to have a present father.",
    type: "image",
    bgColor: "bg-gradient-to-b from-amber-100 to-green-100",
    textColor: "text-slate-900",
  },
  {
    id: "family",
    text: "I want my family to respect me.",
    type: "text",
    bgColor: "bg-indigo-400",
    textColor: "text-white",
  },
  {
    id: "hangovers",
    text: "No more hangovers! 💪",
    type: "text",
    bgColor: "bg-emerald-400",
    textColor: "text-white",
  },
  {
    id: "partner",
    text: "To rebuild trust with my partner.",
    type: "image",
    bgColor: "bg-gradient-to-b from-slate-600 to-slate-700",
  },
  {
    id: "health",
    text: "Physical health & fitness",
    type: "image",
    bgColor: "bg-gradient-to-b from-green-200 to-green-300",
  },
  {
    id: "better",
    text: "I feel so much better",
    type: "text",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-600",
  },
  {
    id: "money",
    text: "Save money for things I love",
    type: "text",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  {
    id: "mental",
    text: "Better mental clarity",
    type: "text",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
];

const getDayName = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date().getDay()];
};

type PledgeStep = "login" | "pledge";

export default function PledgeView({
  onPledgeConfirmed,
  onClose,
}: PledgeViewProps) {
  const frameContext = useFrameContext();
  const [step, setStep] = useState<PledgeStep>("login");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [authStrategy, setAuthStrategy] = useState<string | null>(null);
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  const [selectedPledge, setSelectedPledge] = useState<string | null>(null);

  // Extract Farcaster user from frame context
  const isInMiniApp = frameContext?.isInMiniApp ?? false;
  const farcasterUser = isInMiniApp
    ? (frameContext?.context as MiniAppContext)?.user ?? null
    : null;

  const handleWalletConnected = (address: string, strategy: string) => {
    setWalletAddress(address);
    setAuthStrategy(strategy);
    // Save to localStorage for persistence
    localStorage.setItem("walletAddress", address);
    localStorage.setItem("authStrategy", strategy);
    // Move to pledge step
    setStep("pledge");
  };

  const handleSkipLogin = () => {
    setStep("pledge");
  };

  const toggleMotivation = (id: string) => {
    setSelectedMotivations((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleConfirmPledge = () => {
    if (selectedMotivations.length > 0 && selectedPledge) {
      const pledge = pledgeOptions.find((p) => p.id === selectedPledge);
      if (!pledge) return; // Safety check - should never happen since button is disabled
      
      const motivationTexts = selectedMotivations
        .map((id) => motivationOptions.find((m) => m.id === id)?.text)
        .filter(Boolean)
        .join(", ");
      const fullMotivation = `${pledge.text}. ${motivationTexts}`;
      onPledgeConfirmed(fullMotivation, walletAddress || undefined);
    }
  };

  // Login Step
  if (step === "login") {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
            <button onClick={onClose} className="text-slate-600 text-2xl">
              ✕
            </button>
            <h1 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
              Welcome
            </h1>
            <div className="w-8" />
          </div>

          {/* Logo/Branding */}
          <div className="px-6 py-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">🌟</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Sober Timer
            </h1>
            <p className="text-slate-700">
              Track your journey to a healthier life
            </p>
          </div>

          {/* Wallet Login */}
          <div className="px-6 pb-8">
            <WalletLogin
              onConnected={handleWalletConnected}
              onSkip={handleSkipLogin}
              farcasterUser={farcasterUser}
              isInMiniApp={isInMiniApp}
            />
          </div>

          {/* Features Preview */}
          <div className="px-6 pb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <div className="text-2xl mb-1">⏱️</div>
                <p className="text-xs text-slate-700">Track Time</p>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-1">💰</div>
                <p className="text-xs text-slate-700">Save Money</p>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-1">👥</div>
                <p className="text-xs text-slate-700">Community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pledge Step
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <div className="w-8" />
          <h1 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
            Pledge for {getDayName()}
          </h1>
          <div className="w-8">
            {walletAddress && (
              <div
                className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                title={`Connected: ${walletAddress}`}
              >
                <span className="text-green-600 text-xs">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Connected Wallet Badge */}
        {walletAddress && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Connected via {authStrategy}</span>
              <span className="font-mono text-xs text-slate-500">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          </div>
        )}

        <div className="px-4 py-6">
          {/* Pledge Options Grid */}
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Make Your Pledge
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {pledgeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedPledge(option.id)}
                className={`relative p-4 rounded-2xl transition-all ${
                  selectedPledge === option.id
                    ? `bg-gradient-to-r ${option.color} shadow-lg ring-4 ring-offset-2 ring-slate-200`
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <p
                  className={`text-sm font-medium ${
                    selectedPledge === option.id ? "text-white" : "text-slate-700"
                  }`}
                >
                  {option.text}
                </p>
                {selectedPledge === option.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-cyan-500 text-sm font-bold">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Why I'm doing this */}
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Why I&apos;m doing this
          </h2>

          {/* Motivation Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {motivationOptions.map((option, index) => (
              <button
                key={option.id}
                onClick={() => toggleMotivation(option.id)}
                className={`relative rounded-2xl overflow-hidden transition-all ${
                  selectedMotivations.includes(option.id)
                    ? "ring-4 ring-cyan-500 ring-offset-2"
                    : ""
                } ${option.bgColor} ${
                  index === 0 || index === 3 ? "row-span-2 h-48" : "h-24"
                }`}
              >
                {option.type === "image" ? (
                  <div className="absolute inset-0 flex items-end p-4">
                    <p
                      className={`font-medium text-left ${
                        option.textColor || (option.id === "partner" ? "text-white" : "text-slate-700")
                      }`}
                    >
                      {option.text}
                    </p>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-4">
                    <p
                      className={`font-medium text-center ${
                        option.textColor || "text-slate-700"
                      }`}
                    >
                      {option.text}
                    </p>
                  </div>
                )}
                {selectedMotivations.includes(option.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Pledge Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleConfirmPledge}
              disabled={!selectedPledge || selectedMotivations.length === 0}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-full font-semibold text-lg transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
            >
              Confirm Pledge
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
