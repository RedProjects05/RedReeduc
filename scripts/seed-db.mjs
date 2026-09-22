import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

// Load .env
dotenv.config();

const dbUrl =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!dbUrl) {
  console.error("No POSTGRES_URL or DATABASE_URL found");
  process.exit(1);
}

const sql = neon(dbUrl);

const EXERCISES = [
  {
    id: "exo-genou-1",
    name: "Chaise au Mur (Isométrie Quadriceps)",
    category: "Genou",
    body_part: "Quadriceps & Fessiers",
    equipment: "Poids de corps / Mur",
    tracking_type: "time",
    default_rest_seconds: 60,
    instructions: "Dos plaqué contre le mur, genoux fléchis à 90°, pieds écartés de la largeur du bassin. Maintenir la position.",
    kine_tips: "Veillez à ce que les genoux ne dépassent pas la pointe des pieds. Stop immédiat si douleur rotulienne.",
    icon_name: "Shield",
  },
  {
    id: "exo-genou-2",
    name: "Pont Fessier Unipodal (Glute Bridge)",
    category: "Genou",
    body_part: "Grand Fessier & Ischios",
    equipment: "Poids de corps",
    tracking_type: "reps_only",
    default_rest_seconds: 45,
    instructions: "Allongé sur le dos, une jambe pliée au sol, l'autre tendue dans l'alignement. Pousser sur le talon pour monter le bassin.",
    kine_tips: "Conserver le bassin bien horizontal lors de la montée, ne pas cambrer le bas du dos.",
    icon_name: "Activity",
  },
  {
    id: "exo-genou-3",
    name: "Presse à Cuisses (Contrôlée)",
    category: "Genou",
    body_part: "Quadriceps, Fessiers",
    equipment: "Machine",
    tracking_type: "weight_reps",
    default_rest_seconds: 90,
    instructions: "Pieds écartés largeur d'épaules sur le plateau. Descente contrôlée en 3 secondes, poussée dynamique sans verrouiller les genoux.",
    kine_tips: "Descente à 80-90° max de flexion. Conserver les genoux alignés avec le 2ème orteil.",
    icon_name: "Dumbbell",
  },
  {
    id: "exo-genou-4",
    name: "Proprioception sur Plateau de Freeman",
    category: "Cheville & Pied",
    body_part: "Cheville, Genou & Stabilisateurs",
    equipment: "Plateau d'équilibre",
    tracking_type: "time",
    default_rest_seconds: 45,
    instructions: "En appui sur un seul pied au centre du plateau d'équilibre. Maintenir le plateau le plus horizontal possible sans toucher le sol.",
    kine_tips: "Fixer un point au loin. Léger déverrouillage du genou recommandé.",
    icon_name: "Compass",
  },
  {
    id: "exo-genou-5",
    name: "Fente Contrôlée avec Haltères",
    category: "Genou",
    body_part: "Quadriceps, Fessiers, Ischios",
    equipment: "Haltères",
    tracking_type: "weight_reps",
    default_rest_seconds: 60,
    instructions: "Un grand pas en avant, descendre le genou arrière vers le sol à angle droit. Remonter en poussant sur le talon avant.",
    kine_tips: "Contrôler la phase descendante. Le genou avant doit rester stable sans rentrer vers l'intérieur.",
    icon_name: "Flame",
  },
  {
    id: "exo-genou-6",
    name: "Leg Extension Unilatéral (Guidé)",
    category: "Genou",
    body_part: "Vaste Interne & Droit Antérieur",
    equipment: "Machine",
    tracking_type: "weight_reps",
    default_rest_seconds: 60,
    instructions: "Assis sur la machine, dos calé. Extension de la jambe blessée en concentrique 2s, maintien 1s en haut, descente 3s.",
    kine_tips: "Limiter l'amplitude aux 45 derniers degrés pour épargner le greffon LCA selon protocole.",
    icon_name: "Zap",
  },
  {
    id: "exo-genou-7",
    name: "Clamshell avec Élastique",
    category: "Hanche",
    body_part: "Moyen Fessier",
    equipment: "Élastique",
    tracking_type: "elastic_reps",
    default_rest_seconds: 45,
    instructions: "Couché sur le côté, genoux fléchis à 90°, élastique autour des genoux. Ouvrir le genou supérieur en gardant les pieds collés.",
    kine_tips: "Le bassin ne doit pas basculer vers l'arrière.",
    icon_name: "Repeat",
  },
  {
    id: "exo-epaule-1",
    name: "Rotateurs Externes à l'Élastique",
    category: "Épaule",
    body_part: "Sous-épineux & Petit Rond",
    equipment: "Élastique",
    tracking_type: "elastic_reps",
    default_rest_seconds: 60,
    instructions: "Coude collé au corps fléchi à 90°, une serviette roulée sous le bras. Tirer l'élastique vers l'extérieur sans décoller le coude.",
    kine_tips: "Mouvement lent et fluide, serrer légèrement les omoplates vers le bas.",
    icon_name: "RotateCw",
  },
  {
    id: "exo-epaule-2",
    name: "Wall Slide (Glissement Scapulaire au Mur)",
    category: "Épaule",
    body_part: "Dentelé Antérieur & Trapèze Inférieur",
    equipment: "Poids de corps / Mur",
    tracking_type: "reps_only",
    default_rest_seconds: 45,
    instructions: "Avant-bras en contact avec le mur en 'W'. Faire glisser les bras vers le haut en forme de 'Y' sans décoller le contact.",
    kine_tips: "Ne pas cambrer la région lombaire, garder les côtes rentrées.",
    icon_name: "ArrowUp",
  },
  {
    id: "exo-epaule-3",
    name: "Élévation Latérale (Haltère)",
    category: "Épaule",
    body_part: "Deltoïde Moyen",
    equipment: "Haltère",
    tracking_type: "weight_reps",
    default_rest_seconds: 60,
    instructions: "Debout, un haltère dans chaque main. Élever les bras sur les côtés jusqu'à hauteur d'épaules dans le plan scapulaire (30° vers l'avant).",
    kine_tips: "Ne pas hausser les épaules (garder les trapèzes relâchés).",
    icon_name: "Dumbbell",
  },
  {
    id: "exo-epaule-4",
    name: "Oiseau Buste Appuyé (Haltère)",
    category: "Épaule",
    body_part: "Deltoïde Postérieur & Rhomboïdes",
    equipment: "Haltère & Banc",
    tracking_type: "weight_reps",
    default_rest_seconds: 60,
    instructions: "Buste appuyé sur banc incliné à 30-45°, coudes légèrement fléchis. Écarter les bras vers l'extérieur en serrant les omoplates.",
    kine_tips: "Excellent pour corriger la posture enroulée des épaules.",
    icon_name: "Eye",
  },
  {
    id: "exo-bras-1",
    name: "Curl Biceps (Haltère)",
    category: "Bras",
    body_part: "Biceps Brachial",
    equipment: "Haltères",
    tracking_type: "weight_reps",
    default_rest_seconds: 60,
    instructions: "Debout ou assis, coudes fixés au niveau des flancs. Fléchir l'avant-bras en effectuant une supination complète du poignet.",
    kine_tips: "Contrôler la descente sans balancer le buste.",
    icon_name: "Dumbbell",
  },
  {
    id: "exo-bras-2",
    name: "Curl Marteau (Haltère)",
    category: "Bras",
    body_part: "Brachio-radial & Long Supinateur",
    equipment: "Haltères",
    tracking_type: "weight_reps",
    default_rest_seconds: 60,
    instructions: "Prise neutre (pouces vers le haut). Monter l'haltère de façon stricte sans rotation du poignet.",
    kine_tips: "Renforce la stabilité de l'avant-bras et du coude.",
    icon_name: "Hammer",
  },
  {
    id: "exo-dos-1",
    name: "Gainage Planche Ventrale",
    category: "Dos & Tronc",
    body_part: "Transverse & Sangle Abdominale",
    equipment: "Poids de corps / Tapis",
    tracking_type: "time",
    default_rest_seconds: 60,
    instructions: "En appui sur les avant-bras et la pointe des pieds. Maintenir le corps rectiligne, nombril aspiré vers la colonne.",
    kine_tips: "Ne pas creuser les lombaires ni lever les fesses trop haut. Respiration fluide.",
    icon_name: "Shield",
  },
  {
    id: "exo-dos-2",
    name: "Bird Dog (Chien d'Arrêt Croisé)",
    category: "Dos & Tronc",
    body_part: "Érecteurs du Rachis, Fessiers, Transverse",
    equipment: "Poids de corps / Tapis",
    tracking_type: "reps_only",
    default_rest_seconds: 45,
    instructions: "À quatre pattes, tendre simultanément le bras droit devant et la jambe gauche derrière. Maintenir 3 secondes puis alterner.",
    kine_tips: "Le bassin et les épaules restent parfaitement horizontaux.",
    icon_name: "Smile",
  },
  {
    id: "exo-cheville-1",
    name: "Mollets Debout sur Marche (Calf Raises)",
    category: "Cheville & Pied",
    body_part: "Triceps Sural & Tendon d'Achille",
    equipment: "Marche / Step",
    tracking_type: "weight_reps",
    default_rest_seconds: 60,
    instructions: "Avant-pied sur la marche, talons dans le vide. Montée maximale sur la pointe des pieds, descente lente sous le niveau du step.",
    kine_tips: "Temps d'arrêt de 2 secondes en bas pour solliciter le tendon d'Achille.",
    icon_name: "TrendingUp",
  },
  {
    id: "exo-cardio-1",
    name: "Tapis de Course (Marche / Course)",
    category: "Cardio & Échauffement",
    body_part: "Système Cardio-Vasculaire & Membres Inférieurs",
    equipment: "Tapis de Course",
    tracking_type: "distance_time",
    default_rest_seconds: 0,
    instructions: "Marche rapide inclinée ou course contrôlée selon l'état du genou / de la cheville.",
    kine_tips: "Attaque médio-pied, cadence fluide, sans boiterie.",
    icon_name: "Footprints",
  },
  {
    id: "exo-cardio-2",
    name: "Vélo Stationnaire (Rodage Articulaire)",
    category: "Cardio & Échauffement",
    body_part: "Genoux & Hanche (Mobilisation)",
    equipment: "Vélo d'appartement",
    tracking_type: "time",
    default_rest_seconds: 0,
    instructions: "Pédalage à résistance modérée (60-80 RPM) pour chauffer le cartilage et mobiliser l'articulation en douceur.",
    kine_tips: "Selle réglée à hauteur de hanche pour éviter une flexion excessive du genou.",
    icon_name: "Bike",
  },
];

