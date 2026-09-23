"use client";

import React from "react";
import { Bell, Clock, Monitor, Settings, Smartphone, Volume2, X } from "lucide-react";
import { WorkoutSettings } from "@/lib/types";

interface WorkoutSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WorkoutSettings;
  onSaveSettings: (settings: WorkoutSettings) => void;
}

export function WorkoutSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}: WorkoutSettingsModalProps) {
  const [localSettings, setLocalSettings] = React.useState<WorkoutSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof WorkoutSettings) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden space-y-4 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Paramètres de la séance
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Personnalisez vos alertes et minuteurs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Toggles List */}
        <div className="space-y-3 text-xs">
          {/* Sounds */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Sons de validation</span>
                <span className="text-[11px] text-slate-500">Signal sonore à chaque série validée</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("soundEnabled")}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localSettings.soundEnabled ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  localSettings.soundEnabled ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Auto Rest Timer */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Minuteur automatique</span>
                <span className="text-[11px] text-slate-500">Démarre le repos dès qu&apos;une série est cochée</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("restTimerAutoStart")}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localSettings.restTimerAutoStart ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  localSettings.restTimerAutoStart ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Default Rest Duration */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 block">Durée de repos par défaut</span>
              <span className="font-mono font-bold text-blue-600">{localSettings.defaultRestSeconds}s</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[30, 45, 60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setLocalSettings((prev) => ({ ...prev, defaultRestSeconds: sec }))}
                  className={`py-1.5 rounded-xl font-bold text-[11px] border transition-colors cursor-pointer ${
                    localSettings.defaultRestSeconds === sec
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Haptic Vibration */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Retour haptique</span>
                <span className="text-[11px] text-slate-500">Vibration sur mobile lors de la validation</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("hapticsEnabled")}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localSettings.hapticsEnabled ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  localSettings.hapticsEnabled ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Keep Screen Awake */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Monitor className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Garder l&apos;écran allumé</span>
                <span className="text-[11px] text-slate-500">Évite la mise en veille pendant l&apos;entraînement</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("keepScreenAwake")}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localSettings.keepScreenAwake ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  localSettings.keepScreenAwake ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Enregistrer les réglages
          </button>
        </div>
      </div>
    </div>
  );
}
