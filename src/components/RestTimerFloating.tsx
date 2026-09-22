"use client";

import React, { useEffect } from "react";
import { Clock, Minus, Plus, X } from "lucide-react";
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

  const percent =
    totalDuration > 0
      ? Math.max(0, Math.min(100, (remainingSeconds / totalDuration) * 100))
      : 0;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-2xl shadow-slate-900/15 backdrop-blur-md">
        {/* Top bar info */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
            <span>Repos en cours {exerciseName ? `• ${exerciseName}` : ""}</span>
          </div>
          <button
            onClick={onSkip}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
            title="Fermer le minuteur"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big countdown and quick adjust */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black tracking-tight text-slate-900">
              {formatSeconds(remainingSeconds)}
            </span>
            <span className="text-xs text-slate-500 font-semibold">restantes</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAdjustTime(-15)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700 transition-colors border border-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Minus className="w-3 h-3" /> 15s
            </button>
            <button
              onClick={() => onAdjustTime(30)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700 transition-colors border border-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> 30s
            </button>
            <button
              onClick={onSkip}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-black rounded-xl text-white transition-colors shadow-xs cursor-pointer"
            >
              Passer
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
