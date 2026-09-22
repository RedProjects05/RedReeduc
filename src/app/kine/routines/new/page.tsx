"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Dumbbell,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import {
  Exercise,
  ExerciseCategory,
  Routine,
  RoutineExercise,
  TargetSet,
} from "@/lib/types";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";
import { ExerciseSelectorModal } from "@/components/ExerciseSelectorModal";

function NewRoutineBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId");

  const { users, exercises: allExercises, saveRoutine } = useRedReeducStore();
  const patients = users.filter((u) => u.role === "PATIENT");

  // Routine Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExerciseCategory>("Genou");
  const [assignedPatientId, setAssignedPatientId] = useState(
    preselectedPatientId || patients[0]?.id || "patient-reda"
  );
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!title) {
      setTitle("Séance de Rééducation Genou Droit");
    }
  }, [title]);

  const handleSelectExercise = (exo: Exercise) => {
    const isCardio = exo.trackingType === "distance_time";
    const isTimeOnly = exo.trackingType === "time";
    const isElastic = exo.trackingType === "elastic_reps";

    const defaultSets: TargetSet[] = [
      {
        setNumber: 1,
        type: "normal",
        targetWeightKg: isCardio || isTimeOnly || isElastic ? undefined : 20,
        targetReps: isTimeOnly ? undefined : 10,
        targetTimeSeconds: isTimeOnly ? 45 : undefined,
        targetDistanceKm: isCardio ? 1.0 : undefined,
        targetElasticLevel: isElastic ? "Jaune (Léger - 5kg)" : undefined,
      },
      {
        setNumber: 2,
        type: "normal",
        targetWeightKg: isCardio || isTimeOnly || isElastic ? undefined : 20,
        targetReps: isTimeOnly ? undefined : 10,
        targetTimeSeconds: isTimeOnly ? 45 : undefined,
        targetDistanceKm: isCardio ? 1.0 : undefined,
        targetElasticLevel: isElastic ? "Jaune (Léger - 5kg)" : undefined,
      },
      {
        setNumber: 3,
        type: "normal",
        targetWeightKg: isCardio || isTimeOnly || isElastic ? undefined : 20,
        targetReps: isTimeOnly ? undefined : 10,
        targetTimeSeconds: isTimeOnly ? 45 : undefined,
        targetDistanceKm: isCardio ? 1.0 : undefined,
        targetElasticLevel: isElastic ? "Jaune (Léger - 5kg)" : undefined,
      },
    ];

    const newRoutineExo: RoutineExercise = {
      id: `re-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      exerciseId: exo.id,
      exercise: exo,
      order: routineExercises.length + 1,
      restSeconds: exo.defaultRestSeconds || 60,
      kineNotes: exo.kineTips || "",
      laterality: "Bilatéral",
      targetSets: defaultSets,
    };

    setRoutineExercises((prev) => [...prev, newRoutineExo]);
  };

  const handleAddSet = (exoIdx: number) => {
    setRoutineExercises((prev) => {
      const updated = [...prev];
      const target = { ...updated[exoIdx] };
      const lastSet = target.targetSets[target.targetSets.length - 1];

      const newSet: TargetSet = {
        setNumber: target.targetSets.length + 1,
        type: "normal",
        targetWeightKg: lastSet?.targetWeightKg ?? 20,
        targetReps: lastSet?.targetReps ?? 10,
        targetTimeSeconds: lastSet?.targetTimeSeconds,
        targetDistanceKm: lastSet?.targetDistanceKm,
        targetElasticLevel: lastSet?.targetElasticLevel,
        laterality: target.laterality,
      };

      target.targetSets.push(newSet);
      updated[exoIdx] = target;
      return updated;
    });
  };

  const handleRemoveSet = (exoIdx: number, setIdx: number) => {
    setRoutineExercises((prev) => {
      const updated = [...prev];
      const target = { ...updated[exoIdx] };
      target.targetSets.splice(setIdx, 1);
      target.targetSets = target.targetSets.map((s, idx) => ({
        ...s,
        setNumber: idx + 1,
      }));
      updated[exoIdx] = target;
      return updated;
    });
  };

  const handleUpdateSetValue = (
    exoIdx: number,
    setIdx: number,
    field: keyof TargetSet,
    val: unknown
  ) => {
    setRoutineExercises((prev) => {
      const updated = [...prev];
      const target = { ...updated[exoIdx] };
      target.targetSets[setIdx] = {
        ...target.targetSets[setIdx],
        [field]: val,
      };
      updated[exoIdx] = target;
      return updated;
    });
  };

  const handleUpdateExoMeta = (
    exoIdx: number,
    field: keyof RoutineExercise,
    val: unknown
  ) => {
    setRoutineExercises((prev) => {
      const updated = [...prev];
      updated[exoIdx] = {
        ...updated[exoIdx],
        [field]: val,
      };
      return updated;
    });
  };

  const handleRemoveExercise = (exoIdx: number) => {
    setRoutineExercises((prev) => prev.filter((_, idx) => idx !== exoIdx));
  };

  const handleSaveRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Veuillez saisir un nom pour cette séance.");
      return;
    }
    if (routineExercises.length === 0) {
      alert("Ajoutez au moins un exercice avant d'enregistrer.");
      return;
    }

    setIsSaving(true);
    const newRoutine: Routine = {
      id: `routine-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "Séance prescrite par Anaïs pour votre rééducation.",
      category,
      createdByKineId: "kine-anais",
      assignedToPatientId: assignedPatientId || "patient-reda",
      exercises: routineExercises,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveRoutine(newRoutine);
    setIsSaving(false);
    router.push("/kine");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/kine"
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Annuler &amp; Retour
        </Link>
        <button
          type="button"
          onClick={handleSaveRoutine}
          disabled={isSaving}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Enregistrement..." : "Enregistrer & Assigner"}</span>
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Nouvelle Séance de Rééducation (Anaïs)
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Configurez les exercices, séries, charges et consignes pour Reda.
        </p>
      </div>

      {/* Routine Metadata Form */}
      <form onSubmit={handleSaveRoutine} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Titre de la Séance *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Rééducation Genou Droit - Phase 2"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-bold text-base focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Assigner au Patient
              </label>
              <select
                value={assignedPatientId}
                onChange={(e) => setAssignedPatientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.diagnosis ? `(${p.diagnosis})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Catégorie Principale
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExerciseCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="Genou">Genou &amp; Membres Inférieurs</option>
                <option value="Épaule">Épaule &amp; Coiffe</option>
                <option value="Dos & Tronc">Dos &amp; Tronc / Rachis</option>
                <option value="Cheville & Pied">Cheville &amp; Pied</option>
                <option value="Hanche">Hanche &amp; Bassin</option>
                <option value="Bras">Bras &amp; Coude</option>
                <option value="Cardio & Échauffement">Cardio &amp; Échauffement</option>
                <option value="Mobilité & Étirement">Mobilité &amp; Étirement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description &amp; Objectifs pour Reda
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Travail de renforcement progressif du quadriceps et stabilisation rotulienne..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white resize-none font-medium"
            />
          </div>
        </div>

        {/* Exercises Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-blue-600" />
              <span>Exercices Programmés ({routineExercises.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Exercice</span>
            </button>
          </div>

          {routineExercises.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
              <Dumbbell className="w-10 h-10 text-blue-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Aucun exercice prescrit</h3>
              <p className="text-xs text-slate-500">
                Sélectionnez des exercices dans le pool de kiné ou créez-en un sur-mesure.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Parcourir les exercices
              </button>
            </div>
          ) : (
            routineExercises.map((re, exoIdx) => {
              const isCardio = re.exercise.trackingType === "distance_time";
              const isTimeOnly = re.exercise.trackingType === "time";
              const isElastic = re.exercise.trackingType === "elastic_reps";

              return (
                <div
                  key={re.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ExerciseThumbnail
                        category={re.exercise.category}
                        iconName={re.exercise.iconName}
                        size={18}
                        className="w-10 h-10"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {exoIdx + 1}. {re.exercise.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                          <span>{re.exercise.bodyPart}</span>
                          <span>•</span>
                          <span>{re.exercise.equipment}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exoIdx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Kiné Instruction Notes & Rest */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Consigne Spécifique pour Reda
                      </label>
                      <input
                        type="text"
                        value={re.kineNotes || ""}
                        onChange={(e) =>
                          handleUpdateExoMeta(exoIdx, "kineNotes", e.target.value)
                        }
                        placeholder="Ex: Ne pas forcer si douleur > 2/10, descente lente 3s..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Repos Conseillé
                      </label>
                      <select
                        value={re.restSeconds}
                        onChange={(e) =>
                          handleUpdateExoMeta(exoIdx, "restSeconds", parseInt(e.target.value))
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                      >
                        <option value="0">Désactivé (0s)</option>
                        <option value="30">30 secondes</option>
                        <option value="45">45 secondes</option>
                        <option value="60">60 secondes</option>
                        <option value="90">90 secondes</option>
                        <option value="120">2 minutes</option>
                      </select>
                    </div>
                  </div>

                  {/* Sets Builder Table */}
                  <div className="pt-2">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                          <th className="pb-1.5 w-12 text-center">SÉRIE</th>
                          <th className="pb-1.5 text-center">
                            {isCardio ? "KM CIBLE" : isElastic ? "ÉLASTIQUE" : "CHARGE CIBLE (KG)"}
                          </th>
                          <th className="pb-1.5 text-center">
                            {isCardio ? "TEMPS" : isTimeOnly ? "DURÉE (SEC)" : "RÉPÉTITIONS"}
                          </th>
                          <th className="pb-1.5 w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {re.targetSets.map((ts, setIdx) => (
                          <tr key={setIdx}>
                            <td className="py-2 text-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">
                                {ts.setNumber}
                              </span>
                            </td>

                            <td className="py-2 text-center">
                              {isCardio ? (
                                <input
                                  type="number"
                                  step="0.1"
                                  value={ts.targetDistanceKm ?? 1.0}
                                  onChange={(e) =>
                                    handleUpdateSetValue(
                                      exoIdx,
                                      setIdx,
                                      "targetDistanceKm",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-center text-slate-900 font-bold text-xs"
                                />
                              ) : isElastic ? (
                                <select
                                  value={ts.targetElasticLevel || "Jaune (Léger - 5kg)"}
                                  onChange={(e) =>
                                    handleUpdateSetValue(
                                      exoIdx,
                                      setIdx,
                                      "targetElasticLevel",
                                      e.target.value
                                    )
                                  }
                                  className="w-28 bg-slate-50 border border-slate-200 rounded-lg py-1 px-1 text-center text-slate-900 font-bold text-[11px]"
                                >
                                  <option value="Jaune (Léger - 5kg)">Jaune (5kg)</option>
                                  <option value="Rouge (Moyen - 10kg)">Rouge (10kg)</option>
                                  <option value="Vert (Fort - 15kg)">Vert (15kg)</option>
                                  <option value="Bleu (Très fort - 20kg)">Bleu (20kg)</option>
                                  <option value="Noir (Maximal - 25kg)">Noir (25kg)</option>
                                </select>
                              ) : isTimeOnly ? (
                                <span className="text-slate-400 font-medium">-</span>
                              ) : (
                                <input
                                  type="number"
                                  step="1"
                                  value={ts.targetWeightKg ?? 20}
                                  onChange={(e) =>
                                    handleUpdateSetValue(
                                      exoIdx,
                                      setIdx,
                                      "targetWeightKg",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-center text-slate-900 font-bold text-xs"
                                />
                              )}
                            </td>

                            <td className="py-2 text-center">
                              {isTimeOnly ? (
                                <input
                                  type="number"
                                  step="5"
                                  value={ts.targetTimeSeconds ?? 45}
                                  onChange={(e) =>
                                    handleUpdateSetValue(
                                      exoIdx,
                                      setIdx,
                                      "targetTimeSeconds",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-center text-slate-900 font-bold text-xs"
                                />
                              ) : (
                                <input
                                  type="number"
                                  step="1"
                                  value={ts.targetReps ?? 10}
                                  onChange={(e) =>
                                    handleUpdateSetValue(
                                      exoIdx,
                                      setIdx,
                                      "targetReps",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-center text-slate-900 font-bold text-xs"
                                />
                              )}
                            </td>

                            <td className="py-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSet(exoIdx, setIdx)}
                                className="p-1 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <button
                      type="button"
                      onClick={() => handleAddSet(exoIdx)}
                      className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ajouter une série
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Enregistrement en cours..." : "Enregistrer la Séance et l'Assigner à Reda"}</span>
          </button>
        </div>
      </form>

      {/* Exercise Modal */}
      <ExerciseSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectExercise={handleSelectExercise}
        exercises={allExercises}
      />
    </div>
  );
}

export default function NewRoutineBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
          Chargement du configurateur de séance...
        </div>
      }
    >
      <NewRoutineBuilderContent />
    </Suspense>
  );
}
