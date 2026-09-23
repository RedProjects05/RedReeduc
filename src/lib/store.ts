"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_EXERCISES,
  DEFAULT_ROUTINES,
  DEFAULT_USERS,
  DEFAULT_WORKOUT_HISTORY,
} from "./default-data";
import { Exercise, Routine, UserProfile, WorkoutSession, LiveWorkoutState, WorkoutSettings } from "./types";

const STORAGE_KEYS = {
  USERS: "redreeduc_users_v2",
  ACTIVE_USER_ID: "redreeduc_active_user_v2",
  EXERCISES: "redreeduc_exercises_v2",
  ROUTINES: "redreeduc_routines_v2",
  WORKOUTS: "redreeduc_workouts_v2",
  ACTIVE_WORKOUT: "redreeduc_active_workout_v2",
  SETTINGS: "redreeduc_workout_settings_v2",
};

export const DEFAULT_WORKOUT_SETTINGS: WorkoutSettings = {
  soundEnabled: true,
  restTimerAutoStart: true,
  defaultRestSeconds: 60,
  hapticsEnabled: true,
  keepScreenAwake: true,
};

let memoryState = {
  users: DEFAULT_USERS,
  activeUserId: "patient-reda", // Default is Reda!
  exercises: DEFAULT_EXERCISES,
  routines: DEFAULT_ROUTINES,
  workouts: DEFAULT_WORKOUT_HISTORY,
  activeLiveWorkout: null as LiveWorkoutState | null,
  workoutSettings: DEFAULT_WORKOUT_SETTINGS,
};

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("redreeduc_store_updated"));
  }
}

export const RedReeducStore = {
  // Sync with Cloud Neon PostgreSQL API in background
  async syncFromCloud() {
    if (typeof window === "undefined") return;
    try {
      // 1. Trigger DB init check
      fetch("/api/db/init").catch(() => {});

      // 2. Fetch Users
      const usersRes = await fetch("/api/users");
      if (usersRes.ok) {
        const cloudUsers = await usersRes.json();
        if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
          this.setUsers(cloudUsers);
        }
      }

      // 3. Fetch Routines
      const routinesRes = await fetch("/api/routines");
      if (routinesRes.ok) {
        const cloudRoutines = await routinesRes.json();
        if (Array.isArray(cloudRoutines)) {
          this.setRoutines(cloudRoutines);
        }
      }

      // 4. Fetch Workouts
      const workoutsRes = await fetch("/api/workouts");
      if (workoutsRes.ok) {
        const cloudWorkouts = await workoutsRes.json();
        if (Array.isArray(cloudWorkouts)) {
          this.setWorkouts(cloudWorkouts);
        }
      }

      // 5. Fetch Exercises
      const exercisesRes = await fetch("/api/exercises");
      if (exercisesRes.ok) {
        const cloudExercises = await exercisesRes.json();
        if (Array.isArray(cloudExercises) && cloudExercises.length > 0) {
          this.setExercises(cloudExercises);
        }
      }
    } catch (err) {
      console.debug("Cloud sync fallback:", err);
    }
  },

  // --- USERS ---
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

  setUsers(users: UserProfile[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    memoryState.users = users;
    notifyChange();
  },

  getActiveUserId(): string {
    if (typeof window === "undefined") return memoryState.activeUserId;
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID) || "patient-reda";
  },

  getActiveUser(): UserProfile {
    const users = this.getUsers();
    const activeId = this.getActiveUserId();
    return (
      users.find((u) => u.id === activeId) ||
      users.find((u) => u.role === "PATIENT") ||
      users[0] ||
      DEFAULT_USERS[1]
    );
  },

  setActiveUserId(id: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
    }
    memoryState.activeUserId = id;
    notifyChange();
  },

  async updateUserProfile(
    userId: string,
    data: { diagnosis?: string; medicalHistory?: string; targetGoals?: string }
  ) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index >= 0) {
      users[index] = { ...users[index], ...data };
      this.setUsers(users);
    }

    // Sync to Cloud
    try {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, ...data }),
      });
    } catch (e) {
      console.debug("Error saving user profile to cloud:", e);
    }
  },

  getPatientsForKine(kineId: string): UserProfile[] {
    return this.getUsers().filter(
      (u) => u.role === "PATIENT" && (u.kineId === kineId || !u.kineId)
    );
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

  setExercises(exercises: Exercise[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    }
    memoryState.exercises = exercises;
    notifyChange();
  },

  async addCustomExercise(newExo: Omit<Exercise, "id">): Promise<Exercise> {
    const exercises = this.getExercises();
    const id = `custom-exo-${Date.now()}`;
    const exercise: Exercise = {
      ...newExo,
      id,
      isCustom: true,
    };
    const updated = [exercise, ...exercises];
    this.setExercises(updated);

    // Sync to cloud
    try {
      await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });
    } catch (e) {
      console.debug("Cloud exo sync error:", e);
    }

    return exercise;
  },

  // --- ROUTINES ---
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

  setRoutines(routines: Routine[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
    }
    memoryState.routines = routines;
    notifyChange();
  },

  getRoutineById(id: string): Routine | undefined {
    return this.getRoutines().find((r) => r.id === id);
  },

  async saveRoutine(routine: Routine) {
    const routines = this.getRoutines();
    const index = routines.findIndex((r) => r.id === routine.id);
    let updated: Routine[];
    const targetRoutine: Routine = {
      ...routine,
      id: routine.id || `routine-${Date.now()}`,
      createdAt: routine.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      updated = [...routines];
      updated[index] = targetRoutine;
    } else {
      updated = [targetRoutine, ...routines];
    }
    this.setRoutines(updated);

    // Sync to Cloud Neon Postgres
    try {
      await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetRoutine),
      });
    } catch (e) {
      console.debug("Cloud routine sync error:", e);
    }
  },

  async deleteRoutine(id: string) {
    const updated = this.getRoutines().filter((r) => r.id !== id);
    this.setRoutines(updated);

    try {
      await fetch(`/api/routines?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.debug("Cloud routine delete error:", e);
    }
  },

  // --- WORKOUTS ---
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

  setWorkouts(workouts: WorkoutSession[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    }
    memoryState.workouts = workouts;
    notifyChange();
  },

  async saveWorkout(workout: WorkoutSession) {
    const workouts = this.getWorkouts();
    const index = workouts.findIndex((w) => w.id === workout.id);
    let updated: WorkoutSession[];
    if (index >= 0) {
      updated = [...workouts];
      updated[index] = workout;
    } else {
      updated = [workout, ...workouts];
    }
    this.setWorkouts(updated);

    // Sync to Cloud Neon Postgres
    try {
      await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout),
      });
    } catch (e) {
      console.debug("Cloud workout save error:", e);
    }
  },

  async sendKineComment(workoutId: string, comment: string) {
    const workouts = this.getWorkouts();
    const index = workouts.findIndex((w) => w.id === workoutId);
    if (index >= 0) {
      workouts[index] = { ...workouts[index], kineComment: comment };
      this.setWorkouts(workouts);
    }

    try {
      await fetch("/api/workouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: workoutId, kineComment: comment }),
      });
    } catch (e) {
      console.debug("Cloud workout comment error:", e);
    }
  },

  getPreviousPerformance(exerciseId: string, setNumber: number): string | null {
    const workouts = this.getWorkouts().filter((w) => w.isCompleted);
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

  async deleteWorkout(id: string) {
    const workouts = this.getWorkouts().filter((w) => w.id !== id);
    this.setWorkouts(workouts);

    try {
      await fetch(`/api/workouts?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.debug("Cloud workout delete error:", e);
    }
  },

  // --- ACTIVE LIVE WORKOUT (Background persistence) ---
  getActiveLiveWorkout(): LiveWorkoutState | null {
    if (typeof window === "undefined") return memoryState.activeLiveWorkout;
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    if (!raw) return memoryState.activeLiveWorkout;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setActiveLiveWorkout(live: LiveWorkoutState | null) {
    if (typeof window !== "undefined") {
      if (live) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(live));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      }
    }
    memoryState.activeLiveWorkout = live;
    notifyChange();
  },

  // --- WORKOUT SETTINGS ---
  getWorkoutSettings(): WorkoutSettings {
    if (typeof window === "undefined") return memoryState.workoutSettings;
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_WORKOUT_SETTINGS;
    try {
      return { ...DEFAULT_WORKOUT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_WORKOUT_SETTINGS;
    }
  },

  setWorkoutSettings(settings: WorkoutSettings) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
    memoryState.workoutSettings = settings;
    notifyChange();
  },

  resetToDefaults() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.EXERCISES);
      localStorage.removeItem(STORAGE_KEYS.ROUTINES);
      localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    }
    memoryState = {
      users: DEFAULT_USERS,
      activeUserId: "patient-reda",
      exercises: DEFAULT_EXERCISES,
      routines: DEFAULT_ROUTINES,
      workouts: DEFAULT_WORKOUT_HISTORY,
      activeLiveWorkout: null,
      workoutSettings: DEFAULT_WORKOUT_SETTINGS,
    };
    notifyChange();
  },
};

