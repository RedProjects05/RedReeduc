"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  MessageSquare,
  Plus,
  Send,
  Stethoscope,
  Users,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import { formatDurationHuman } from "@/lib/utils";

export default function KineDashboardPage() {
  const { users, routines, workouts, sendKineComment } = useRedReeducStore();
  const [commentInputs, setCommentInputs] = useState<{ [workoutId: string]: string }>({});

  const patients = users.filter((u) => u.role === "PATIENT");
  const allCompletedWorkouts = workouts.filter((w) => w.isCompleted);
  const painAlerts = allCompletedWorkouts.filter((w) => (w.painLevel ?? 0) >= 5);

  const handleSendComment = async (workoutId: string) => {
    const text = commentInputs[workoutId]?.trim();
    if (!text) return;
    await sendKineComment(workoutId, text);
    setCommentInputs((prev) => ({ ...prev, [workoutId]: "" }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Kiné Welcome Hero */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Espace Praticien
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Anaïs • Kinésithérapeute du Sport
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tableau de Bord Rééducation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Prescrivez des séances sur-mesure à Reda, ajustez les charges et suivez ses retours de douleur en temps réel.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/kine/routines/new"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une Séance pour Reda</span>
            </Link>
          </div>
        </div>

        {/* Global Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Patients</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {patients.length}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
              <span>Séances Prescrites</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {routines.length}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
              <span>Séances Réalisées</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {allCompletedWorkouts.length}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              <span>Alertes Douleur (&gt;4)</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1 flex items-center gap-1.5">
              <span>{painAlerts.length}</span>
              {painAlerts.length > 0 && (
                <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                  À surveiller
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Patients & Live Workout Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patients List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Patientèle Active</span>
            </h2>
            <span className="text-xs text-slate-500 font-bold">
              {patients.length} patient
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
                  className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-base shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {patient.name}
                      </h4>
                      <p className="text-xs text-rose-600 font-medium truncate">
                        {patient.diagnosis || "Pathologie non renseignée"}
                      </p>
                    </div>
                  </div>

                  {/* Medical info entered by Reda */}
                  {(patient.medicalHistory || patient.targetGoals) && (
                    <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-100">
                      {patient.medicalHistory && (
                        <div>
                          <span className="font-bold text-slate-700">Antécédents : </span>
                          <span className="text-slate-600">{patient.medicalHistory}</span>
                        </div>
                      )}
                      {patient.targetGoals && (
                        <div>
                          <span className="font-bold text-blue-900">Objectif : </span>
                          <span className="text-blue-800">{patient.targetGoals}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1 border border-slate-100">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Séances programmées :</span>
                      <span className="text-slate-900 font-bold">
                        {patientAssignedRoutines.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Dernière séance :</span>
                      <span className="text-slate-900 font-medium">
                        {lastSession
                          ? new Date(lastSession.startTime).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })
                          : "Aucune"}
                      </span>
                    </div>
                    {lastSession && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Dernier score EVA :</span>
                        <span
                          className={`font-bold ${
                            (lastSession.painLevel ?? 0) > 4
                              ? "text-rose-600"
                              : "text-emerald-600"
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
                      className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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

        {/* Right Column: Recent Workout Submissions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Séances Réalisées &amp; Retours Douleur (En direct)</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              PostgreSQL
            </span>
          </div>

          <div className="space-y-4">
            {allCompletedWorkouts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-500 shadow-xs">
                Aucune séance réalisée par Reda pour le moment. Dès qu&apos;il validera un entraînement, son bilan et son score de douleur apparaîtront ici.
              </div>
            ) : (
              allCompletedWorkouts.map((workout) => {
                const pain = workout.painLevel ?? 0;

                return (
                  <div
                    key={workout.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs"
                  >
                    {/* Header: Patient & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">
                            {workout.patientName}
                          </span>
                          <span className="text-xs text-slate-300">•</span>
                          <span className="text-xs text-blue-600 font-bold">
                            {workout.routineTitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
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
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : pain <= 4
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : "bg-rose-50 text-rose-700 border-rose-300"
                        }`}
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                        Douleur : {pain} / 10
                      </span>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">
                          Durée
                        </span>
                        <span className="font-black text-slate-900">
                          {formatDurationHuman(workout.durationSeconds)}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">
                          Volume
                        </span>
                        <span className="font-black text-slate-900">
                          {workout.totalVolumeKg} kg
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">
                          Séries
                        </span>
                        <span className="font-black text-slate-900">
                          {workout.completedSetsCount} / {workout.totalSetsCount}
                        </span>
                      </div>
                    </div>

                    {/* Patient remarks */}
                    {workout.patientFeedback && (
                      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>Remarques de Reda :</span>
                        </div>
                        <p className="text-slate-700 italic">
                          &quot;{workout.patientFeedback}&quot;
                        </p>
                      </div>
                    )}

                    {/* Kiné comment / reply thread */}
                    {workout.kineComment ? (
                      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-xs text-purple-900">
                        <span className="font-bold text-purple-950">Votre conseil transmis : </span>
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
                          placeholder="Laisser un conseil ou ajuster la charge pour la prochaine séance..."
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-purple-600 focus:bg-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendComment(workout.id)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
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
