"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Edit3,
  Flame,
  HeartPulse,
  Play,
  Plus,
  Save,
  Stethoscope,
  Target,
  X,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import { formatDurationHuman } from "@/lib/utils";

export default function PatientDashboardPage() {
  const { activeUser, routines, workouts, updateUserProfile } = useRedReeducStore();

  // Profile Edit Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [diagnosis, setDiagnosis] = useState(activeUser.diagnosis || "");
  const [medicalHistory, setMedicalHistory] = useState(activeUser.medicalHistory || "");
  const [targetGoals, setTargetGoals] = useState(activeUser.targetGoals || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Routines assigned to Reda
  const assignedRoutines = routines.filter(
    (r) => !r.assignedToPatientId || r.assignedToPatientId === activeUser.id
  );

  const patientWorkouts = workouts.filter((w) => w.patientId === activeUser.id);
  const lastWorkout = patientWorkouts[0];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateUserProfile(activeUser.id, {
      diagnosis: diagnosis.trim(),
      medicalHistory: medicalHistory.trim(),
      targetGoals: targetGoals.trim(),
    });
    setIsSavingProfile(false);
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Patient Welcome Hero - Clean Bright Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Espace Patient
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Suivi par Anaïs (Kiné)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bonjour, {activeUser.name} 👋
            </h1>
            {activeUser.diagnosis ? (
              <p className="text-xs sm:text-sm text-slate-700 font-semibold flex items-center gap-1.5 pt-1">
                <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{activeUser.diagnosis}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic pt-1">
                Aucune pathologie renseignée. Cliquez sur &quot;Modifier mon profil&quot; pour la préciser.
              </p>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => {
                setDiagnosis(activeUser.diagnosis || "");
                setMedicalHistory(activeUser.medicalHistory || "");
                setTargetGoals(activeUser.targetGoals || "");
                setIsEditingProfile(true);
              }}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-blue-600" />
              <span>Ma Pathologie &amp; Profil</span>
            </button>
            <Link
              href="/patient/workout/free"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Séance Libre</span>
            </Link>
          </div>
        </div>

        {/* Medical History & Goals Summary */}
        {(activeUser.medicalHistory || activeUser.targetGoals) && (
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {activeUser.medicalHistory && (
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                <span className="font-bold text-slate-800 block mb-0.5">Antécédents :</span>
                <span className="text-slate-600">{activeUser.medicalHistory}</span>
              </div>
            )}
            {activeUser.targetGoals && (
              <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
                <span className="font-bold text-blue-900 block mb-0.5 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-blue-600" /> Objectifs :
                </span>
                <span className="text-blue-800">{activeUser.targetGoals}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary Action: Assigned Routines from Anaïs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-blue-600" />
            <span>Séances Prescrites par Anaïs</span>
          </h2>
          <span className="text-xs text-slate-500 font-bold">
            {assignedRoutines.length} séance(s)
          </span>
        </div>

        {assignedRoutines.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Aucune séance prescrite pour l&apos;instant
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Anaïs n&apos;a pas encore créé de séance pour vous. Vous pouvez basculer en mode <strong>Kiné</strong> (en haut à droite) pour lui créer sa première séance, ou lancer un entraînement libre ci-dessous.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/patient/workout/free"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20"
              >
                Démarrer un entraînement libre
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedRoutines.map((routine) => {
              const totalSets = routine.exercises.reduce(
                (acc, e) => acc + (e.targetSets?.length || 0),
                0
              );

              return (
                <div
                  key={routine.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-5 shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {routine.category}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {routine.exercises.length} exercices • {totalSets} séries
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {routine.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {routine.description}
                      </p>
                    </div>

                    {/* Exercises mini preview */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {routine.exercises.slice(0, 3).map((re) => (
                        <div
                          key={re.id}
                          className="flex items-center gap-2 text-xs text-slate-700"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="truncate font-medium">{re.exercise.name}</span>
                          <span className="text-[11px] text-slate-400 ml-auto shrink-0 font-medium">
                            {re.targetSets?.length || 0} séries
                          </span>
                        </div>
                      ))}
                      {routine.exercises.length > 3 && (
                        <div className="text-[11px] text-slate-400 italic pl-3.5">
                          + {routine.exercises.length - 3} autre(s) exercice(s)...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="pt-5">
                    <Link
                      href={`/patient/workout/${routine.id}`}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Démarrer cette séance</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent History & Adherence */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>Dernière Séance Réalisée</span>
          </h2>
          <Link
            href="/patient/history"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Voir l&apos;historique complet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {lastWorkout ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Séance transmise à Anaïs
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {lastWorkout.routineTitle}
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {new Date(lastWorkout.startTime).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Durée</span>
                <span className="text-sm font-black text-slate-900">
                  {formatDurationHuman(lastWorkout.durationSeconds)}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Volume</span>
                <span className="text-sm font-black text-slate-900">
                  {lastWorkout.totalVolumeKg} kg
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Séries</span>
                <span className="text-sm font-black text-slate-900">
                  {lastWorkout.completedSetsCount}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Douleur EVA</span>
                <span
                  className={`text-sm font-black ${
                    (lastWorkout.painLevel ?? 0) > 4
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }`}
                >
                  {lastWorkout.painLevel ?? 0}/10
                </span>
              </div>
            </div>

            {lastWorkout.patientFeedback && (
              <div className="bg-slate-50 rounded-2xl p-3.5 text-xs text-slate-700 border border-slate-200/60">
                <span className="font-bold text-slate-900">Votre retour : </span>
                <span>&quot;{lastWorkout.patientFeedback}&quot;</span>
              </div>
            )}

            {lastWorkout.kineComment && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-xs text-purple-900">
                <span className="font-bold text-purple-950">Conseil d&apos;Anaïs : </span>
                <span>&quot;{lastWorkout.kineComment}&quot;</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center text-xs text-slate-500">
            Aucun historique pour le moment. Votre première séance terminée s&apos;affichera ici !
          </div>
        )}
      </div>

      {/* Edit Profile / Pathology Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <h3 className="font-black text-slate-900 text-lg">
                  Mon Profil &amp; Pathologie (Reda)
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pathologie / Diagnostic actuel *
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Ex: Rupture LCA genou droit, Tendinopathie rotulienne..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Antécédents médicaux / chirurgicaux
                </label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Ex: Opération DIDT le 15 juin, pas d'autre chirurgie..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white resize-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Objectifs de rééducation personnels
                </label>
                <textarea
                  value={targetGoals}
                  onChange={(e) => setTargetGoals(e.target.value)}
                  placeholder="Ex: Reprendre le football dans 4 mois, éliminer la douleur lors des escaliers..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white resize-none font-medium"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? "Enregistrement..." : "Sauvegarder mon profil"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