async function seed() {
  console.log("Connecting to Neon PostgreSQL...");

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

  // 2. Clean up old users & mock routines
  await sql`DELETE FROM users;`;
  await sql`DELETE FROM routines;`;
  await sql`DELETE FROM workout_sessions;`;

  // 3. Insert the 2 requested users: Anaïs (Kiné) and Reda (Patient)
  await sql`
    INSERT INTO users (id, name, role, email, clinic_name)
    VALUES (
      'kine-anais',
      'Anaïs',
      'KINE',
      'anais.kine@redreeduc.fr',
      'Cabinet de Kinésithérapie du Sport'
    );
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
      'Récupérer l''extension complète, renforcer le quadriceps sans douleur et reprendre la course à pied.',
      'kine-anais'
    );
  `;

  console.log("Users created: Anaïs (Kiné) and Reda (Patient)");

  // 4. Insert exercises
  for (const exo of EXERCISES) {
    await sql`
      INSERT INTO exercises (
        id, name, category, body_part, equipment, tracking_type,
        default_rest_seconds, instructions, kine_tips, is_custom, icon_name
      ) VALUES (
        ${exo.id}, ${exo.name}, ${exo.category}, ${exo.body_part}, ${exo.equipment},
        ${exo.tracking_type}, ${exo.default_rest_seconds}, ${exo.instructions},
        ${exo.kine_tips}, FALSE, ${exo.icon_name}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        body_part = EXCLUDED.body_part,
        equipment = EXCLUDED.equipment,
        instructions = EXCLUDED.instructions,
        kine_tips = EXCLUDED.kine_tips;
    `;
  }

  console.log(`Seeded ${EXERCISES.length} exercises into Neon PostgreSQL!`);
  console.log("Database initialized successfully with zero pre-created routines (clean slate).");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
