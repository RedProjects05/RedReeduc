"use client";

import React from "react";
import {
  Activity,
  ArrowUp,
  Bike,
  Compass,
  Dumbbell,
  Eye,
  Flame,
  Footprints,
  Hammer,
  Repeat,
  RotateCw,
  Shield,
  Smile,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ExerciseCategory } from "@/lib/types";

interface ExerciseThumbnailProps {
  category: ExerciseCategory;
  iconName?: string;
  className?: string;
  size?: number;
}

export function ExerciseThumbnail({
  category,
  iconName,
  className = "w-11 h-11",
  size = 20,
}: ExerciseThumbnailProps) {
  const renderIcon = () => {
    switch (iconName) {
      case "Dumbbell":
        return <Dumbbell size={size} className="text-blue-600" />;
      case "Shield":
        return <Shield size={size} className="text-emerald-600" />;
      case "Activity":
        return <Activity size={size} className="text-amber-600" />;
      case "RotateCw":
        return <RotateCw size={size} className="text-indigo-600" />;
      case "Hammer":
        return <Hammer size={size} className="text-orange-600" />;
      case "Footprints":
        return <Footprints size={size} className="text-cyan-600" />;
      case "Bike":
        return <Bike size={size} className="text-teal-600" />;
      case "Compass":
        return <Compass size={size} className="text-purple-600" />;
      case "Flame":
        return <Flame size={size} className="text-rose-600" />;
      case "Zap":
        return <Zap size={size} className="text-amber-500" />;
      case "Repeat":
        return <Repeat size={size} className="text-pink-600" />;
      case "ArrowUp":
        return <ArrowUp size={size} className="text-sky-600" />;
      case "Eye":
        return <Eye size={size} className="text-violet-600" />;
      case "Target":
        return <Target size={size} className="text-emerald-600" />;
      case "TrendingUp":
        return <TrendingUp size={size} className="text-lime-600" />;
      case "Smile":
        return <Smile size={size} className="text-cyan-600" />;
      default:
        if (category === "Genou") return <Activity size={size} className="text-amber-600" />;
        if (category === "Épaule") return <RotateCw size={size} className="text-indigo-600" />;
        if (category === "Cardio & Échauffement") return <Footprints size={size} className="text-cyan-600" />;
        if (category === "Dos & Tronc") return <Shield size={size} className="text-emerald-600" />;
        if (category === "Cheville & Pied") return <Compass size={size} className="text-purple-600" />;
        return <Dumbbell size={size} className="text-blue-600" />;
    }
  };

  return (
    <div
      className={`rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs ${className}`}
    >
      {renderIcon()}
    </div>
  );
}
