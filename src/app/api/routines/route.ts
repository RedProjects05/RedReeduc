import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Routine } from "@/lib/types";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, title, description, category, created_by_kine_id, assigned_to_patient_id, exercises_json, created_at, updated_at
      FROM routines
      ORDER BY created_at DESC;
    `;

    const routines: Routine[] = rows.map((r) => ({
      id: r.id as string,
      title: r.title as string,
      description: (r.description as string) || "",
      category: r.category as Routine["category"],
      createdByKineId: r.created_by_kine_id as string,
      assignedToPatientId: (r.assigned_to_patient_id as string) || undefined,
      exercises: typeof r.exercises_json === "string" ? JSON.parse(r.exercises_json) : r.exercises_json,
      createdAt: (r.created_at as Date)?.toISOString() || new Date().toISOString(),
      updatedAt: (r.updated_at as Date)?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json(routines);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const routine: Routine = await req.json();
    const sql = getDb();

    await sql`
      INSERT INTO routines (
        id, title, description, category, created_by_kine_id,
        assigned_to_patient_id, exercises_json
      ) VALUES (
        ${routine.id},
        ${routine.title},
        ${routine.description || null},
        ${routine.category},
        ${routine.createdByKineId},
        ${routine.assignedToPatientId || null},
        ${JSON.stringify(routine.exercises)}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        assigned_to_patient_id = EXCLUDED.assigned_to_patient_id,
        exercises_json = EXCLUDED.exercises_json,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return NextResponse.json({ success: true, routine });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const sql = getDb();
    await sql`DELETE FROM routines WHERE id = ${id};`;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
