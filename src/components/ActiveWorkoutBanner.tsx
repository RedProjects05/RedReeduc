"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Play, Trash2, X } from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import { formatDurationHuman } from "@/lib/utils";
import { ActiveWorkoutExercise, LoggedSet } from "@/lib/types";

export function ActiveWorkoutBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeLiveWorkout, setActiveLiveWorkout } = useRedReeducStore();
  const [liveDuration, setLiveDuration] = useState(0);
  const [isConfirmingAbandon, setIsConfirmingAbandon] = useState(false);

  // If user is currently on the workout page, do not display duplicate bottom banner
  const isOnWorkoutPage = pathname?.includes("/patient/workout/");

  // Live timer tick when workout is in progress
  useEffect(() => {
    if (!activeLiveWorkout) return;

    // Calculate elapsed time from start or stored
    const startTimestamp = new Date(activeLiveWorkout.startTime).getTime();
    const updateElapsed = () => {
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - startTimestamp) / 1000));
      setLiveDuration(diffSec);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [activeLiveWorkout]);

  if (!activeLiveWorkout || isOnWorkoutPage) return null;

  const totalSets = activeLiveWorkout.activeExercises.reduce(
    (acc: number, e: ActiveWorkoutExercise) => acc + e.sets.length,
    0
  );
  const completedSets = activeLiveWorkout.activeExercises.reduce(
    (acc: number, e: ActiveWorkoutExercise) =>
      acc + e.sets.filter((s: LoggedSet) => s.completed).length,
    0
  );

  const workoutUrl = activeLiveWorkout.routineId
    ? `/patient/workout/${activeLiveWorkout.routineId}`
    : `/patient/workout/free`;

  const handleAbandon = () => {
    setActiveLiveWorkout(null);
    setIsConfirmingAbandon(false);
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-xl mx-auto animate-in slide-in-from-bottom duration-300">
        <div className="bg-slate-900 text-white rounded-3xl p-3.5 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 backdrop-blur-md">
          {/* Status info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs truncate">
                  {activeLiveWorkout.workoutTitle}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                  {formatDurationHuman(liveDuration)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {completedSets} sur {totalSets} séries validées
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsConfirmingAbandon(true)}
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Abandonner la séance"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <Link
              href={workoutUrl}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/30 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Reprendre</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Abandon */}
      {isConfirmingAbandon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-slate-900 text-base">
              Abandonner la séance en cours ?
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Votre progression actuelle et vos séries cochées seront effacées. Êtes-vous sûr de vouloir quitter ?
            </p>
            <div className="pt-1 flex gap-2.5">
              <button
                type="button"
                onClick={() => setIsConfirmingAbandon(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Continuer ma séance
              </button>
              <button
                type="button"
                onClick={handleAbandon}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-md shadow-red-500/20 cursor-pointer"
              >
                Oui, abandonner
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
