"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Clock, Dumbbell, Flame, HeartPulse, Send, Trophy, X } from "lucide-react";
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
          colors: ["#007aff", "#00d084", "#38bdf8", "#f59e0b"],
        });
      } catch {
        // Fallback if canvas-confetti is not available
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    onConfirmSave({
      painLevel,
      rpeEffort,
      feedback: feedback.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#121622] border border-[#232b3e] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-b from-blue-900/40 to-transparent p-6 text-center border-b border-[#202738] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#8F9BB3] hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mb-3 shadow-lg shadow-blue-500/10">
            <Trophy className="w-7 h-7 text-blue-400" />
          </div>
          
          <h2 className="text-2xl font-black text-white tracking-tight">
            Séance Terminée ! 🎉
          </h2>
          <p className="text-xs text-[#8F9BB3] mt-1">
            Excellent travail ! Vos progrès sont prêts à être transmis à votre kiné.
          </p>
        </div>

        {/* Hevy-style Summary Stats */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#182030] border border-[#273248] rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center text-[#8F9BB3] mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg font-black text-white">
                {formatDurationHuman(durationSeconds)}
              </div>
              <div className="text-[11px] font-semibold text-[#8F9BB3] uppercase mt-0.5">
                Durée
              </div>
            </div>

            <div className="bg-[#182030] border border-[#273248] rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center text-[#8F9BB3] mb-1">
                <Dumbbell className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg font-black text-white">
                {totalVolumeKg} <span className="text-xs font-normal">kg</span>
              </div>
              <div className="text-[11px] font-semibold text-[#8F9BB3] uppercase mt-0.5">
                Volume
              </div>
            </div>

            <div className="bg-[#182030] border border-[#273248] rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center text-[#8F9BB3] mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-black text-white">
                {completedSetsCount} / {totalSetsCount}
              </div>
              <div className="text-[11px] font-semibold text-[#8F9BB3] uppercase mt-0.5">
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
              title="Douleur ressentie (Échelle EVA)"
              subtitle="Score transmis directement à votre kinésithérapeute"
            />

            {/* RPE Effort */}
            <div className="bg-[#131722] border border-[#202738] rounded-xl p-3.5 space-y-1.5">
              <label className="block text-xs font-semibold text-[#8F9BB3] uppercase">
                Effort Perçu (RPE)
              </label>
              <select
                value={rpeEffort}
                onChange={(e) => setRpeEffort(e.target.value as RPEEffort)}
                className="w-full bg-[#182030] border border-[#273248] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Très facile (1-2)">Très facile (1-2) - Aucun essoufflement ni fatigue</option>
                <option value="Modéré (3-4)">Modéré (3-4) - Travail musculaire agréable et contrôlé</option>
                <option value="Difficile (5-7)">Difficile (5-7) - Fatigue musculaire marquée</option>
                <option value="Très dur (8-9)">Très dur (8-9) - Limite de la tolérance</option>
                <option value="Effort maximal (10)">Effort maximal (10) - Épuisement total</option>
              </select>
            </div>

            {/* Feedback Message for Kiné */}
            <div className="bg-[#131722] border border-[#202738] rounded-xl p-3.5 space-y-1.5">
              <label className="block text-xs font-semibold text-[#8F9BB3] uppercase">
                Notes & Remarques pour {kineName}
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ex: Le genou a bien tenu sur les flexions, aucune instabilité. Légère tension sur le mollet en fin de séance..."
                rows={3}
                className="w-full bg-[#182030] border border-[#273248] rounded-xl p-3 text-white placeholder-[#54627d] text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all text-sm uppercase tracking-wide cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enregistrer & Partager avec mon Kiné</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-[#8F9BB3] hover:text-white transition-colors"
            >
              Revenir à la séance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
