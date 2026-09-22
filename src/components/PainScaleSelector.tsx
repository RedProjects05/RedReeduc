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
    if (lvl === 0) return "text-emerald-400 bg-emerald-950/40 border-emerald-600";
    if (lvl <= 2) return "text-green-400 bg-green-950/40 border-green-600";
    if (lvl <= 4) return "text-yellow-400 bg-yellow-950/40 border-yellow-600";
    if (lvl <= 6) return "text-orange-400 bg-orange-950/40 border-orange-600";
    if (lvl <= 8) return "text-rose-400 bg-rose-950/40 border-rose-600";
    return "text-red-500 bg-red-950/50 border-red-600";
  };

  const getPainDescription = (lvl: number) => {
    if (lvl === 0) return { label: "Aucune douleur", icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-1.5" />, advice: "Idéal ! Le corps tolère parfaitement la charge." };
    if (lvl <= 2) return { label: "Douleur très légère / Inconfort", icon: <HeartPulse className="w-4 h-4 text-green-400 inline mr-1.5" />, advice: "Normal en rééducation. Poursuivre le protocole." };
    if (lvl <= 4) return { label: "Douleur modérée mais supportable", icon: <AlertCircle className="w-4 h-4 text-yellow-400 inline mr-1.5" />, advice: "Zone de travail admissible. Rester vigilant sur la technique." };
    if (lvl <= 6) return { label: "Douleur sensible / Gêne prononcée", icon: <AlertCircle className="w-4 h-4 text-orange-400 inline mr-1.5" />, advice: "Seuil de précaution. Réduire la charge de 15-20% si persistance." };
    if (lvl <= 8) return { label: "Douleur vive / Aiguë", icon: <Flame className="w-4 h-4 text-rose-400 inline mr-1.5" />, advice: "Alerte kiné : arrêter immédiatement cet exercice." };
    return { label: "Douleur insupportable", icon: <Flame className="w-4 h-4 text-red-500 inline mr-1.5" />, advice: "Arrêt immédiat de la séance et contacter le praticien." };
  };

  const currentInfo = getPainDescription(value);

  return (
    <div className="bg-[#131722] border border-[#202738] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            {title}
          </h4>
          <p className="text-xs text-[#8F9BB3]">{subtitle}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-base font-bold border transition-colors ${getPainColor(
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
          let btnBg = "bg-[#182030] text-[#8F9BB3] hover:bg-[#20293d]";
          if (isSelected) {
            if (score === 0) btnBg = "bg-emerald-600 text-white font-bold ring-2 ring-emerald-400";
            else if (score <= 3) btnBg = "bg-green-600 text-white font-bold ring-2 ring-green-400";
            else if (score <= 5) btnBg = "bg-amber-600 text-white font-bold ring-2 ring-amber-400";
            else if (score <= 7) btnBg = "bg-orange-600 text-white font-bold ring-2 ring-orange-400";
            else btnBg = "bg-red-600 text-white font-bold ring-2 ring-red-400";
          }

          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`h-9 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center transition-all ${btnBg}`}
            >
              {score}
            </button>
          );
        })}
      </div>

      {/* Qualitative Feedback */}
      <div className="bg-[#0b0d13] rounded-lg p-2.5 text-xs flex flex-col gap-1 border border-[#1b2333]">
        <div className="font-semibold text-white flex items-center">
          {currentInfo.icon}
          <span>{currentInfo.label}</span>
        </div>
        <div className="text-[#8F9BB3]">{currentInfo.advice}</div>
      </div>
    </div>
  );
}
