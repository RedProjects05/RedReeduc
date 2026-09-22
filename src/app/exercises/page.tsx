"use client";

import React, { useState, useMemo } from "react";
import {
  Dumbbell,
  Filter,
  HeartPulse,
  Info,
  Plus,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import { Exercise, ExerciseCategory } from "@/lib/types";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";
import { ExerciseSelectorModal } from "@/components/ExerciseSelectorModal";

const CATEGORIES: ("Tous" | ExerciseCategory)[] = [
  "Tous",
  "Genou",
  "Épaule",
  "Dos & Tronc",
  "Cheville & Pied",
  "Hanche",
  "Bras",
  "Cardio & Échauffement",
  "Mobilité & Étirement",
];

export function ExercisesLibraryPage() {
  const { exercises } = useRedReeducStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState<"Tous" | ExerciseCategory>("Tous");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExoDetail, setSelectedExoDetail] = useState<Exercise | null>(null);

  const filtered = useMemo(() => {
    return exercises.filter((exo) => {
      const matchSearch =
        exo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exo.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exo.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exo.kineTips && exo.kineTips.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCat = selectedCat === "Tous" ? true : exo.category === selectedCat;

      return matchSearch && matchCat;
    });
  }, [exercises, searchTerm, selectedCat]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-blue-400" />
            <span>Pool d&apos;Exercices Kiné & Musculation</span>
          </h1>
          <p className="text-xs text-[#8F9BB3] mt-0.5">
            {exercises.length} exercices disponibles (musculation, rééducation post-opératoire et étirements).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Exercice Personnalisé</span>
        </button>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8F9BB3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom d'exercice, groupe musculaire, matériel..."
            className="w-full bg-[#121622] border border-[#202738] rounded-2xl pl-10 pr-4 py-3 text-white placeholder-[#54627d] text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => {
            const active = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-[#121622] text-[#8F9BB3] hover:text-white hover:bg-[#182030] border border-[#202738]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((exo) => (
          <div
            key={exo.id}
            onClick={() => setSelectedExoDetail(exo)}
            className="bg-[#121622] border border-[#202738] hover:border-blue-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all hover:bg-[#151a26] cursor-pointer group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <ExerciseThumbnail
                  category={exo.category}
                  iconName={exo.iconName}
                  className="w-11 h-11"
                  size={20}
                />
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#182030] text-[#8F9BB3] border border-[#273248]">
                  {exo.category}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-sm group-hover:text-blue-400 transition-colors">
                  {exo.name}
                </h3>
                <p className="text-xs text-[#8F9BB3] mt-0.5">{exo.bodyPart}</p>
              </div>

              <div className="text-[11px] text-slate-300 line-clamp-2 bg-[#0c0f18] p-2 rounded-xl border border-[#1b2234]">
                {exo.instructions}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-[#1a2133] flex items-center justify-between text-[11px] text-[#8F9BB3]">
              <span className="font-medium text-slate-400">{exo.equipment}</span>
              <span className="text-blue-400 font-bold group-hover:underline flex items-center gap-1">
                <Info className="w-3 h-3" /> Fiche
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121622] border border-[#232b3e] rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <ExerciseThumbnail
                  category={selectedExoDetail.category}
                  iconName={selectedExoDetail.iconName}
                  className="w-12 h-12"
                  size={24}
                />
                <div>
                  <h3 className="font-black text-white text-base">
                    {selectedExoDetail.name}
                  </h3>
                  <p className="text-xs text-[#8F9BB3]">
                    {selectedExoDetail.category} • {selectedExoDetail.bodyPart}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedExoDetail(null)}
                className="p-1 text-[#8F9BB3] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#182030] p-3 rounded-xl border border-[#273248]">
                <span className="block font-bold text-[#8F9BB3] uppercase text-[10px] mb-1">
                  Instructions & Exécution
                </span>
                <p className="text-slate-200">{selectedExoDetail.instructions}</p>
              </div>

              {selectedExoDetail.kineTips && (
                <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-800/40 text-blue-200">
                  <span className="block font-bold text-blue-300 uppercase text-[10px] mb-1 flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5" /> Recommandations Kiné
                  </span>
                  <p>{selectedExoDetail.kineTips}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="bg-[#182030] p-2 rounded-xl">
                  <span className="block text-[10px] text-[#8F9BB3] uppercase">Équipement</span>
                  <span className="font-bold text-white">{selectedExoDetail.equipment}</span>
                </div>
                <div className="bg-[#182030] p-2 rounded-xl">
                  <span className="block text-[10px] text-[#8F9BB3] uppercase">Repos Conseillé</span>
                  <span className="font-bold text-white">{selectedExoDetail.defaultRestSeconds}s</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedExoDetail(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Create Custom Modal */}
      <ExerciseSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectExercise={(exo) => setSelectedExoDetail(exo)}
        exercises={exercises}
      />
    </div>
  );
}

export default ExercisesLibraryPage;
