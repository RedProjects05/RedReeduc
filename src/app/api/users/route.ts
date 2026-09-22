import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { DEFAULT_USERS } from "@/lib/default-data";
import { UserProfile } from "@/lib/types";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, role, email, avatar_url, diagnosis, medical_history, target_goals, kine_id, clinic_name
      FROM users
      ORDER BY role DESC;
    `;

    if (rows.length === 0) {
      return NextResponse.json(DEFAULT_USERS);
    }

    const users: UserProfile[] = rows.map((r) => ({
      id: r.id as string,
      name: r.name as string,
      role: r.role as "PATIENT" | "KINE",
      email: r.email as string,
      avatarUrl: (r.avatar_url as string) || undefined,
      diagnosis: (r.diagnosis as string) || undefined,
      medicalHistory: (r.medical_history as string) || undefined,
      targetGoals: (r.target_goals as string) || undefined,
      kineId: (r.kine_id as string) || undefined,
      clinicName: (r.clinic_name as string) || undefined,
    }));

    return NextResponse.json(users);
  } catch {
    return NextResponse.json(DEFAULT_USERS);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, diagnosis, medicalHistory, targetGoals } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const sql = getDb();
    await sql`
      UPDATE users
      SET
        diagnosis = ${diagnosis || null},
        medical_history = ${medicalHistory || null},
        target_goals = ${targetGoals || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
