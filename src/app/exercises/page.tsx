"use client";

import React, { useState, useMemo } from "react";
import {
  Dumbbell,
  HeartPulse,
  Info,
  Plus,
  Search,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";
import { Exercise, ExerciseCategory } from "@/lib/types";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";
import { ExerciseSelectorModal } from "@/components/ExerciseSelectorModal";

const CATEGORIES: ("Tous" | ExerciseCategory)[] = [
  "Tous",
  "Pectoraux & Dos",
  "Genou",
  "Épaule",
  "Dos & Tronc",
  "Cheville & Pied",
  "Hanche",
  "Bras",
  "Cardio & Échauffement",
  "Mobilité & Étirement",
];

const EQUIPMENT_FILTERS = [
  "Tous",
  "Machine",
  "Haltères",
  "Barre",
  "Kettlebell",
  "Poulie",
  "Poids de corps",
  "Élastique",
];

export function ExercisesLibraryPage() {
  const { exercises } = useRedReeducStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState<"Tous" | ExerciseCategory>("Tous");
  const [selectedEquip, setSelectedEquip] = useState<string>("Tous");
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

      const matchEquip =
        selectedEquip === "Tous"
          ? true
          : exo.equipment.toLowerCase().includes(selectedEquip.toLowerCase());

      return matchSearch && matchCat && matchEquip;
    });
  }, [exercises, searchTerm, selectedCat, selectedEquip]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-blue-600" />
            <span>Pool d&apos;Exercices Rééducation &amp; Musculation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {exercises.length} exercices disponibles (renforcement, mobilité, proprioception et cardio).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Exercice Personnalisé</span>
        </button>
      </div>

      {/* Search & Double Filter Bar (Matériel & Zone) */}
      <div className="space-y-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom d'exercice, muscle, matériel..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-all"
          />
        </div>

        {/* Equipment Filter Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            <span>Matériel</span>
            <span className="text-blue-600 font-extrabold">{filtered.length} exercice(s)</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {EQUIPMENT_FILTERS.map((equip) => {
              const active = selectedEquip === equip;
              return (
                <button
                  key={equip}
                  onClick={() => setSelectedEquip(equip)}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-xs scale-102"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/60"
                  }`}
                >
                  {equip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Zone Corporelle / Spécialité
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CATEGORIES.map((cat) => {
              const active = selectedCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white shadow-xs scale-102"
                      : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((exo) => (
          <div
            key={exo.id}
            onClick={() => setSelectedExoDetail(exo)}
            className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-5 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <ExerciseThumbnail
                  category={exo.category}
                  iconName={exo.iconName}
                  className="w-11 h-11"
                  size={20}
                />
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {exo.category}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  {exo.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{exo.bodyPart}</p>
              </div>

              <div className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                {exo.instructions}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="text-slate-700">{exo.equipment}</span>
              <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-1">
                <Info className="w-3 h-3" /> Fiche
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <ExerciseThumbnail
                  category={selectedExoDetail.category}
                  iconName={selectedExoDetail.iconName}
                  className="w-12 h-12"
                  size={24}
                />
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {selectedExoDetail.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedExoDetail.category} • {selectedExoDetail.bodyPart}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedExoDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Instructions &amp; Exécution
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedExoDetail.instructions}
                </p>
              </div>

              {selectedExoDetail.kineTips && (
                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 text-blue-900">
                  <span className="block font-bold text-blue-900 uppercase text-[10px] mb-1 flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-blue-600" /> Recommandations Kiné
                  </span>
                  <p className="font-medium">{selectedExoDetail.kineTips}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Équipement</span>
                  <span className="font-black text-slate-900">{selectedExoDetail.equipment}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Repos Conseillé</span>
                  <span className="font-black text-slate-900">{selectedExoDetail.defaultRestSeconds}s</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedExoDetail(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
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
