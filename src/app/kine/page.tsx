"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  MessageSquare,
  Plus,
  Send,
  Stethoscope,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import { formatDurationHuman } from "@/lib/utils";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";

export default function KineDashboardPage() {
  const { users, routines, workouts, saveWorkout } = useRedReeducStore();
  const [commentInputs, setCommentInputs] = useState<{ [workoutId: string]: string }>({});

  const patients = users.filter((u) => u.role === "PATIENT");
  const allCompletedWorkouts = workouts.filter((w) => w.isCompleted);

  // Calculate alerts (pain > 4)
  const painAlerts = allCompletedWorkouts.filter((w) => (w.painLevel ?? 0) >= 5);

  const handleSendKineComment = (workoutId: string) => {
    const text = commentInputs[workoutId]?.trim();
    if (!text) return;

    const targetWorkout = allCompletedWorkouts.find((w) => w.id === workoutId);
    if (!targetWorkout) return;

    saveWorkout({
      ...targetWorkout,
      kineComment: text,
    });

    setCommentInputs((prev) => ({ ...prev, [workoutId]: "" }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Kiné Welcome Hero */}
      <div className="bg-gradient-to-br from-[#161a2b] via-[#121624] to-[#0c0f18] border border-[#242f47] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800/60">
                Espace Praticien
              </span>
              <span className="text-xs text-[#8F9BB3]">
                Dr. Alexandre Dupont • Kinésithérapeute
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tableau de Bord Rééducation
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Supervisez les entraînements, ajustez les charges et répondez aux retours de vos patients en temps réel.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/kine/routines/new"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une Séance</span>
            </Link>
          </div>
        </div>

        {/* Global Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-[#1e273c]">
          <div className="bg-[#182030]/80 border border-[#273248] rounded-2xl p-3">
            <div className="flex items-center gap-2 text-[#8F9BB3] text-xs">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Patients Suivis</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {patients.length}
            </div>
          </div>

          <div className="bg-[#182030]/80 border border-[#273248] rounded-2xl p-3">
            <div className="flex items-center gap-2 text-[#8F9BB3] text-xs">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Séances Prescrites</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {routines.length}
            </div>
          </div>

          <div className="bg-[#182030]/80 border border-[#273248] rounded-2xl p-3">
            <div className="flex items-center gap-2 text-[#8F9BB3] text-xs">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Séances Réalisées</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {allCompletedWorkouts.length}
            </div>
          </div>

          <div className="bg-[#182030]/80 border border-[#273248] rounded-2xl p-3">
            <div className="flex items-center gap-2 text-[#8F9BB3] text-xs">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>Alertes Douleur (EVA&gt;4)</span>
            </div>
            <div className="text-xl font-black text-white mt-1 flex items-center gap-1.5">
              <span>{painAlerts.length}</span>
              {painAlerts.length > 0 && (
                <span className="text-[10px] text-rose-400 bg-rose-950 px-1.5 rounded font-bold border border-rose-800">
                  À surveiller
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Patients & Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patients List (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Mes Patients</span>
            </h2>
            <span className="text-xs text-[#8F9BB3] font-semibold">
              {patients.length} actifs
            </span>
          </div>

          <div className="space-y-3">
            {patients.map((patient) => {
              const patientAssignedRoutines = routines.filter(
                (r) => r.assignedToPatientId === patient.id
              );
              const patientSessions = allCompletedWorkouts.filter(
                (w) => w.patientId === patient.id
              );
              const lastSession = patientSessions[0];

              return (
                <div
                  key={patient.id}
                  className="bg-[#121622] border border-[#202738] rounded-2xl p-4 space-y-3 hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-700/60 flex items-center justify-center text-blue-300 font-bold text-sm shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white text-sm truncate">
                        {patient.name}
                      </h4>
                      <p className="text-[11px] text-[#8F9BB3] truncate">
                        {patient.diagnosis || "Suivi kiné actif"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#182030] rounded-xl p-2.5 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-[#8F9BB3]">
                      <span>Séances assignées :</span>
                      <span className="text-white font-bold">
                        {patientAssignedRoutines.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#8F9BB3]">
                      <span>Dernière séance :</span>
                      <span className="text-white font-medium">
                        {lastSession
                          ? new Date(lastSession.startTime).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })
                          : "Aucune"}
                      </span>
                    </div>
                    {lastSession && (
                      <div className="flex items-center justify-between text-[#8F9BB3]">
                        <span>Dernier score EVA :</span>
                        <span
                          className={`font-bold ${
                            (lastSession.painLevel ?? 0) > 4
                              ? "text-rose-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {lastSession.painLevel ?? 0}/10
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-1">
                    <Link
                      href={`/kine/routines/new?patientId=${patient.id}`}
                      className="w-full py-2 bg-[#182030] hover:bg-blue-600 hover:text-white border border-[#273248] text-blue-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Prescrire une nouvelle séance</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Workout Submissions with Feedback & Kiné Responses (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Flux des Séances Réalisées & Retours Douleur</span>
            </h2>
            <span className="text-xs text-[#8F9BB3] font-semibold">
              Temps réel
            </span>
          </div>

          <div className="space-y-4">
            {allCompletedWorkouts.length === 0 ? (
              <div className="bg-[#121622] border border-[#202738] rounded-2xl p-8 text-center text-xs text-[#8F9BB3]">
                Aucune séance réalisée par vos patients pour le moment.
              </div>
            ) : (
              allCompletedWorkouts.map((workout) => {
                const pain = workout.painLevel ?? 0;

                return (
                  <div
                    key={workout.id}
                    className="bg-[#121622] border border-[#202738] rounded-2xl p-5 space-y-4 shadow-sm"
                  >
                    {/* Header: Patient & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b2234] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm">
                            {workout.patientName}
                          </span>
                          <span className="text-xs text-[#8F9BB3]">•</span>
                          <span className="text-xs text-blue-400 font-semibold">
                            {workout.routineTitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8F9BB3] mt-0.5">
                          {new Date(workout.startTime).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* EVA Pain Badge */}
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border self-start sm:self-auto ${
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

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-[#182030] p-2 rounded-xl">
                        <span className="text-[10px] text-[#8F9BB3] uppercase block font-semibold">
                          Durée
                        </span>
                        <span className="font-bold text-white">
                          {formatDurationHuman(workout.durationSeconds)}
                        </span>
                      </div>
                      <div className="bg-[#182030] p-2 rounded-xl">
                        <span className="text-[10px] text-[#8F9BB3] uppercase block font-semibold">
                          Volume Total
                        </span>
                        <span className="font-bold text-white">
                          {workout.totalVolumeKg} kg
                        </span>
                      </div>
                      <div className="bg-[#182030] p-2 rounded-xl">
                        <span className="text-[10px] text-[#8F9BB3] uppercase block font-semibold">
                          Séries Complétées
                        </span>
                        <span className="font-bold text-white">
                          {workout.completedSetsCount} / {workout.totalSetsCount}
                        </span>
                      </div>
                    </div>

                    {/* Patient remarks */}
                    {workout.patientFeedback && (
                      <div className="bg-[#182030] border border-[#273248] rounded-xl p-3 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-1">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                          <span>Remarques du patient :</span>
                        </div>
                        <p className="text-slate-300 italic">
                          &quot;{workout.patientFeedback}&quot;
                        </p>
                      </div>
                    )}

                    {/* Kiné comment / reply thread */}
                    {workout.kineComment ? (
                      <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-3 text-xs text-purple-200">
                        <span className="font-bold text-purple-300">Votre réponse : </span>
                        <span>&quot;{workout.kineComment}&quot;</span>
                      </div>
                    ) : (
                      <div className="pt-1 flex gap-2">
                        <input
                          type="text"
                          value={commentInputs[workout.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [workout.id]: e.target.value,
                            }))
                          }
                          placeholder="Laisser un conseil ou ajuster pour la prochaine séance..."
                          className="flex-1 bg-[#182030] border border-[#273248] rounded-xl px-3 py-2 text-white placeholder-[#54627d] text-xs focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendKineComment(workout.id)}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Répondre</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
