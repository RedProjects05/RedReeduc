"use client";

import React from "react";
import Link from "next/link";
import { Clock, Dumbbell, HeartPulse, Play, X } from "lucide-react";
import { Routine } from "@/lib/types";
import { ExerciseThumbnail } from "./ExerciseThumbnail";

interface RoutinePreviewModalProps {
  routine: Routine | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoutinePreviewModal({
  routine,
  isOpen,
  onClose,
}: RoutinePreviewModalProps) {
  if (!isOpen || !routine) return null;

  const totalSets = routine.exercises.reduce(
    (acc, e) => acc + (e.targetSets?.length || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {routine.category}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {routine.exercises.length} exercices • {totalSets} séries
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {routine.title}
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
              {routine.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exercises List (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 divide-y divide-slate-100">
          {routine.exercises.map((re, idx) => (
            <div key={re.id || idx} className={`${idx > 0 ? "pt-4" : ""} space-y-3`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ExerciseThumbnail
                    category={re.exercise.category}
                    iconName={re.exercise.iconName}
                    className="w-10 h-10"
                    size={20}
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {re.exercise.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {re.exercise.bodyPart} • {re.exercise.equipment}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{re.restSeconds}s repos</span>
                </div>
              </div>

              {/* Kiné instruction if present */}
              {re.kineNotes && (
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl px-3 py-2 text-xs flex items-start gap-2 text-blue-900">
                  <HeartPulse className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="font-medium">{re.kineNotes}</p>
                </div>
              )}

              {/* Target Sets Preview Table */}
              <div className="overflow-x-auto bg-slate-50 rounded-2xl border border-slate-100 p-2.5">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-200/60">
                      <th className="pb-1.5 pl-2">Série</th>
                      <th className="pb-1.5 text-center">Objectif charge / matériel</th>
                      <th className="pb-1.5 text-right pr-2">Répétitions / Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {re.targetSets.map((ts, sIdx) => (
                      <tr key={sIdx} className="text-slate-800">
                        <td className="py-1.5 pl-2 font-black text-slate-600">
                          {ts.setNumber}
                        </td>
                        <td className="py-1.5 text-center font-semibold">
                          {ts.targetWeightKg !== undefined
                            ? `${ts.targetWeightKg} kg`
                            : ts.targetElasticLevel
                            ? ts.targetElasticLevel
                            : ts.targetDistanceKm !== undefined
                            ? `${ts.targetDistanceKm} km`
                            : "Poids de corps"}
                        </td>
                        <td className="py-1.5 text-right pr-2 font-mono font-bold text-slate-900">
                          {ts.targetReps !== undefined
                            ? `${ts.targetReps} réps`
                            : ts.targetTimeSeconds !== undefined
                            ? `${ts.targetTimeSeconds} s`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Fermer
          </button>
          
          <Link
            href={`/patient/workout/${routine.id}`}
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Démarrer cette séance</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
