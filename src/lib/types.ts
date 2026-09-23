export type UserRole = "KINE" | "PATIENT";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  // Patient-specific fields
  diagnosis?: string;
  medicalHistory?: string;
  targetGoals?: string;
  kineId?: string;
  // Kiné-specific fields
  clinicName?: string;
}

export type ExerciseCategory =
  | "Genou"
  | "Épaule"
  | "Dos & Tronc"
  | "Cheville & Pied"
  | "Hanche"
  | "Bras"
  | "Pectoraux & Dos"
  | "Cardio & Échauffement"
  | "Mobilité & Étirement";

export type TrackingType =
  | "weight_reps"       // kg + reps (standard musculation/charge)
  | "reps_only"         // reps au poids de corps
  | "time"              // secondes (gainage, étirement, proprioception)
  | "distance_time"     // km + mm:ss (tapis de course, vélo)
  | "elastic_reps";     // résistance élastique + reps

export type ElasticLevel =
  | "Jaune (Léger - 5kg)"
  | "Rouge (Moyen - 10kg)"
  | "Vert (Fort - 15kg)"
  | "Bleu (Très fort - 20kg)"
  | "Noir (Maximal - 25kg)";

export type Laterality = "Bilatéral" | "Côté Droit" | "Côté Gauche";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  bodyPart: string;
  equipment: string;
  trackingType: TrackingType;
  defaultRestSeconds: number;
  instructions: string;
  kineTips?: string;
  isCustom?: boolean;
  iconName?: string;
}

export interface TargetSet {
  setNumber: number;
  type: "normal" | "warmup" | "drop";
  targetWeightKg?: number;
  targetReps?: number;
  targetTimeSeconds?: number;
  targetDistanceKm?: number;
  targetElasticLevel?: ElasticLevel;
  laterality?: Laterality;
  targetRpe?: number;
}

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  order: number;
  restSeconds: number;
  kineNotes?: string;
  laterality?: Laterality;
  targetSets: TargetSet[];
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  createdByKineId: string;
  assignedToPatientId?: string;
  exercises: RoutineExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface LoggedSet {
  setNumber: number;
  type: "normal" | "warmup" | "drop";
  completed: boolean;
  previousSummary?: string;
  actualWeightKg?: number;
  actualReps?: number;
  actualTimeSeconds?: number;
  actualDistanceKm?: number;
  actualElasticLevel?: ElasticLevel;
  laterality?: Laterality;
}

export interface ActiveWorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  kineNotes?: string;
  restSeconds: number;
  laterality?: Laterality;
  sets: LoggedSet[];
}

export type RPEEffort =
  | "Très facile (1-2)"
  | "Modéré (3-4)"
  | "Difficile (5-7)"
  | "Très dur (8-9)"
  | "Effort maximal (10)";

export interface WorkoutSession {
  id: string;
  routineId?: string;
  routineTitle: string;
  patientId: string;
  patientName: string;
  kineId: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  totalVolumeKg: number;
  completedSetsCount: number;
  totalSetsCount: number;
  exercises: ActiveWorkoutExercise[];
  // Rehab metrics
  painLevel?: number; // EVA 0 to 10
  painLocation?: string;
  rpeEffort?: RPEEffort;
  patientFeedback?: string;
  kineComment?: string;
  sharedWithKine?: boolean; // True if shared with kiné, false if saved privately
  isCompleted: boolean;
  createdAt: string;
}

export interface LiveWorkoutState {
  routineId?: string;
  workoutTitle: string;
  activeExercises: ActiveWorkoutExercise[];
  elapsedSeconds: number;
  startTime: string;
  lastUpdatedTime: number;
  isRestActive?: boolean;
  restRemaining?: number;
  restTotal?: number;
}

export interface WorkoutSettings {
  soundEnabled: boolean;
  restTimerAutoStart: boolean;
  defaultRestSeconds: number;
  hapticsEnabled: boolean;
  keepScreenAwake: boolean;
}