export function useRedReeducStore() {
  const [timestamp, setTimestamp] = useState(() => Date.now());

  useEffect(() => {
    // Trigger initial cloud sync when mounted
    RedReeducStore.syncFromCloud();

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
    activeLiveWorkout: RedReeducStore.getActiveLiveWorkout(),
    workoutSettings: RedReeducStore.getWorkoutSettings(),
    setActiveUserId: (id: string) => RedReeducStore.setActiveUserId(id),
    updateUserProfile: (
      userId: string,
      data: { diagnosis?: string; medicalHistory?: string; targetGoals?: string }
    ) => RedReeducStore.updateUserProfile(userId, data),
    saveRoutine: (r: Routine) => RedReeducStore.saveRoutine(r),
    deleteRoutine: (id: string) => RedReeducStore.deleteRoutine(id),
    saveWorkout: (w: WorkoutSession) => RedReeducStore.saveWorkout(w),
    deleteWorkout: (id: string) => RedReeducStore.deleteWorkout(id),
    setActiveLiveWorkout: (w: LiveWorkoutState | null) => RedReeducStore.setActiveLiveWorkout(w),
    setWorkoutSettings: (s: WorkoutSettings) => RedReeducStore.setWorkoutSettings(s),
    sendKineComment: (wId: string, comment: string) =>
      RedReeducStore.sendKineComment(wId, comment),
    addCustomExercise: (e: Omit<Exercise, "id">) => RedReeducStore.addCustomExercise(e),
    getPreviousPerformance: (exoId: string, setNum: number) =>
      RedReeducStore.getPreviousPerformance(exoId, setNum),
    resetToDefaults: () => RedReeducStore.resetToDefaults(),
    syncFromCloud: () => RedReeducStore.syncFromCloud(),
  };
}
