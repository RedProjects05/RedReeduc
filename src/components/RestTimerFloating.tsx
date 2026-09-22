"use client";

import React, { useEffect } from "react";
import { Bell, Check, Clock, Plus, Minus, X } from "lucide-react";
import { formatSeconds } from "@/lib/utils";
import { playTimerFinishSound } from "@/lib/audio";

interface RestTimerFloatingProps {
  remainingSeconds: number;
  totalDuration: number;
  isActive: boolean;
  onAdjustTime: (delta: number) => void;
  onSkip: () => void;
  exerciseName?: string;
}

export function RestTimerFloating({
  remainingSeconds,
  totalDuration,
  isActive,
  onAdjustTime,
  onSkip,
  exerciseName,
}: RestTimerFloatingProps) {
  useEffect(() => {
    if (isActive && remainingSeconds === 0) {
      playTimerFinishSound();
    }
  }, [isActive, remainingSeconds]);

  if (!isActive && remainingSeconds <= 0) return null;

  const percent = totalDuration > 0 ? Math.max(0, Math.min(100, (remainingSeconds / totalDuration) * 100)) : 0;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md">
      <div className="bg-[#151a26] border border-[#2e3b55] rounded-2xl p-3.5 shadow-2xl shadow-black/80 backdrop-blur-md">
        {/* Top bar info */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center gap-2 text-blue-400 font-semibold">
            <Clock className="w-4 h-4 animate-spin text-blue-400" style={{ animationDuration: "3s" }} />
            <span>Repos en cours {exerciseName ? `• ${exerciseName}` : ""}</span>
          </div>
          <button
            onClick={onSkip}
            className="text-[#8F9BB3] hover:text-white transition-colors p-1"
            title="Fermer le minuteur"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big countdown and quick adjust */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold tracking-tight text-white">
              {formatSeconds(remainingSeconds)}
            </span>
            <span className="text-xs text-[#8F9BB3]">restantes</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAdjustTime(-15)}
              className="px-2.5 py-1.5 bg-[#1f2638] hover:bg-[#2a344d] text-xs font-semibold rounded-lg text-white transition-colors border border-[#303c57] flex items-center gap-1"
            >
              <Minus className="w-3 h-3" /> 15s
            </button>
            <button
              onClick={() => onAdjustTime(30)}
              className="px-2.5 py-1.5 bg-[#1f2638] hover:bg-[#2a344d] text-xs font-semibold rounded-lg text-white transition-colors border border-[#303c57] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 30s
            </button>
            <button
              onClick={onSkip}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-lg text-white transition-colors shadow-sm"
            >
              Passer
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#1e2535] h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
