"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  Play,
  Stethoscope,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";

export default function RootHomePage() {
  const router = useRouter();
  const { setActiveUserId } = useRedReeducStore();

  const handleSelectRole = (role: "PATIENT" | "KINE") => {
    if (role === "PATIENT") {
      setActiveUserId("patient-reda");
      router.push("/patient");
    } else {
      setActiveUserId("kine-anais");
      router.push("/kine");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
          <Activity className="w-4 h-4" />
          <span>L&apos;ergonomie Hevy au service de votre Rééducation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Rééducation sur-mesure entre <span className="text-blue-600">Kiné</span> et <span className="text-blue-600">Patient</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          Anaïs (Kiné) prescrit les séances avec précision. Reda (Patient) s&apos;entraîne avec l&apos;expérience fluide de Hevy (timer de repos, séries cochables, volume et retours douleur EVA).
        </p>
      </div>

      {/* Dual Portal Selection Cards (Reda & Anaïs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Patient Portal Card (Reda) */}
        <div
          onClick={() => handleSelectRole("PATIENT")}
          className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group space-y-6"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shadow-xs">
              <Flame className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Mode Patient
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                Espace Patient (Reda)
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                Renseignez votre pathologie, lancez vos séances en direct, cochez vos séries en vert et transmettez vos scores de douleur.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profil &amp; Pathologie personnalisable par Reda</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Validation des séries avec bip sonore &amp; timer de repos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Évaluation de la douleur EVA (0 à 10) transmise au kiné</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Entrer comme Patient (Reda)</span>
          </button>
        </div>

        {/* Kiné Portal Card (Anaïs) */}
        <div
          onClick={() => handleSelectRole("KINE")}
          className="bg-white border-2 border-slate-200 hover:border-purple-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group space-y-6"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform shadow-xs">
              <Stethoscope className="w-6 h-6 text-purple-600" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                Mode Kinésithérapeute
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2 group-hover:text-purple-600 transition-colors">
                Espace Kiné (Anaïs)
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                Créez des séances sur-mesure pour Reda, configurez les charges et suivez son évolution et ses alertes de douleur.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Créateur de séances avec charges, reps et repos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Pool de 30+ exercices kiné &amp; musculation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Alertes de douleur en direct et réponses au patient</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Entrer comme Kiné (Anaïs)</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center shadow-xs">
        <div className="space-y-1.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Minuteur de Repos Automatique</h4>
          <p className="text-xs text-slate-500 font-medium">
            Décompte instantané dès qu&apos;une série est cochée en vert, avec signal sonore.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Échelle de Douleur EVA</h4>
          <p className="text-xs text-slate-500 font-medium">
            Remontée immédiate du score de douleur ressenti pour adapter le traitement.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <Dumbbell className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Base PostgreSQL Neon</h4>
          <p className="text-xs text-slate-500 font-medium">
            Synchronisation en direct entre l&apos;ordinateur d&apos;Anaïs et le téléphone de Reda.
          </p>
        </div>
      </div>
    </div>
  );
}
