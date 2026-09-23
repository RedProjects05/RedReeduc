import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { WorkoutSession } from "@/lib/types";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, routine_id, routine_title, patient_id, patient_name, kine_id,
             start_time, end_time, duration_seconds, total_volume_kg, completed_sets_count,
             total_sets_count, exercises_json, pain_level, rpe_effort, patient_feedback,
             kine_comment, is_completed, shared_with_kine, created_at
      FROM workout_sessions
      ORDER BY start_time DESC;
    `;

    const workouts: WorkoutSession[] = rows.map((r) => ({
      id: r.id as string,
      routineId: (r.routine_id as string) || undefined,
      routineTitle: r.routine_title as string,
      patientId: r.patient_id as string,
      patientName: r.patient_name as string,
      kineId: r.kine_id as string,
      startTime: (r.start_time as Date)?.toISOString() || new Date().toISOString(),
      endTime: (r.end_time as Date)?.toISOString() || undefined,
      durationSeconds: Number(r.duration_seconds) || 0,
      totalVolumeKg: Number(r.total_volume_kg) || 0,
      completedSetsCount: Number(r.completed_sets_count) || 0,
      totalSetsCount: Number(r.total_sets_count) || 0,
      exercises: typeof r.exercises_json === "string" ? JSON.parse(r.exercises_json) : r.exercises_json,
      painLevel: r.pain_level !== null ? Number(r.pain_level) : undefined,
      rpeEffort: (r.rpe_effort as WorkoutSession["rpeEffort"]) || undefined,
      patientFeedback: (r.patient_feedback as string) || undefined,
      kineComment: (r.kine_comment as string) || undefined,
      sharedWithKine: r.shared_with_kine !== null ? Boolean(r.shared_with_kine) : true,
      isCompleted: Boolean(r.is_completed),
      createdAt: (r.created_at as Date)?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json(workouts);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const session: WorkoutSession = await req.json();
    const sql = getDb();

    await sql`
      INSERT INTO workout_sessions (
        id, routine_id, routine_title, patient_id, patient_name, kine_id,
        start_time, end_time, duration_seconds, total_volume_kg,
        completed_sets_count, total_sets_count, exercises_json,
        pain_level, rpe_effort, patient_feedback, kine_comment,
        is_completed, shared_with_kine
      ) VALUES (
        ${session.id},
        ${session.routineId || null},
        ${session.routineTitle},
        ${session.patientId},
        ${session.patientName},
        ${session.kineId},
        ${session.startTime},
        ${session.endTime || null},
        ${session.durationSeconds},
        ${session.totalVolumeKg},
        ${session.completedSetsCount},
        ${session.totalSetsCount},
        ${JSON.stringify(session.exercises)},
        ${session.painLevel !== undefined ? session.painLevel : null},
        ${session.rpeEffort || null},
        ${session.patientFeedback || null},
        ${session.kineComment || null},
        ${session.isCompleted},
        ${session.sharedWithKine !== undefined ? session.sharedWithKine : true}
      )
      ON CONFLICT (id) DO UPDATE SET
        kine_comment = EXCLUDED.kine_comment,
        is_completed = EXCLUDED.is_completed,
        shared_with_kine = EXCLUDED.shared_with_kine;
    `;

    return NextResponse.json({ success: true, session });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, kineComment } = body;
    if (!id) return NextResponse.json({ error: "Missing session id" }, { status: 400 });

    const sql = getDb();
    await sql`
      UPDATE workout_sessions
      SET kine_comment = ${kineComment || null}
      WHERE id = ${id};
    `;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing session id" }, { status: 400 });

    const sql = getDb();
    await sql`DELETE FROM workout_sessions WHERE id = ${id};`;

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
