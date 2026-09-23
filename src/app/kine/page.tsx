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
  const [activeTab, setActiveTab] = useState<"patient" | "feed">("patient");

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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Kiné Welcome Hero */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs relative overflow-hidden">
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
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
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

        {/* Global Key Stats Bar */}
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

      {/* Segmented Tab Navigation - Declutters the 2-column layout */}
      <div className="flex bg-slate-200/60 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("patient")}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "patient"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>Patient (Reda) &amp; Séances</span>
        </button>
        <button
          onClick={() => setActiveTab("feed")}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "feed"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Bilans &amp; Douleur</span>
          {painAlerts.length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black">
              {painAlerts.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Patient Reda & Prescribed Routines */}
      {activeTab === "patient" && (
        <div className="space-y-6">
          {patients.map((patient) => {
            const patientAssignedRoutines = routines.filter(
              (r) => !r.assignedToPatientId || r.assignedToPatientId === patient.id
            );
            const patientSessions = allCompletedWorkouts.filter(
              (w) => w.patientId === patient.id
            );
            const lastSession = patientSessions[0];

            return (
              <div key={patient.id} className="space-y-6">
                {/* Clinical File Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-lg shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-900 text-lg">
                            {patient.name}
                          </h3>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            Patient Suivi
                          </span>
                        </div>
                        <p className="text-xs text-rose-600 font-bold mt-0.5 flex items-center gap-1">
                          <HeartPulse className="w-3.5 h-3.5" />
                          <span>{patient.diagnosis || "Pathologie non renseignée"}</span>
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/kine/routines/new?patientId=${patient.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Prescrire une nouvelle séance</span>
                    </Link>
                  </div>

                  {/* Medical info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
                      <span className="font-extrabold text-slate-700 uppercase text-[10px] block">
                        Antécédents Médicaux / Chirurgicaux
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {patient.medicalHistory || "Non renseigné par le patient"}
                      </p>
                    </div>

                    <div className="bg-blue-50/70 rounded-2xl p-3.5 border border-blue-100 space-y-1">
                      <span className="font-extrabold text-blue-900 uppercase text-[10px] block">
                        Objectif Thérapeutique
                      </span>
                      <p className="text-blue-900 font-medium leading-relaxed">
                        {patient.targetGoals || "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  {/* Clinical metrics summary */}
                  <div className="grid grid-cols-3 gap-3 text-center text-xs pt-1">
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Séances Actives</span>
                      <span className="text-base font-black text-slate-900">{patientAssignedRoutines.length}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Dernière Séance</span>
                      <span className="text-xs font-black text-slate-900">
                        {lastSession
                          ? new Date(lastSession.startTime).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                          : "Aucune"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Dernier Score Douleur</span>
                      <span className={`text-base font-black ${
                        (lastSession?.painLevel ?? 0) > 4 ? "text-rose-600" : "text-emerald-600"
                      }`}>
                        {lastSession ? `${lastSession.painLevel ?? 0}/10` : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prescribed Routines List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-blue-600" />
                      <span>Séances Prescrites à Reda ({patientAssignedRoutines.length})</span>
                    </h3>
                  </div>

                  {patientAssignedRoutines.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                        <Dumbbell className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        Aucune séance prescrite pour le moment
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Créez la première séance de rééducation pour Reda en sélectionnant des exercices dans le pool de 120+ exercices disponibles.
                      </p>
                      <div className="pt-2">
                        <Link
                          href={`/kine/routines/new?patientId=${patient.id}`}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Créer la première séance</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patientAssignedRoutines.map((routine) => {
                        const totalSets = routine.exercises.reduce(
                          (acc, e) => acc + (e.targetSets?.length || 0),
                          0
                        );
                        return (
                          <div
                            key={routine.id}
                            className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-5 shadow-xs space-y-3 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {routine.category}
                              </span>
                              <span className="text-xs text-slate-500 font-semibold">
                                {routine.exercises.length} exercices • {totalSets} séries
                              </span>
                            </div>

                            <div>
                              <h4 className="text-base font-black text-slate-900">
                                {routine.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                {routine.description}
                              </p>
                            </div>

                            {/* Mini exercises preview */}
                            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                              {routine.exercises.slice(0, 3).map((re) => (
                                <div key={re.id} className="flex items-center gap-2 text-slate-700">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="truncate font-medium">{re.exercise.name}</span>
                                  <span className="text-[11px] text-slate-400 ml-auto shrink-0 font-medium">
                                    {re.targetSets?.length || 0} séries
                                  </span>
                                </div>
                              ))}
                              {routine.exercises.length > 3 && (
                                <p className="text-[11px] text-slate-400 italic pl-3.5">
                                  + {routine.exercises.length - 3} autre(s) exercice(s)...
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Live Feed & EVA Pain Follow-up */}
      {activeTab === "feed" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>Séances Réalisées &amp; Retours Douleur (En direct)</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Neon PostgreSQL
            </span>
          </div>

          <div className="space-y-4">
            {allCompletedWorkouts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-2 shadow-xs">
                <Activity className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Aucune séance réalisée pour le moment</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Dès que Reda démarrera et validera une séance depuis son espace patient, son récapitulatif détaillé et son score de douleur EVA s&apos;afficheront ici.
                </p>
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
      )}
    </div>
  );
}
