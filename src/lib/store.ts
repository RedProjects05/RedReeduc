"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_EXERCISES,
  DEFAULT_ROUTINES,
  DEFAULT_USERS,
  DEFAULT_WORKOUT_HISTORY,
} from "./default-data";
import { Exercise, Routine, UserProfile, WorkoutSession } from "./types";

const STORAGE_KEYS = {
  USERS: "redreeduc_users_v1",
  ACTIVE_USER_ID: "redreeduc_active_user_v1",
  EXERCISES: "redreeduc_exercises_v1",
  ROUTINES: "redreeduc_routines_v1",
  WORKOUTS: "redreeduc_workouts_v1",
};

// In-memory fallback
let memoryState = {
  users: DEFAULT_USERS,
  activeUserId: "patient-1", // default as patient to test Hevy live workout directly!
  exercises: DEFAULT_EXERCISES,
  routines: DEFAULT_ROUTINES,
  workouts: DEFAULT_WORKOUT_HISTORY,
};

// Dispatch storage event so all hooks update reactively
function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("redreeduc_store_updated"));
  }
}

export const RedReeducStore = {
  // --- USERS & AUTH ---
  getUsers(): UserProfile[] {
    if (typeof window === "undefined") return memoryState.users;
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USERS;
    }
  },

  getActiveUserId(): string {
    if (typeof window === "undefined") return memoryState.activeUserId;
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID) || "patient-1";
  },

  getActiveUser(): UserProfile {
    const users = this.getUsers();
    const activeId = this.getActiveUserId();
    return users.find((u) => u.id === activeId) || users[1] || users[0];
  },

  setActiveUserId(id: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
    }
    memoryState.activeUserId = id;
    notifyChange();
  },

  getPatientsForKine(kineId: string): UserProfile[] {
    return this.getUsers().filter((u) => u.role === "PATIENT" && (u.kineId === kineId || !u.kineId));
  },

  // --- EXERCISES ---
  getExercises(): Exercise[] {
    if (typeof window === "undefined") return memoryState.exercises;
    const raw = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(DEFAULT_EXERCISES));
      return DEFAULT_EXERCISES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_EXERCISES;
    }
  },

  addCustomExercise(newExo: Omit<Exercise, "id">): Exercise {
    const exercises = this.getExercises();
    const id = `custom-exo-${Date.now()}`;
    const exercise: Exercise = {
      ...newExo,
      id,
      isCustom: true,
    };
    const updated = [exercise, ...exercises];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(updated));
    }
    memoryState.exercises = updated;
    notifyChange();
    return exercise;
  },

  // --- ROUTINES / SEANCES ---
  getRoutines(): Routine[] {
    if (typeof window === "undefined") return memoryState.routines;
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(DEFAULT_ROUTINES));
      return DEFAULT_ROUTINES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_ROUTINES;
    }
  },

  getRoutineById(id: string): Routine | undefined {
    return this.getRoutines().find((r) => r.id === id);
  },

  saveRoutine(routine: Routine) {
    const routines = this.getRoutines();
    const index = routines.findIndex((r) => r.id === routine.id);
    let updated: Routine[];
    if (index >= 0) {
      updated = [...routines];
      updated[index] = { ...routine, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        {
          ...routine,
          id: routine.id || `routine-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...routines,
      ];
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(updated));
    }
    memoryState.routines = updated;
    notifyChange();
  },

  deleteRoutine(id: string) {
    const updated = this.getRoutines().filter((r) => r.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(updated));
    }
    memoryState.routines = updated;
    notifyChange();
  },

  // --- WORKOUTS / SESSIONS REALISÉES ---
  getWorkouts(): WorkoutSession[] {
    if (typeof window === "undefined") return memoryState.workouts;
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(DEFAULT_WORKOUT_HISTORY));
      return DEFAULT_WORKOUT_HISTORY;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_WORKOUT_HISTORY;
    }
  },

  getWorkoutById(id: string): WorkoutSession | undefined {
    return this.getWorkouts().find((w) => w.id === id);
  },

  saveWorkout(workout: WorkoutSession) {
    const workouts = this.getWorkouts();
    const index = workouts.findIndex((w) => w.id === workout.id);
    let updated: WorkoutSession[];
    if (index >= 0) {
      updated = [...workouts];
      updated[index] = workout;
    } else {
      updated = [workout, ...workouts];
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated));
    }
    memoryState.workouts = updated;
    notifyChange();
  },

  // Helper: Find previous set performance for an exercise
  getPreviousPerformance(exerciseId: string, setNumber: number): string | null {
    const workouts = this.getWorkouts().filter((w) => w.isCompleted);
    // Scan most recent sessions first
    for (const session of workouts) {
      const exEntry = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (exEntry) {
        const setMatch = exEntry.sets.find((s) => s.setNumber === setNumber && s.completed);
        if (setMatch) {
          if (setMatch.actualWeightKg !== undefined && setMatch.actualReps !== undefined) {
            return `${setMatch.actualWeightKg}kg x ${setMatch.actualReps}`;
          }
          if (setMatch.actualDistanceKm !== undefined && setMatch.actualTimeSeconds !== undefined) {
            const mins = Math.floor(setMatch.actualTimeSeconds / 60);
            const secs = setMatch.actualTimeSeconds % 60;
            return `${setMatch.actualDistanceKm} km en ${mins}:${secs.toString().padStart(2, "0")}`;
          }
          if (setMatch.actualTimeSeconds !== undefined) {
            return `${setMatch.actualTimeSeconds}s`;
          }
          if (setMatch.actualReps !== undefined) {
            return `${setMatch.actualReps} réps`;
          }
          if (setMatch.actualElasticLevel) {
            return `${setMatch.actualElasticLevel.split(" ")[0]} x ${setMatch.actualReps || 10}`;
          }
        }
      }
    }
    return null;
  },

  resetToDefaults() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.EXERCISES);
      localStorage.removeItem(STORAGE_KEYS.ROUTINES);
      localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    }
    memoryState = {
      users: DEFAULT_USERS,
      activeUserId: "patient-1",
      exercises: DEFAULT_EXERCISES,
      routines: DEFAULT_ROUTINES,
      workouts: DEFAULT_WORKOUT_HISTORY,
    };
    notifyChange();
  },
};

// React hook for component re-rendering on store change
export function useRedReeducStore() {
  const [timestamp, setTimestamp] = useState(() => Date.now());

  useEffect(() => {
    const handler = () => setTimestamp(Date.now());
    window.addEventListener("redreeduc_store_updated", handler);
    return () => window.removeEventListener("redreeduc_store_updated", handler);
  }, []);

  return {
    timestamp,
    activeUser: RedReeducStore.getActiveUser(),
    activeUserId: RedReeducStore.getActiveUserId(),
    users: RedReeducStore.getUsers(),
    exercises: RedReeducStore.getExercises(),
    routines: RedReeducStore.getRoutines(),
    workouts: RedReeducStore.getWorkouts(),
    setActiveUserId: (id: string) => RedReeducStore.setActiveUserId(id),
    saveRoutine: (r: Routine) => RedReeducStore.saveRoutine(r),
    deleteRoutine: (id: string) => RedReeducStore.deleteRoutine(id),
    saveWorkout: (w: WorkoutSession) => RedReeducStore.saveWorkout(w),
    addCustomExercise: (e: Omit<Exercise, "id">) => RedReeducStore.addCustomExercise(e),
    getPreviousPerformance: (exoId: string, setNum: number) =>
      RedReeducStore.getPreviousPerformance(exoId, setNum),
    resetToDefaults: () => RedReeducStore.resetToDefaults(),
  };
}
