"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ChevronDown,
  Clock,
  Dumbbell,
  MoreVertical,
  Plus,
  Trash2,
  Undo2,
  Check,
  User,
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
import { formatSeconds } from "@/lib/utils";
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
      // Default to 1-2 standard exercises if starting fresh
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

  // Toggle set completion (Hevy UX: plays sound, turns green, triggers rest countdown)
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
        // Trigger rest timer if restSeconds > 0
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

  // Update set field (Weight, Reps, Time, Distance, Elastic)
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

  // Add set to exercise
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

  // Remove set
  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    setActiveExercises((prev) => {
      const updated = [...prev];
      const targetExo = { ...updated[exerciseIndex] };
      targetExo.sets.splice(setIndex, 1);
      // Re-number sets
      targetExo.sets = targetExo.sets.map((s, idx) => ({
        ...s,
        setNumber: idx + 1,
      }));
      updated[exerciseIndex] = targetExo;
      return updated;
    });
  };

  // Delete entire exercise
  const handleRemoveExercise = (exerciseIndex: number) => {
    if (confirm("Supprimer cet exercice de la séance ?")) {
      setActiveExercises((prev) => prev.filter((_, idx) => idx !== exerciseIndex));
    }
  };

  // Toggle rest duration for exercise
  const handleToggleRestDuration = (exerciseIndex: number) => {
    setActiveExercises((prev) => {
      const updated = [...prev];
      const targetExo = { ...updated[exerciseIndex] };
      // Cycle: 0s -> 45s -> 60s -> 90s -> 120s -> 0s
      const cycle = [0, 45, 60, 90, 120];
      const currentIdx = cycle.indexOf(targetExo.restSeconds);
      const nextDuration = cycle[(currentIdx + 1) % cycle.length];
      targetExo.restSeconds = nextDuration;
      updated[exerciseIndex] = targetExo;
      return updated;
    });
  };

  // Add exercise from modal
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

  // Finish Workout & Confirm Save
  const handleConfirmFinish = (recapData: {
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
      kineId: activeUser.kineId || "kine-1",
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

    saveWorkout(newSession);
    setIsRecapModalOpen(false);
    router.push("/patient/history");
  };

  return (
    <div className="max-w-2xl mx-auto px-3 py-3 min-h-screen">
      
      {/* Top Header - Exact Hevy Look */}
      <div className="sticky top-16 z-30 bg-[#0b0d13]/95 backdrop-blur-md pb-2 pt-1 border-b border-[#1b2234]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <ChevronDown className="w-5 h-5 text-white" />
            <h1 className="text-xl font-black text-white tracking-tight">
              {workoutTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRestActive(!isRestActive)}
              className="text-[#8F9BB3] hover:text-white p-1 rounded-lg transition-colors"
              title="Chronomètre"
            >
              <Clock className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsRecapModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-blue-600/30 active:scale-95 cursor-pointer"
            >
              Terminer
            </button>
          </div>
        </div>

        {/* Stats Row Under Header (Durée / Volume / Séries) */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#1a2133] text-left">
          <div>
            <span className="block text-[11px] font-semibold text-[#8F9BB3]">Durée</span>
            <span className="text-sm font-black text-blue-400 font-mono">
              {elapsedSeconds < 60
                ? `${elapsedSeconds}s`
                : `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-[#8F9BB3]">Volume</span>
            <span className="text-sm font-black text-white">
              {totalVolume} <span className="text-xs font-normal text-[#8F9BB3]">kg</span>
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-[#8F9BB3]">Séries</span>
            <span className="text-sm font-black text-white">
              {completedSetsCount} / {totalSetsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Exercise Cards Container */}
      <div className="space-y-4 mt-4 pb-28">
        {activeExercises.length === 0 ? (
          <div className="bg-[#121622] border border-[#202738] rounded-2xl p-8 text-center space-y-3 my-6">
            <Dumbbell className="w-10 h-10 text-blue-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Commencer l&apos;entraînement</h3>
            <p className="text-xs text-[#8F9BB3]">
              Ajoutez un exercice pour débuter votre rééducation.
            </p>
            <button
              onClick={() => setIsExerciseSelectorOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
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
                className="bg-[#121622] border border-[#202738] rounded-2xl p-4 shadow-sm space-y-3"
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
                      <h3 className="font-extrabold text-blue-400 text-base leading-snug truncate hover:underline cursor-pointer">
                        {activeExo.exercise.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-[#8F9BB3] mt-0.5">
                        <span>{activeExo.exercise.bodyPart}</span>
                        {activeExo.laterality && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">
                              {activeExo.laterality}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Dropdown */}
                  <button
                    onClick={() => handleRemoveExercise(exoIdx)}
                    className="p-1 text-[#8F9BB3] hover:text-red-400 rounded-lg transition-colors"
                    title="Supprimer l'exercice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Kiné Instruction Alert if present */}
                {activeExo.kineNotes && (
                  <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl px-3 py-2 text-xs flex items-start gap-2">
                    <HeartPulse className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-blue-300">Consigne Kiné : </span>
                      <span className="text-slate-300">{activeExo.kineNotes}</span>
                    </div>
                  </div>
                )}

                {/* Rest Timer Switcher Pill */}
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleRestDuration(exoIdx)}
                    className="inline-flex items-center gap-1.5 font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/30 px-2.5 py-1 rounded-lg border border-blue-800/30 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Repos : {activeExo.restSeconds === 0 ? "DÉSACTIVÉ" : `${activeExo.restSeconds}s`}
                    </span>
                  </button>
                  <span className="text-[11px] text-[#8F9BB3]">
                    Cliquez pour ajuster (0s / 45s / 60s / 90s)
                  </span>
                </div>

                {/* Sets Table - EXACT HEVY TABLE STRUCTURE */}
                <div className="pt-1">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[11px] font-bold uppercase tracking-wider text-[#8F9BB3] border-b border-[#1b2234]">
                        <th className="pb-2 w-12 text-center">SÉRIE</th>
                        <th className="pb-2 text-center">PRÉCÉDENT</th>
                        <th className="pb-2 text-center">
                          {isCardio ? "KM" : isElastic ? "ÉLASTIQUE" : "KG"}
                        </th>
                        <th className="pb-2 text-center">
                          {isCardio ? "TEMPS" : isTimeOnly ? "TEMPS (S)" : "RÉPS"}
                        </th>
                        <th className="pb-2 w-12 text-center">
                          <Check className="w-4 h-4 mx-auto text-[#8F9BB3]" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#182030]">
                      {activeExo.sets.map((set, setIdx) => {
                        const isSetDone = set.completed;

                        return (
                          <tr
                            key={setIdx}
                            className={`transition-colors ${
                              isSetDone ? "bg-[#10b981]/10" : "hover:bg-[#151a26]"
                            }`}
                          >
                            {/* Set Number Badge */}
                            <td className="py-2.5 text-center">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                                  set.type === "warmup"
                                    ? "bg-amber-950 text-amber-300 border border-amber-700"
                                    : "bg-[#1e273a] text-white"
                                }`}
                              >
                                {set.type === "warmup" ? "W" : set.setNumber}
                              </span>
                            </td>

                            {/* Previous Performance Summary */}
                            <td className="py-2.5 text-center text-xs text-[#8F9BB3] font-medium">
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
                                  className="w-16 sm:w-20 bg-[#182030] border border-[#273248] rounded-lg py-1 px-2 text-center text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-blue-500"
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
                                  className="w-24 bg-[#182030] border border-[#273248] rounded-lg py-1 px-1 text-center text-white font-medium text-[11px] focus:outline-none focus:border-blue-500"
                                >
                                  <option value="Jaune (Léger - 5kg)">Jaune (5kg)</option>
                                  <option value="Rouge (Moyen - 10kg)">Rouge (10kg)</option>
                                  <option value="Vert (Fort - 15kg)">Vert (15kg)</option>
                                  <option value="Bleu (Très fort - 20kg)">Bleu (20kg)</option>
                                  <option value="Noir (Maximal - 25kg)">Noir (25kg)</option>
                                </select>
                              ) : isTimeOnly ? (
                                <span className="text-xs text-[#8F9BB3]">-</span>
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
                                  className="w-16 sm:w-20 bg-[#182030] border border-[#273248] rounded-lg py-1 px-2 text-center text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-blue-500"
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
                                  className="w-16 sm:w-20 bg-[#182030] border border-[#273248] rounded-lg py-1 px-2 text-center text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-blue-500"
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
                                  className="w-16 sm:w-20 bg-[#182030] border border-[#273248] rounded-lg py-1 px-2 text-center text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                                />
                              )}
                            </td>

                            {/* Column 5: Checkbox Button (Turns bright green) */}
                            <td className="py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleSet(exoIdx, setIdx)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all mx-auto cursor-pointer ${
                                  isSetDone
                                    ? "bg-[#00d084] text-black font-black shadow-md shadow-[#00d084]/40 scale-105"
                                    : "bg-[#1b2234] text-[#4e5d7a] hover:bg-[#232c42] hover:text-white"
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
                    className="w-full py-2 bg-[#182030] hover:bg-[#20293d] border border-[#273248] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ajouter une Série</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Global Bottom Actions (Hevy style) */}
        <div className="pt-2 space-y-3 text-center">
          <button
            type="button"
            onClick={() => setIsExerciseSelectorOpen(true)}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Exercice</span>
          </button>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => alert("Paramètres de séance : sons activés, timer automatique.")}
              className="flex-1 py-2.5 bg-[#141926] hover:bg-[#1c2335] text-xs font-bold text-[#8F9BB3] hover:text-white rounded-xl border border-[#232b3e] transition-colors"
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
              className="flex-1 py-2.5 bg-[#141926] hover:bg-red-950/40 text-xs font-bold text-red-400 hover:text-red-300 rounded-xl border border-red-900/30 transition-colors"
            >
              Abandonner l&apos;Entraînement
            </button>
          </div>
        </div>
      </div>

      {/* Floating Rest Timer Pill */}
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

      {/* Workout Finish & Recap Modal */}
      <WorkoutRecapModal
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        onConfirmSave={handleConfirmFinish}
        durationSeconds={elapsedSeconds}
        totalVolumeKg={totalVolume}
        completedSetsCount={completedSetsCount}
        totalSetsCount={totalSetsCount}
        exercisesCount={activeExercises.length}
        kineName="Dr. Alexandre Dupont"
      />
    </div>
  );
}
