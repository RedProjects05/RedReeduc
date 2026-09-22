"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  Play,
  Stethoscope,
  TrendingUp,
  User,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";

export default function RootHomePage() {
  const router = useRouter();
  const { activeUser, setActiveUserId } = useRedReeducStore();

  const handleSelectRole = (role: "PATIENT" | "KINE") => {
    if (role === "PATIENT") {
      setActiveUserId("patient-1");
      router.push("/patient");
    } else {
      setActiveUserId("kine-1");
      router.push("/kine");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-400 text-xs font-bold">
          <Activity className="w-4 h-4" />
          <span>L&apos;ergonomie Hevy au service de votre Rééducation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Suivez et Réussissez votre <span className="text-blue-500">Rééducation</span>
        </h1>

        <p className="text-sm sm:text-base text-[#8F9BB3]">
          Votre kinésithérapeute prescrit vos séances sur-mesure. Vous vous entraînez avec l&apos;expérience fluide de Hevy (timer de repos, séries cochables, volume et retours douleur EVA).
        </p>
      </div>

      {/* Dual Portal Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Patient Portal Card */}
        <div
          onClick={() => handleSelectRole("PATIENT")}
          className="bg-[#121622] border-2 border-blue-500/40 hover:border-blue-500 rounded-3xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between cursor-pointer group space-y-6"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-blue-400" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                Mode Entraînement
              </span>
              <h2 className="text-xl font-black text-white mt-1 group-hover:text-blue-400 transition-colors">
                Espace Patient (Lucas Martin)
              </h2>
              <p className="text-xs text-[#8F9BB3] mt-1">
                Lancez votre séance en direct, cochez vos séries, profitez du chronomètre de repos et transmettez vos bilans.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-[#1b2234]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Interface Hevy dark mode avec chronomètre</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Validation des séries avec bip sonore &amp; timer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Évaluation de la douleur EVA (0 à 10)</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Entrer comme Patient</span>
          </button>
        </div>

        {/* Kiné Portal Card */}
        <div
          onClick={() => handleSelectRole("KINE")}
          className="bg-[#121622] border-2 border-purple-500/30 hover:border-purple-500 rounded-3xl p-6 shadow-xl hover:shadow-purple-500/10 transition-all flex flex-col justify-between cursor-pointer group space-y-6"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6 text-purple-400" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                Mode Praticien
              </span>
              <h2 className="text-xl font-black text-white mt-1 group-hover:text-purple-400 transition-colors">
                Espace Kiné (Dr. Alexandre Dupont)
              </h2>
              <p className="text-xs text-[#8F9BB3] mt-1">
                Prescrivez des programmes sur-mesure, choisissez dans le catalogue d&apos;exercices et suivez la douleur de vos patients.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-[#1b2234]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Créateur de séances avec charges et répétitions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Pool de 30+ exercices de kiné &amp; muscu</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Alertes de douleur et réponses directes au patient</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Entrer comme Kinésithérapeute</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Banner */}
      <div className="bg-[#121622] border border-[#202738] rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center text-blue-400 mb-1">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Minuteur de Repos Automatique</h4>
          <p className="text-[11px] text-[#8F9BB3]">
            Décompte instantané dès qu&apos;une série est validée, avec alertes sonores.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Échelle de Douleur EVA</h4>
          <p className="text-[11px] text-[#8F9BB3]">
            Remontée immédiate du score de douleur ressenti pour adapter le traitement.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <Dumbbell className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Personnalisation Totale</h4>
          <p className="text-[11px] text-[#8F9BB3]">
            Créez des exercices sur-mesure au poids de corps, haltères ou élastiques.
          </p>
        </div>
      </div>
    </div>
  );
}
