import { NextResponse } from "next/server";
import { getDb, initDatabase } from "@/lib/db";
import { DEFAULT_EXERCISES, DEFAULT_USERS } from "@/lib/default-data";

export async function GET() {
  try {
    await initDatabase();
    const sql = getDb();

    // Check if users exist, otherwise insert Anaïs and Reda
    const existingUsers = await sql`SELECT id FROM users LIMIT 1;`;
    if (existingUsers.length === 0) {
      await sql`
        INSERT INTO users (id, name, role, email, clinic_name)
        VALUES ('kine-anais', 'Anaïs', 'KINE', 'anais.kine@redreeduc.fr', 'Cabinet de Kinésithérapie du Sport')
        ON CONFLICT (id) DO NOTHING;
      `;

      await sql`
        INSERT INTO users (id, name, role, email, diagnosis, medical_history, target_goals, kine_id)
        VALUES (
          'patient-reda',
          'Reda',
          'PATIENT',
          'reda@redreeduc.fr',
          'Rupture du LCA genou droit (Post-opératoire)',
          'Ligamentoplastie DIDT effectuée il y a 3 mois.',
          'Récupérer la stabilité et la force du quadriceps sans douleur fémoro-patellaire > 3/10. Reprise du footing.',
          'kine-anais'
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // Seed exercises if empty
    const existingExercises = await sql`SELECT id FROM exercises LIMIT 1;`;
    if (existingExercises.length === 0) {
      for (const exo of DEFAULT_EXERCISES) {
        await sql`
          INSERT INTO exercises (
            id, name, category, body_part, equipment, tracking_type,
            default_rest_seconds, instructions, kine_tips, is_custom, icon_name
          ) VALUES (
            ${exo.id}, ${exo.name}, ${exo.category}, ${exo.bodyPart}, ${exo.equipment},
            ${exo.trackingType}, ${exo.defaultRestSeconds}, ${exo.instructions},
            ${exo.kineTips || null}, FALSE, ${exo.iconName || null}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    return NextResponse.json({ success: true, message: "Neon PostgreSQL initialized successfully." });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("DB Init error:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
