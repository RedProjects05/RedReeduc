"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Flame, HeartPulse } from "lucide-react";

interface PainScaleSelectorProps {
  value: number;
  onChange: (val: number) => void;
  title?: string;
  subtitle?: string;
}

export function PainScaleSelector({
  value,
  onChange,
  title = "Échelle de Douleur EVA (0 à 10)",
  subtitle = "Indiquez la douleur maximale ressentie pendant les exercices",
}: PainScaleSelectorProps) {
  const getPainColor = (lvl: number) => {
    if (lvl === 0) return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (lvl <= 2) return "text-green-700 bg-green-50 border-green-300";
    if (lvl <= 4) return "text-amber-700 bg-amber-50 border-amber-300";
    if (lvl <= 6) return "text-orange-700 bg-orange-50 border-orange-300";
    if (lvl <= 8) return "text-rose-700 bg-rose-50 border-rose-300";
    return "text-red-700 bg-red-50 border-red-300";
  };

  const getPainDescription = (lvl: number) => {
    if (lvl === 0) return { label: "Aucune douleur", icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 inline mr-1.5" />, advice: "Idéal ! Le corps tolère parfaitement la charge." };
    if (lvl <= 2) return { label: "Douleur très légère / Inconfort", icon: <HeartPulse className="w-4 h-4 text-green-600 inline mr-1.5" />, advice: "Normal en rééducation. Poursuivre le protocole." };
    if (lvl <= 4) return { label: "Douleur modérée mais supportable", icon: <AlertCircle className="w-4 h-4 text-amber-600 inline mr-1.5" />, advice: "Zone de travail admissible. Rester vigilant sur la technique." };
    if (lvl <= 6) return { label: "Douleur sensible / Gêne prononcée", icon: <AlertCircle className="w-4 h-4 text-orange-600 inline mr-1.5" />, advice: "Seuil de précaution. Réduire la charge de 15-20% si persistance." };
    if (lvl <= 8) return { label: "Douleur vive / Aiguë", icon: <Flame className="w-4 h-4 text-rose-600 inline mr-1.5" />, advice: "Alerte kiné : arrêter immédiatement cet exercice." };
    return { label: "Douleur insupportable", icon: <Flame className="w-4 h-4 text-red-600 inline mr-1.5" />, advice: "Arrêt immédiat de la séance et contacter le praticien." };
  };

  const currentInfo = getPainDescription(value);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            {title}
          </h4>
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-black border transition-colors ${getPainColor(
            value
          )}`}
        >
          {value} / 10
        </div>
      </div>

      {/* 0 to 10 Number Buttons */}
      <div className="grid grid-cols-11 gap-1 pt-1">
        {Array.from({ length: 11 }, (_, i) => i).map((score) => {
          const isSelected = value === score;
          let btnBg = "bg-slate-100 text-slate-600 hover:bg-slate-200";
          if (isSelected) {
            if (score === 0) btnBg = "bg-emerald-600 text-white font-black ring-2 ring-emerald-300 shadow-xs";
            else if (score <= 3) btnBg = "bg-green-600 text-white font-black ring-2 ring-green-300 shadow-xs";
            else if (score <= 5) btnBg = "bg-amber-500 text-white font-black ring-2 ring-amber-300 shadow-xs";
            else if (score <= 7) btnBg = "bg-orange-500 text-white font-black ring-2 ring-orange-300 shadow-xs";
            else btnBg = "bg-red-600 text-white font-black ring-2 ring-red-300 shadow-xs";
          }

          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`h-9 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer ${btnBg}`}
            >
              {score}
            </button>
          );
        })}
      </div>

      {/* Qualitative Feedback */}
      <div className="bg-slate-50 rounded-xl p-3 text-xs flex flex-col gap-1 border border-slate-200/80">
        <div className="font-bold text-slate-900 flex items-center">
          {currentInfo.icon}
          <span>{currentInfo.label}</span>
        </div>
        <div className="text-slate-600 font-medium">{currentInfo.advice}</div>
      </div>
    </div>
  );
}
