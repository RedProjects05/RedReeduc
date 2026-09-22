"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  Share2,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import { formatDurationHuman } from "@/lib/utils";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";

export default function PatientHistoryPage() {
  const { activeUser, workouts } = useRedReeducStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const patientWorkouts = workouts.filter((w) => w.patientId === activeUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/patient"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour à l&apos;accueil
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Historique & Suivi Rééducation
          </h1>
          <p className="text-xs text-[#8F9BB3]">
            Vos séances terminées et les retours transmis au Dr. Alexandre Dupont
          </p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {patientWorkouts.length === 0 ? (
          <div className="bg-[#121622] border border-[#202738] rounded-2xl p-10 text-center space-y-3">
            <Activity className="w-10 h-10 text-blue-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Aucune séance dans l&apos;historique</h3>
            <p className="text-xs text-[#8F9BB3]">
              Dès que vous terminerez une séance Hevy, elle s&apos;affichera ici avec le volume et votre score de douleur.
            </p>
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
            >
              Lancer une séance
            </Link>
          </div>
        ) : (
          patientWorkouts.map((workout) => {
            const isExpanded = expandedId === workout.id;
            const pain = workout.painLevel ?? 0;

            return (
              <div
                key={workout.id}
                className="bg-[#121622] border border-[#202738] rounded-3xl p-5 shadow-sm space-y-4 transition-all"
              >
                {/* Header of session */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b2234] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Séance terminée
                      </span>
                      <span className="text-xs text-[#8F9BB3]">•</span>
                      <span className="text-xs text-[#8F9BB3]">
                        {new Date(workout.startTime).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white mt-1">
                      {workout.routineTitle}
                    </h3>
                  </div>

                  {/* Pain EVA Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                        pain <= 2
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                          : pain <= 4
                          ? "bg-amber-950/60 text-amber-300 border-amber-700/60"
                          : "bg-rose-950/60 text-rose-300 border-rose-700/60"
                      }`}
                    >
                      <HeartPulse className="w-3.5 h-3.5" />
                      Douleur : {pain} / 10
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-[#182030] p-2.5 rounded-2xl text-center">
                    <span className="text-[10px] text-[#8F9BB3] uppercase block font-semibold">
                      Durée
                    </span>
                    <span className="text-sm font-black text-white">
                      {formatDurationHuman(workout.durationSeconds)}
                    </span>
                  </div>

                  <div className="bg-[#182030] p-2.5 rounded-2xl text-center">
                    <span className="text-[10px] text-[#8F9BB3] uppercase block font-semibold">
                      Volume
                    </span>
                    <span className="text-sm font-black text-white">
                      {workout.totalVolumeKg} kg
                    </span>
                  </div>

                  <div className="bg-[#182030] p-2.5 rounded-2xl text-center">
                    <span className="text-[10px] text-[#8F9BB3] uppercase block font-semibold">
                      Séries
                    </span>
                    <span className="text-sm font-black text-white">
                      {workout.completedSetsCount} / {workout.totalSetsCount}
                    </span>
                  </div>
                </div>

                {/* Feedback notes */}
                {workout.patientFeedback && (
                  <div className="bg-[#161c2a] border border-[#222a3d] rounded-2xl p-3 text-xs">
                    <span className="font-bold text-slate-200">Retour pour le Kiné : </span>
                    <span className="text-[#8F9BB3]">&quot;{workout.patientFeedback}&quot;</span>
                  </div>
                )}

                {/* Toggle details */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : workout.id)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  {isExpanded ? "Masquer le détail des séries" : "Voir le détail des exercices et séries"}
                </button>

                {/* Detailed Sets Breakdown */}
                {isExpanded && (
                  <div className="space-y-3 pt-2 border-t border-[#1b2234]">
                    {workout.exercises.map((exo, idx) => (
                      <div
                        key={idx}
                        className="bg-[#161c2a] rounded-2xl p-3.5 space-y-2 border border-[#202738]"
                      >
                        <div className="flex items-center gap-2">
                          <ExerciseThumbnail category={exo.exercise.category} iconName={exo.exercise.iconName} size={16} className="w-8 h-8" />
                          <h4 className="text-xs font-bold text-white">{exo.exercise.name}</h4>
                          <span className="text-[10px] text-[#8F9BB3] ml-auto">
                            {exo.sets.filter((s) => s.completed).length} séries validées
                          </span>
                        </div>

                        <div className="divide-y divide-[#1f273b] text-xs">
                          {exo.sets.map((set, sIdx) => (
                            <div
                              key={sIdx}
                              className="py-1 flex items-center justify-between text-[#8F9BB3]"
                            >
                              <span>Série {set.setNumber}</span>
                              <span className="font-mono text-white font-medium">
                                {set.actualWeightKg !== undefined
                                  ? `${set.actualWeightKg} kg x ${set.actualReps} réps`
                                  : set.actualTimeSeconds !== undefined
                                  ? `${set.actualTimeSeconds} s`
                                  : set.actualDistanceKm !== undefined
                                  ? `${set.actualDistanceKm} km`
                                  : `${set.actualReps} réps`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
