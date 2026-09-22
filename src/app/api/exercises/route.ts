import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { DEFAULT_EXERCISES } from "@/lib/default-data";
import { Exercise } from "@/lib/types";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, category, body_part, equipment, tracking_type, default_rest_seconds,
             instructions, kine_tips, is_custom, icon_name
      FROM exercises
      ORDER BY is_custom DESC, category ASC, name ASC;
    `;

    if (rows.length === 0) {
      return NextResponse.json(DEFAULT_EXERCISES);
    }

    const exercises: Exercise[] = rows.map((r) => ({
      id: r.id as string,
      name: r.name as string,
      category: r.category as Exercise["category"],
      bodyPart: r.body_part as string,
      equipment: r.equipment as string,
      trackingType: r.tracking_type as Exercise["trackingType"],
      defaultRestSeconds: Number(r.default_rest_seconds) || 60,
      instructions: r.instructions as string,
      kineTips: (r.kine_tips as string) || undefined,
      isCustom: Boolean(r.is_custom),
      iconName: (r.icon_name as string) || undefined,
    }));

    return NextResponse.json(exercises);
  } catch {
    return NextResponse.json(DEFAULT_EXERCISES);
  }
}

export async function POST(req: Request) {
  try {
    const exo: Exercise = await req.json();
    const sql = getDb();

    await sql`
      INSERT INTO exercises (
        id, name, category, body_part, equipment, tracking_type,
        default_rest_seconds, instructions, kine_tips, is_custom, icon_name
      ) VALUES (
        ${exo.id},
        ${exo.name},
        ${exo.category},
        ${exo.bodyPart},
        ${exo.equipment},
        ${exo.trackingType},
        ${exo.defaultRestSeconds},
        ${exo.instructions},
        ${exo.kineTips || null},
        ${exo.isCustom || true},
        ${exo.iconName || "Dumbbell"}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        body_part = EXCLUDED.body_part,
        equipment = EXCLUDED.equipment,
        tracking_type = EXCLUDED.tracking_type,
        default_rest_seconds = EXCLUDED.default_rest_seconds,
        instructions = EXCLUDED.instructions,
        kine_tips = EXCLUDED.kine_tips;
    `;

    return NextResponse.json({ success: true, exercise: exo });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
