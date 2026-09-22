"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  Play,
  Plus,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import { formatDurationHuman } from "@/lib/utils";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";

export default function PatientDashboardPage() {
  const { activeUser, routines, workouts } = useRedReeducStore();

  // Filter routines assigned to this patient (or all if not specified)
  const assignedRoutines = routines.filter(
    (r) => !r.assignedToPatientId || r.assignedToPatientId === activeUser.id
  );

  const patientWorkouts = workouts.filter((w) => w.patientId === activeUser.id);
  const lastWorkout = patientWorkouts[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Patient Welcome Hero */}
      <div className="bg-gradient-to-br from-[#151c2c] to-[#0e121d] border border-[#232d42] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/60">
                Espace Patient
              </span>
              <span className="text-xs text-[#8F9BB3]">
                Suivi par Dr. Alexandre Dupont
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bonjour, {activeUser.name} 👋
            </h1>
            {activeUser.diagnosis && (
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 pt-1">
                <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{activeUser.diagnosis}</span>
              </p>
            )}
          </div>

          <div className="shrink-0 flex gap-2">
            <Link
              href="/patient/workout/free"
              className="px-4 py-2.5 bg-[#1a2336] hover:bg-[#222e47] border border-[#2d3b59] text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              <span>Séance Libre</span>
            </Link>
          </div>
        </div>

        {/* Prescription highlight card */}
        {activeUser.targetNotes && (
          <div className="mt-4 pt-4 border-t border-[#1f283d] flex items-start gap-2.5 text-xs text-[#8F9BB3]">
            <Stethoscope className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Consigne Praticien : </span>
              <span>{activeUser.targetNotes}</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action: Assigned Routines from Kiné */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-blue-400" />
            <span>Séances Prescrites par votre Kiné</span>
          </h2>
          <span className="text-xs text-[#8F9BB3] font-semibold">
            {assignedRoutines.length} séance(s) active(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedRoutines.map((routine) => {
            const totalSets = routine.exercises.reduce(
              (acc, e) => acc + e.targetSets.length,
              0
            );

            return (
              <div
                key={routine.id}
                className="bg-[#121622] border border-[#202738] hover:border-blue-500/40 rounded-3xl p-5 shadow-sm transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {routine.category}
                    </span>
                    <span className="text-xs text-[#8F9BB3]">
                      {routine.exercises.length} exercices • {totalSets} séries
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">
                      {routine.title}
                    </h3>
                    <p className="text-xs text-[#8F9BB3] line-clamp-2 mt-1">
                      {routine.description}
                    </p>
                  </div>

                  {/* Exercises mini preview */}
                  <div className="space-y-1.5 pt-2 border-t border-[#1b2234]">
                    {routine.exercises.slice(0, 3).map((re) => (
                      <div
                        key={re.id}
                        className="flex items-center gap-2 text-xs text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="truncate font-medium">{re.exercise.name}</span>
                        <span className="text-[11px] text-[#8F9BB3] ml-auto shrink-0">
                          {re.targetSets.length} séries
                        </span>
                      </div>
                    ))}
                    {routine.exercises.length > 3 && (
                      <div className="text-[11px] text-[#8F9BB3] italic pl-3.5">
                        + {routine.exercises.length - 3} autre(s) exercice(s)...
                      </div>
                    )}
                  </div>
                </div>

                {/* Start Button */}
                <div className="pt-5">
                  <Link
                    href={`/patient/workout/${routine.id}`}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Démarrer cette séance</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent History & Adherence */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Dernière Séance Réalisée</span>
          </h2>
          <Link
            href="/patient/history"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Voir tout l&apos;historique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {lastWorkout ? (
          <div className="bg-[#121622] border border-[#202738] rounded-3xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b2234] pb-3">
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Séance transmise au kiné
                </span>
                <h3 className="text-base font-black text-white mt-0.5">
                  {lastWorkout.routineTitle}
                </h3>
              </div>
              <div className="text-xs text-[#8F9BB3]">
                {new Date(lastWorkout.startTime).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#182030] p-2.5 rounded-xl">
                <span className="block text-[10px] text-[#8F9BB3] uppercase">Durée</span>
                <span className="text-sm font-bold text-white">
                  {formatDurationHuman(lastWorkout.durationSeconds)}
                </span>
              </div>
              <div className="bg-[#182030] p-2.5 rounded-xl">
                <span className="block text-[10px] text-[#8F9BB3] uppercase">Volume</span>
                <span className="text-sm font-bold text-white">
                  {lastWorkout.totalVolumeKg} kg
                </span>
              </div>
              <div className="bg-[#182030] p-2.5 rounded-xl">
                <span className="block text-[10px] text-[#8F9BB3] uppercase">Séries</span>
                <span className="text-sm font-bold text-white">
                  {lastWorkout.completedSetsCount}
                </span>
              </div>
              <div className="bg-[#182030] p-2.5 rounded-xl">
                <span className="block text-[10px] text-[#8F9BB3] uppercase">Douleur EVA</span>
                <span
                  className={`text-sm font-bold ${
                    (lastWorkout.painLevel ?? 0) > 4
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  {lastWorkout.painLevel ?? 0}/10
                </span>
              </div>
            </div>

            {lastWorkout.patientFeedback && (
              <div className="bg-[#161c2a] rounded-xl p-3 text-xs text-[#8F9BB3]">
                <span className="font-semibold text-slate-300">Votre retour : </span>
                <span>&quot;{lastWorkout.patientFeedback}&quot;</span>
              </div>
            )}

            {lastWorkout.kineComment && (
              <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-3 text-xs text-purple-200">
                <span className="font-bold text-purple-300">Réponse du Kiné : </span>
                <span>&quot;{lastWorkout.kineComment}&quot;</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#121622] border border-[#202738] rounded-2xl p-6 text-center text-xs text-[#8F9BB3]">
            Aucune séance terminée pour l&apos;instant. Lancez votre première séance ci-dessus !
          </div>
        )}
      </div>
    </div>
  );
}
