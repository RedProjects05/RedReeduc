"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  Dumbbell,
  Plus,
  Search,
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

  // New custom exercise form state
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

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newExo = await RedReeducStore.addCustomExercise({
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              {isCreatingCustom ? "Créer un Exercice Personnalisé" : "Ajouter un Exercice"}
            </h3>
          </div>
          <button
            onClick={() => {
              if (isCreatingCustom) setIsCreatingCustom(false);
              else onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Custom View */}
        {isCreatingCustom ? (
          <form onSubmit={handleCreateCustom} className="p-4 overflow-y-auto space-y-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nom de l&apos;exercice *
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex: Fente bulgare assistée, Ischios TRX..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catégorie Anatomique
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as ExerciseCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                >
                  {CATEGORIES.filter((c) => c !== "Tous").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Type de Suivi
                </label>
                <select
                  value={customTracking}
                  onChange={(e) => setCustomTracking(e.target.value as TrackingType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                >
                  <option value="weight_reps">Poids (kg) &amp; Répétitions</option>
                  <option value="reps_only">Répétitions seules (Poids de corps)</option>
                  <option value="time">Temps / Secondes (Gainage/Statique)</option>
                  <option value="elastic_reps">Résistance Élastique &amp; Réps</option>
                  <option value="distance_time">Distance (km) &amp; Temps</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Équipement
                </label>
                <input
                  type="text"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  placeholder="Haltères, Élastique, Tapis..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Temps de repos conseillé (sec)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  step="15"
                  value={customRest}
                  onChange={(e) => setCustomRest(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Conseils &amp; Consignes Kiné
              </label>
              <textarea
                value={customTips}
                onChange={(e) => setCustomTips(e.target.value)}
                placeholder="Ex: Alignement genou-cheville, arrêt si douleur rotulienne..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white resize-none font-medium"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Enregistrer &amp; Ajouter
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Search */}
            <div className="p-3 border-b border-slate-100 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par exercice, muscle, équipement..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
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
                      className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/60"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Exercise Trigger */}
            <div className="px-4 py-2 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between">
              <span className="text-xs text-blue-900 font-medium">
                Exercice non listé ?
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingCustom(true)}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Créer un exercice sur-mesure
              </button>
            </div>

            {/* Exercise List */}
            <div className="overflow-y-auto flex-1 p-2 divide-y divide-slate-100">
              {filteredExercises.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-sm">Aucun exercice trouvé.</p>
                  <button
                    onClick={() => setIsCreatingCustom(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
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
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer"
                  >
                    <ExerciseThumbnail category={exo.category} iconName={exo.iconName} size={20} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {exo.name}
                        </h4>
                        {exo.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                        <span>{exo.bodyPart}</span>
                        <span>•</span>
                        <span className="text-slate-600">{exo.equipment}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
