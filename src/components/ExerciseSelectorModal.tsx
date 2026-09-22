"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  Dumbbell,
  Filter,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Exercise, ExerciseCategory, TrackingType } from "@/lib/types";
import { ExerciseThumbnail } from "./ExerciseThumbnail";
import { RedReeducStore } from "@/lib/store";

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  exercises: Exercise[];
}

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

export function ExerciseSelectorModal({
  isOpen,
  onClose,
  onSelectExercise,
  exercises,
}: ExerciseSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Tous" | ExerciseCategory>("Tous");
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // New custom exercise state
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState<ExerciseCategory>("Genou");
  const [customBodyPart, setCustomBodyPart] = useState("");
  const [customEquipment, setCustomEquipment] = useState("Poids de corps");
  const [customTracking, setCustomTracking] = useState<TrackingType>("weight_reps");
  const [customRest, setCustomRest] = useState(60);
  const [customTips, setCustomTips] = useState("");

  const filteredExercises = useMemo(() => {
    return exercises.filter((exo) => {
      const matchesSearch =
        exo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exo.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exo.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exo.kineTips && exo.kineTips.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat =
        selectedCategory === "Tous" ? true : exo.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [exercises, searchTerm, selectedCategory]);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newExo = RedReeducStore.addCustomExercise({
      name: customName.trim(),
      category: customCategory,
      bodyPart: customBodyPart.trim() || customCategory,
      equipment: customEquipment.trim() || "Poids de corps",
      trackingType: customTracking,
      defaultRestSeconds: customRest,
      instructions: "Exercice personnalisé prescrit par le kinésithérapeute.",
      kineTips: customTips.trim() || undefined,
      isCustom: true,
      iconName: "Dumbbell",
    });

    onSelectExercise(newExo);
    setIsCreatingCustom(false);
    setCustomName("");
    setCustomTips("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-[#121622] border border-[#232b3e] rounded-t-3xl sm:rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-[#202738] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">
              {isCreatingCustom ? "Créer un Exercice Personnalisé" : "Ajouter un Exercice"}
            </h3>
          </div>
          <button
            onClick={() => {
              if (isCreatingCustom) setIsCreatingCustom(false);
              else onClose();
            }}
            className="p-1 text-[#8F9BB3] hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Custom View */}
        {isCreatingCustom ? (
          <form onSubmit={handleCreateCustom} className="p-4 overflow-y-auto space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-[#8F9BB3] uppercase mb-1">
                Nom de l&apos;exercice *
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex: Fente bulgare assistée, Ischios TRX..."
                className="w-full bg-[#182030] border border-[#273248] rounded-xl px-3 py-2.5 text-white placeholder-[#54627d] text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#8F9BB3] uppercase mb-1">
                  Catégorie Anatomique
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as ExerciseCategory)}
                  className="w-full bg-[#182030] border border-[#273248] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {CATEGORIES.filter((c) => c !== "Tous").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8F9BB3] uppercase mb-1">
                  Type de Suivi
                </label>
                <select
                  value={customTracking}
                  onChange={(e) => setCustomTracking(e.target.value as TrackingType)}
                  className="w-full bg-[#182030] border border-[#273248] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="weight_reps">Poids (kg) & Répétitions</option>
                  <option value="reps_only">Répétitions seules (Poids de corps)</option>
                  <option value="time">Temps / Secondes (Gainage/Statique)</option>
                  <option value="elastic_reps">Résistance Élastique & Réps</option>
                  <option value="distance_time">Distance (km) & Temps</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#8F9BB3] uppercase mb-1">
                  Équipement
                </label>
                <input
                  type="text"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  placeholder="Haltères, Élastique, Tapis, etc."
                  className="w-full bg-[#182030] border border-[#273248] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8F9BB3] uppercase mb-1">
                  Temps de repos conseillé (sec)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  step="15"
                  value={customRest}
                  onChange={(e) => setCustomRest(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#182030] border border-[#273248] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8F9BB3] uppercase mb-1">
                Conseils & Consignes Kiné
              </label>
              <textarea
                value={customTips}
                onChange={(e) => setCustomTips(e.target.value)}
                placeholder="Ex: Alignement genou-cheville, arrêt si douleur rotulienne..."
                rows={2}
                className="w-full bg-[#182030] border border-[#273248] rounded-xl px-3 py-2 text-white placeholder-[#54627d] text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#2e3b55] text-sm font-semibold text-[#8F9BB3] hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-600/30"
              >
                Enregistrer & Ajouter
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Search & Custom Exo CTA */}
            <div className="p-3 border-b border-[#202738] space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8F9BB3] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par exercice, muscle, équipement..."
                  className="w-full bg-[#182030] border border-[#273248] rounded-xl pl-9 pr-3 py-2 text-white placeholder-[#54627d] text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                        active
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-[#182030] text-[#8F9BB3] hover:text-white hover:bg-[#222c42]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Exercise Trigger banner */}
            <div className="px-4 py-2 bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border-b border-[#202738] flex items-center justify-between">
              <span className="text-xs text-[#8F9BB3]">
                Exercice manquant ou spécifique ?
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingCustom(true)}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Créer un exercice
              </button>
            </div>

            {/* Exercise List */}
            <div className="overflow-y-auto flex-1 p-2 divide-y divide-[#1b2234]">
              {filteredExercises.length === 0 ? (
                <div className="p-8 text-center text-[#8F9BB3]">
                  <p className="text-sm">Aucun exercice ne correspond à votre recherche.</p>
                  <button
                    onClick={() => setIsCreatingCustom(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Créer &quot;{searchTerm}&quot;
                  </button>
                </div>
              ) : (
                filteredExercises.map((exo) => (
                  <button
                    key={exo.id}
                    type="button"
                    onClick={() => {
                      onSelectExercise(exo);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#182030] rounded-xl transition-colors group"
                  >
                    <ExerciseThumbnail category={exo.category} iconName={exo.iconName} size={20} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                          {exo.name}
                        </h4>
                        {exo.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#8F9BB3] flex items-center gap-2 mt-0.5">
                        <span>{exo.bodyPart}</span>
                        <span>•</span>
                        <span className="text-slate-400">{exo.equipment}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1e273b] text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
