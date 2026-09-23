"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Clock, Dumbbell, HeartPulse, Send, Trophy, X } from "lucide-react";
import { PainScaleSelector } from "./PainScaleSelector";
import { formatDurationHuman } from "@/lib/utils";
import { playVictorySound } from "@/lib/audio";
import { RPEEffort } from "@/lib/types";

interface WorkoutRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSave: (data: {
    painLevel: number;
    rpeEffort: RPEEffort;
    feedback: string;
    sharedWithKine: boolean;
  }) => void;
  durationSeconds: number;
  totalVolumeKg: number;
  completedSetsCount: number;
  totalSetsCount: number;
  exercisesCount: number;
  kineName: string;
}

export function WorkoutRecapModal({
  isOpen,
  onClose,
  onConfirmSave,
  durationSeconds,
  totalVolumeKg,
  completedSetsCount,
  totalSetsCount,
  exercisesCount,
  kineName,
}: WorkoutRecapModalProps) {
  const [painLevel, setPainLevel] = useState<number>(1);
  const [rpeEffort, setRpeEffort] = useState<RPEEffort>("Modéré (3-4)");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      playVictorySound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2563eb", "#10b981", "#38bdf8", "#f59e0b"],
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (sharedWithKine: boolean) => {
    setIsSubmitting(true);
    onConfirmSave({
      painLevel,
      rpeEffort,
      feedback: feedback.trim(),
      sharedWithKine,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-b from-blue-50 to-white p-6 text-center border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mb-3 shadow-md shadow-blue-500/10">
            <Trophy className="w-7 h-7 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Séance terminée ! 🎉
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Bravo ! Choisissez d&apos;enregistrer vos résultats pour vous seul ou de les transmettre à {kineName}.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center text-blue-600 mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900">
                {formatDurationHuman(durationSeconds)}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">
                Durée
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center text-cyan-600 mb-1">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900">
                {totalVolumeKg} <span className="text-xs font-normal text-slate-500">kg</span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">
                Volume
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center text-emerald-600 mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900">
                {completedSetsCount} / {totalSetsCount}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">
                Séries
              </div>
            </div>
          </div>

          {/* Rehabilitation Metrics Form */}
          <div className="space-y-4 pt-1">
            {/* EVA Pain Scale */}
            <PainScaleSelector
              value={painLevel}
              onChange={setPainLevel}
              title="Douleur ressentie (échelle EVA)"
              subtitle="Permet d'adapter vos prochaines séances"
            />

            {/* RPE Effort */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Effort perçu (RPE)
              </label>
              <select
                value={rpeEffort}
                onChange={(e) => setRpeEffort(e.target.value as RPEEffort)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-blue-600 font-medium"
              >
                <option value="Très facile (1-2)">Très facile (1-2) - Aucun essoufflement ni fatigue</option>
                <option value="Modéré (3-4)">Modéré (3-4) - Travail musculaire agréable et contrôlé</option>
                <option value="Difficile (5-7)">Difficile (5-7) - Fatigue musculaire marquée</option>
                <option value="Très dur (8-9)">Très dur (8-9) - Limite de la tolérance</option>
                <option value="Effort maximal (10)">Effort maximal (10) - Épuisement total</option>
              </select>
            </div>

            {/* Feedback Message */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Notes &amp; remarques (facultatif)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ex : Le genou a bien tenu sur les flexions, aucune instabilité. Légère tension sur le mollet..."
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 resize-none font-medium"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting ? "Enregistrement en cours..." : `Enregistrer et transmettre à mon kiné (${kineName})`}
              </span>
            </button>

            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 border border-slate-200 transition-colors text-xs cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Enregistrer uniquement (sans transmettre)</span>
            </button>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Revenir à la séance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
