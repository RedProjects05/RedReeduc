"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Dumbbell,
  HeartPulse,
  Lock,
  Trash2,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import { formatDurationHuman } from "@/lib/utils";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";

export default function PatientHistoryPage() {
  const { activeUser, workouts, deleteWorkout } = useRedReeducStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const patientWorkouts = workouts.filter((w) => w.patientId === activeUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/patient"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Historique et suivi de rééducation
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Vos séances terminées et les retours transmis à Anaïs
          </p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {patientWorkouts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3 shadow-xs">
            <Activity className="w-10 h-10 text-blue-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Aucune séance dans l&apos;historique</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Dès que vous terminerez une séance Hevy, elle s&apos;affichera ici avec le volume et votre note de douleur EVA.
            </p>
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20"
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
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 transition-all"
              >
                {/* Header of session */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {workout.sharedWithKine === false ? (
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-500" /> Séance privée
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Transmise à Anaïs
                        </span>
                      )}
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(workout.startTime).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {workout.routineTitle}
                    </h3>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                        pain <= 2
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : pain <= 4
                          ? "bg-amber-50 text-amber-700 border-amber-300"
                          : "bg-rose-50 text-rose-700 border-rose-300"
                      }`}
                    >
                      <HeartPulse className="w-3.5 h-3.5" />
                      Douleur : {pain} / 10
                    </span>

                    <button
                      type="button"
                      onClick={() => setWorkoutToDelete(workout.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                      title="Supprimer cette séance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">
                      Durée
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {formatDurationHuman(workout.durationSeconds)}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">
                      Volume
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {workout.totalVolumeKg} kg
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">
                      Séries
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {workout.completedSetsCount} / {workout.totalSetsCount}
                    </span>
                  </div>
                </div>

                {/* Feedback notes */}
                {workout.patientFeedback && (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-xs">
                    <span className="font-bold text-slate-800">Retour pour Anaïs : </span>
                    <span className="text-slate-600">&quot;{workout.patientFeedback}&quot;</span>
                  </div>
                )}

                {/* Kiné comment */}
                {workout.kineComment && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-xs text-purple-900">
                    <span className="font-bold text-purple-950">Conseil d&apos;Anaïs : </span>
                    <span>&quot;{workout.kineComment}&quot;</span>
                  </div>
                )}

                {/* Toggle details */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : workout.id)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  {isExpanded ? "Masquer le détail des séries" : "Voir le détail des exercices et séries"}
                </button>

                {/* Detailed Sets Breakdown */}
                {isExpanded && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    {workout.exercises.map((exo, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200/70"
                      >
                        <div className="flex items-center gap-2">
                          <ExerciseThumbnail category={exo.exercise.category} iconName={exo.exercise.iconName} size={16} className="w-8 h-8" />
                          <h4 className="text-xs font-bold text-slate-900">{exo.exercise.name}</h4>
                          <span className="text-[10px] text-slate-500 ml-auto font-medium">
                            {exo.sets.filter((s) => s.completed).length} séries validées
                          </span>
                        </div>

                        <div className="divide-y divide-slate-200/60 text-xs">
                          {exo.sets.map((set, sIdx) => (
                            <div
                              key={sIdx}
                              className="py-1.5 flex items-center justify-between text-slate-600"
                            >
                              <span>Série {set.setNumber}</span>
                              <span className="font-mono text-slate-900 font-bold">
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

      {/* Delete Confirmation Modal */}
      {workoutToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Supprimer la séance ?</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Cette action retirera définitivement cette séance de votre historique.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setWorkoutToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  await deleteWorkout(workoutToDelete);
                  setIsDeleting(false);
                  setWorkoutToDelete(null);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/20 transition-all cursor-pointer"
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
