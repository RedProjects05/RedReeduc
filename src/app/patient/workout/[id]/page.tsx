"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  Clock,
  Dumbbell,
  Plus,
  Trash2,
  Check,
  HeartPulse,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import {
  ActiveWorkoutExercise,
  Exercise,
  LoggedSet,
  RPEEffort,
  WorkoutSession,
} from "@/lib/types";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";
import { RestTimerFloating } from "@/components/RestTimerFloating";
import { ExerciseSelectorModal } from "@/components/ExerciseSelectorModal";
import { WorkoutRecapModal } from "@/components/WorkoutRecapModal";
import { playSetCompleteSound } from "@/lib/audio";

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const routineId = params?.id as string;

  const {
    routines,
    activeUser,
    exercises: allExercises,
    saveWorkout,
    getPreviousPerformance,
  } = useRedReeducStore();

  const routine = useMemo(() => {
    return routines.find((r) => r.id === routineId);
  }, [routines, routineId]);

  // Workout state
  const [workoutTitle, setWorkoutTitle] = useState(
    routine ? routine.title : "Entraînement Libre"
  );
  const [activeExercises, setActiveExercises] = useState<ActiveWorkoutExercise[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Floating rest timer state
  const [restRemaining, setRestRemaining] = useState(0);
  const [restTotal, setRestTotal] = useState(60);
  const [isRestActive, setIsRestActive] = useState(false);
  const [currentRestExerciseName, setCurrentRestExerciseName] = useState<string | undefined>();

  // Modals
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);

  // Initialize exercises from routine or blank
  useEffect(() => {
    if (routine) {
      setWorkoutTitle(routine.title);
      const mapped: ActiveWorkoutExercise[] = routine.exercises.map((re) => {
        const sets: LoggedSet[] = re.targetSets.map((ts, idx) => {
          const prev = getPreviousPerformance(re.exerciseId, idx + 1);
          return {
            setNumber: ts.setNumber || idx + 1,
            type: ts.type || "normal",
            completed: false,
            previousSummary: prev || (ts.targetWeightKg ? `${ts.targetWeightKg}kg x ${ts.targetReps || 10}` : undefined),
            actualWeightKg: ts.targetWeightKg,
            actualReps: ts.targetReps,
            actualTimeSeconds: ts.targetTimeSeconds,
            actualDistanceKm: ts.targetDistanceKm,
            actualElasticLevel: ts.targetElasticLevel,
            laterality: ts.laterality || re.laterality,
          };
        });

        return {
          exerciseId: re.exerciseId,
          exercise: re.exercise,
          kineNotes: re.kineNotes,
          restSeconds: re.restSeconds,
          laterality: re.laterality,
          sets: sets.length > 0 ? sets : [
            {
              setNumber: 1,
              type: "normal",
              completed: false,
              actualWeightKg: 20,
              actualReps: 10,
            },
          ],
        };
      });
      setActiveExercises(mapped);
    } else if (routineId === "free") {
      setWorkoutTitle("Entraînement Libre");
      const defaultExo = allExercises[0];
      if (defaultExo) {
        setActiveExercises([
          {
            exerciseId: defaultExo.id,
            exercise: defaultExo,
            restSeconds: defaultExo.defaultRestSeconds || 60,
            sets: [
              { setNumber: 1, type: "normal", completed: false, actualWeightKg: 0, actualReps: 10 },
              { setNumber: 2, type: "normal", completed: false, actualWeightKg: 0, actualReps: 10 },
              { setNumber: 3, type: "normal", completed: false, actualWeightKg: 0, actualReps: 10 },
            ],
          },
        ]);
      }
    }
  }, [routine, routineId, allExercises, getPreviousPerformance]);

  // Live Workout duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Rest countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRestActive && restRemaining > 0) {
      timer = setInterval(() => {
        setRestRemaining((prev) => {
          if (prev <= 1) {
            setIsRestActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRestActive, restRemaining]);

  // Calculate live volume and sets
  const { totalVolume, completedSetsCount, totalSetsCount } = useMemo(() => {
    let volume = 0;
    let completed = 0;
    let total = 0;

    activeExercises.forEach((ae) => {
      ae.sets.forEach((s) => {
        total++;
        if (s.completed) {
          completed++;
          if (s.actualWeightKg && s.actualReps) {
            volume += s.actualWeightKg * s.actualReps;
          }
        }
      });
    });

    return { totalVolume: volume, completedSetsCount: completed, totalSetsCount: total };
  }, [activeExercises]);

  // Toggle set completion
  const handleToggleSet = (exerciseIndex: number, setIndex: number) => {
    setActiveExercises((prev) => {
      const updated = [...prev];
      const targetExo = { ...updated[exerciseIndex] };
      const targetSet = { ...targetExo.sets[setIndex] };
      const willBeCompleted = !targetSet.completed;

      targetSet.completed = willBeCompleted;
      targetExo.sets[setIndex] = targetSet;
      updated[exerciseIndex] = targetExo;

      if (willBeCompleted) {
        playSetCompleteSound();
        if (targetExo.restSeconds > 0) {
          setRestTotal(targetExo.restSeconds);
          setRestRemaining(targetExo.restSeconds);
          setIsRestActive(true);
          setCurrentRestExerciseName(targetExo.exercise.name);
        }
      }

      return updated;
    });
  };

  const handleUpdateSetField = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof LoggedSet,
    value: unknown
  ) => {
    setActiveExercises((prev) => {
      const updated = [...prev];
      const targetExo = { ...updated[exerciseIndex] };
      const targetSet = { ...targetExo.sets[setIndex], [field]: value };
      targetExo.sets[setIndex] = targetSet;
      updated[exerciseIndex] = targetExo;
      return updated;
    });
  };

  const handleAddSet = (exerciseIndex: number) => {
    setActiveExercises((prev) => {
      const updated = [...prev];
      const targetExo = { ...updated[exerciseIndex] };
      const lastSet = targetExo.sets[targetExo.sets.length - 1];

      const newSet: LoggedSet = {
        setNumber: targetExo.sets.length + 1,
        type: "normal",
        completed: false,
        actualWeightKg: lastSet?.actualWeightKg ?? 20,
        actualReps: lastSet?.actualReps ?? 10,
        actualTimeSeconds: lastSet?.actualTimeSeconds,
        actualDistanceKm: lastSet?.actualDistanceKm,
        actualElasticLevel: lastSet?.actualElasticLevel,
        previousSummary: lastSet?.previousSummary,
        laterality: targetExo.laterality,
      };

      targetExo.sets.push(newSet);
      updated[exerciseIndex] = targetExo;
      return updated;
    });
  };

  const handleRemoveExercise = (exerciseIndex: number) => {
    if (confirm("Supprimer cet exercice de la séance ?")) {
      setActiveExercises((prev) => prev.filter((_, idx) => idx !== exerciseIndex));
    }
  };

  const handleToggleRestDuration = (exerciseIndex: number) => {
    setActiveExercises((prev) => {
      const updated = [...prev];
      const targetExo = { ...updated[exerciseIndex] };
      const cycle = [0, 45, 60, 90, 120];
      const currentIdx = cycle.indexOf(targetExo.restSeconds);
      const nextDuration = cycle[(currentIdx + 1) % cycle.length];
      targetExo.restSeconds = nextDuration;
      updated[exerciseIndex] = targetExo;
      return updated;
    });
  };

  const handleSelectExerciseFromModal = (exo: Exercise) => {
    setActiveExercises((prev) => [
      ...prev,
      {
        exerciseId: exo.id,
        exercise: exo,
        restSeconds: exo.defaultRestSeconds || 60,
        kineNotes: exo.kineTips,
        sets: [
          { setNumber: 1, type: "normal", completed: false, actualWeightKg: 20, actualReps: 10 },
          { setNumber: 2, type: "normal", completed: false, actualWeightKg: 20, actualReps: 10 },
          { setNumber: 3, type: "normal", completed: false, actualWeightKg: 20, actualReps: 10 },
        ],
      },
    ]);
  };

  const handleConfirmFinish = async (recapData: {
    painLevel: number;
    rpeEffort: RPEEffort;
    feedback: string;
  }) => {
    setIsTimerRunning(false);
    setIsRestActive(false);

    const newSession: WorkoutSession = {
      id: `workout-${Date.now()}`,
      routineId: routine?.id,
      routineTitle: workoutTitle,
      patientId: activeUser.id,
      patientName: activeUser.name,
      kineId: activeUser.kineId || "kine-anais",
      startTime: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      totalVolumeKg: totalVolume,
      completedSetsCount,
      totalSetsCount,
      exercises: activeExercises,
      painLevel: recapData.painLevel,
      rpeEffort: recapData.rpeEffort,
      patientFeedback: recapData.feedback,
      isCompleted: true,
      createdAt: new Date().toISOString(),
    };

    await saveWorkout(newSession);
    setIsRecapModalOpen(false);
    router.push("/patient/history");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 min-h-screen">
      
      {/* Top Header - High Contrast Bright Hevy Look */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md pb-3 pt-2 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronDown className="w-5 h-5 text-slate-800" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {workoutTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRestActive(!isRestActive)}
              className="text-slate-500 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Chronomètre"
            >
              <Clock className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsRecapModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              Terminer
            </button>
          </div>
        </div>

        {/* Stats Row Under Header (Durée / Volume / Séries) */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100 text-left">
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Durée</span>
            <span className="text-sm font-black text-blue-600 font-mono">
              {elapsedSeconds < 60
                ? `${elapsedSeconds}s`
                : `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`}
            </span>
          </div>

          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Volume</span>
            <span className="text-sm font-black text-slate-900">
              {totalVolume} <span className="text-xs font-normal text-slate-500">kg</span>
            </span>
          </div>

          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Séries</span>
            <span className="text-sm font-black text-slate-900">
              {completedSetsCount} / {totalSetsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-4 mt-4 pb-28">
        {activeExercises.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs my-6">
            <Dumbbell className="w-10 h-10 text-blue-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Commencer l&apos;entraînement</h3>
            <p className="text-xs text-slate-500">
              Ajoutez un exercice pour débuter votre rééducation.
            </p>
            <button
              onClick={() => setIsExerciseSelectorOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Ajouter un Exercice
            </button>
          </div>
        ) : (
          activeExercises.map((activeExo, exoIdx) => {
            const isCardio = activeExo.exercise.trackingType === "distance_time";
            const isTimeOnly = activeExo.exercise.trackingType === "time";
            const isElastic = activeExo.exercise.trackingType === "elastic_reps";

            return (
              <div
                key={`${activeExo.exerciseId}-${exoIdx}`}
                className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3"
              >
                {/* Exercise Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <ExerciseThumbnail
                      category={activeExo.exercise.category}
                      iconName={activeExo.exercise.iconName}
                      className="w-11 h-11"
                      size={20}
                    />
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 text-base leading-snug truncate">
                        {activeExo.exercise.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                        <span>{activeExo.exercise.bodyPart}</span>
                        {activeExo.laterality && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600 font-bold">
                              {activeExo.laterality}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveExercise(exoIdx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                    title="Supprimer l'exercice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Kiné Instruction Alert */}
                {activeExo.kineNotes && (
                  <div className="bg-blue-50 border border-blue-200/80 rounded-2xl px-3.5 py-2.5 text-xs flex items-start gap-2.5">
                    <HeartPulse className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-blue-900">Consigne Kiné (Anaïs) : </span>
                      <span className="text-blue-800 font-medium">{activeExo.kineNotes}</span>
                    </div>
                  </div>
                )}

                {/* Rest Timer Toggle */}
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleRestDuration(exoIdx)}
                    className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Repos : {activeExo.restSeconds === 0 ? "DÉSACTIVÉ" : `${activeExo.restSeconds}s`}
                    </span>
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Ajuster (0s / 45s / 60s / 90s)
                  </span>
                </div>

                {/* Sets Table */}
                <div className="pt-1 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="pb-2 w-12 text-center">SÉRIE</th>
                        <th className="pb-2 text-center">PRÉCÉDENT</th>
                        <th className="pb-2 text-center">
                          {isCardio ? "KM" : isElastic ? "ÉLASTIQUE" : "KG"}
                        </th>
                        <th className="pb-2 text-center">
                          {isCardio ? "TEMPS" : isTimeOnly ? "TEMPS (S)" : "RÉPS"}
                        </th>
                        <th className="pb-2 w-12 text-center">
                          <Check className="w-4 h-4 mx-auto text-slate-400" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeExo.sets.map((set, setIdx) => {
                        const isSetDone = set.completed;

                        return (
                          <tr
                            key={setIdx}
                            className={`transition-colors ${
                              isSetDone ? "bg-emerald-50/60" : "hover:bg-slate-50"
                            }`}
                          >
                            {/* Set Number Badge */}
                            <td className="py-2.5 text-center">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                                  set.type === "warmup"
                                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                                    : "bg-slate-100 text-slate-800"
                                }`}
                              >
                                {set.type === "warmup" ? "W" : set.setNumber}
                              </span>
                            </td>

                            {/* Previous Performance Summary */}
                            <td className="py-2.5 text-center text-xs text-slate-500 font-medium">
                              {set.previousSummary || "-"}
                            </td>

                            {/* Column 3: KG / KM / Elastic */}
                            <td className="py-2.5 px-1.5 text-center">
                              {isCardio ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={set.actualDistanceKm ?? ""}
                                  placeholder="0"
                                  onChange={(e) =>
                                    handleUpdateSetField(
                                      exoIdx,
                                      setIdx,
                                      "actualDistanceKm",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 sm:w-20 bg-slate-50 border border-slate-200 rounded-xl py-1 px-2 text-center text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                                />
                              ) : isElastic ? (
                                <select
                                  value={set.actualElasticLevel || "Jaune (Léger - 5kg)"}
                                  onChange={(e) =>
                                    handleUpdateSetField(
                                      exoIdx,
                                      setIdx,
                                      "actualElasticLevel",
                                      e.target.value
                                    )
                                  }
                                  className="w-24 bg-slate-50 border border-slate-200 rounded-xl py-1 px-1 text-center text-slate-900 font-bold text-[11px] focus:outline-none focus:border-blue-600 focus:bg-white"
                                >
                                  <option value="Jaune (Léger - 5kg)">Jaune (5kg)</option>
                                  <option value="Rouge (Moyen - 10kg)">Rouge (10kg)</option>
                                  <option value="Vert (Fort - 15kg)">Vert (15kg)</option>
                                  <option value="Bleu (Très fort - 20kg)">Bleu (20kg)</option>
                                  <option value="Noir (Maximal - 25kg)">Noir (25kg)</option>
                                </select>
                              ) : isTimeOnly ? (
                                <span className="text-xs text-slate-400 font-medium">-</span>
                              ) : (
                                <input
                                  type="number"
                                  step="0.5"
                                  value={set.actualWeightKg ?? ""}
                                  placeholder="0"
                                  onChange={(e) =>
                                    handleUpdateSetField(
                                      exoIdx,
                                      setIdx,
                                      "actualWeightKg",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 sm:w-20 bg-slate-50 border border-slate-200 rounded-xl py-1 px-2 text-center text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                                />
                              )}
                            </td>

                            {/* Column 4: REPS / TIME */}
                            <td className="py-2.5 px-1.5 text-center">
                              {isTimeOnly ? (
                                <input
                                  type="number"
                                  step="5"
                                  value={set.actualTimeSeconds ?? ""}
                                  placeholder="30"
                                  onChange={(e) =>
                                    handleUpdateSetField(
                                      exoIdx,
                                      setIdx,
                                      "actualTimeSeconds",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 sm:w-20 bg-slate-50 border border-slate-200 rounded-xl py-1 px-2 text-center text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                                />
                              ) : (
                                <input
                                  type="number"
                                  step="1"
                                  value={set.actualReps ?? ""}
                                  placeholder="10"
                                  onChange={(e) =>
                                    handleUpdateSetField(
                                      exoIdx,
                                      setIdx,
                                      "actualReps",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 sm:w-20 bg-slate-50 border border-slate-200 rounded-xl py-1 px-2 text-center text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                                />
                              )}
                            </td>

                            {/* Column 5: Checkbox Button (Turns bright green) */}
                            <td className="py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleSet(exoIdx, setIdx)}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all mx-auto cursor-pointer ${
                                  isSetDone
                                    ? "bg-emerald-500 text-white font-black shadow-md shadow-emerald-500/30 scale-105"
                                    : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 border border-slate-200"
                                }`}
                              >
                                <Check
                                  className={`w-4 h-4 transition-transform ${
                                    isSetDone ? "scale-110 stroke-[3]" : "stroke-[2]"
                                  }`}
                                />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Add Set Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddSet(exoIdx)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ajouter une Série</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Global Bottom Actions */}
        <div className="pt-2 space-y-3 text-center">
          <button
            type="button"
            onClick={() => setIsExerciseSelectorOpen(true)}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Exercice</span>
          </button>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => alert("Paramètres de séance : sons Web Audio activés, minuteur automatique.")}
              className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Paramètres
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir abandonner cet entraînement ?")) {
                  router.push("/patient");
                }
              }}
              className="flex-1 py-2.5 bg-white hover:bg-red-50 text-xs font-bold text-red-600 rounded-xl border border-red-200 transition-colors cursor-pointer"
            >
              Abandonner l&apos;Entraînement
            </button>
          </div>
        </div>
      </div>

      {/* Floating Rest Timer */}
      <RestTimerFloating
        remainingSeconds={restRemaining}
        totalDuration={restTotal}
        isActive={isRestActive}
        onAdjustTime={(delta) =>
          setRestRemaining((prev) => Math.max(0, prev + delta))
        }
        onSkip={() => setIsRestActive(false)}
        exerciseName={currentRestExerciseName}
      />

      {/* Exercise Selector Modal */}
      <ExerciseSelectorModal
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        onSelectExercise={handleSelectExerciseFromModal}
        exercises={allExercises}
      />

      {/* Workout Finish Recap Modal */}
      <WorkoutRecapModal
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        onConfirmSave={handleConfirmFinish}
        durationSeconds={elapsedSeconds}
        totalVolumeKg={totalVolume}
        completedSetsCount={completedSetsCount}
        totalSetsCount={totalSetsCount}
        exercisesCount={activeExercises.length}
        kineName="Anaïs"
      />
    </div>
  );
}
