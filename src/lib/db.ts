import { neon } from "@neondatabase/serverless";

function getDbUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    ""
  );
}

export function getDb() {
  const url = getDbUrl();
  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return neon(url);
}

export async function initDatabase() {
  const sql = getDb();

  // 1. Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      diagnosis TEXT,
      medical_history TEXT,
      target_goals TEXT,
      kine_id TEXT,
      clinic_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      body_part TEXT NOT NULL,
      equipment TEXT NOT NULL,
      tracking_type TEXT NOT NULL,
      default_rest_seconds INTEGER DEFAULT 60,
      instructions TEXT NOT NULL,
      kine_tips TEXT,
      is_custom BOOLEAN DEFAULT FALSE,
      icon_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      created_by_kine_id TEXT NOT NULL,
      assigned_to_patient_id TEXT,
      exercises_json JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY,
      routine_id TEXT,
      routine_title TEXT NOT NULL,
      patient_id TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      kine_id TEXT NOT NULL,
      start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      end_time TIMESTAMP WITH TIME ZONE,
      duration_seconds INTEGER DEFAULT 0,
      total_volume_kg REAL DEFAULT 0,
      completed_sets_count INTEGER DEFAULT 0,
      total_sets_count INTEGER DEFAULT 0,
      exercises_json JSONB NOT NULL,
      pain_level INTEGER,
      rpe_effort TEXT,
      patient_feedback TEXT,
      kine_comment TEXT,
      is_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}
