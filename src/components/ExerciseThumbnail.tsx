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
  className = "w-12 h-12",
  size = 22,
}: ExerciseThumbnailProps) {
  // Select icon based on iconName or fallback to category
  const renderIcon = () => {
    switch (iconName) {
      case "Dumbbell":
        return <Dumbbell size={size} className="text-blue-400" />;
      case "Shield":
        return <Shield size={size} className="text-emerald-400" />;
      case "Activity":
        return <Activity size={size} className="text-amber-400" />;
      case "RotateCw":
        return <RotateCw size={size} className="text-indigo-400" />;
      case "Hammer":
        return <Hammer size={size} className="text-orange-400" />;
      case "Footprints":
        return <Footprints size={size} className="text-cyan-400" />;
      case "Bike":
        return <Bike size={size} className="text-teal-400" />;
      case "Compass":
        return <Compass size={size} className="text-purple-400" />;
      case "Flame":
        return <Flame size={size} className="text-rose-400" />;
      case "Zap":
        return <Zap size={size} className="text-yellow-400" />;
      case "Repeat":
        return <Repeat size={size} className="text-pink-400" />;
      case "ArrowUp":
        return <ArrowUp size={size} className="text-sky-400" />;
      case "Eye":
        return <Eye size={size} className="text-violet-400" />;
      case "Target":
        return <Target size={size} className="text-emerald-400" />;
      case "TrendingUp":
        return <TrendingUp size={size} className="text-lime-400" />;
      case "Smile":
        return <Smile size={size} className="text-cyan-400" />;
      default:
        // Default category fallback
        if (category === "Genou") return <Activity size={size} className="text-amber-400" />;
        if (category === "Épaule") return <RotateCw size={size} className="text-indigo-400" />;
        if (category === "Cardio & Échauffement") return <Footprints size={size} className="text-cyan-400" />;
        if (category === "Dos & Tronc") return <Shield size={size} className="text-emerald-400" />;
        if (category === "Cheville & Pied") return <Compass size={size} className="text-purple-400" />;
        return <Dumbbell size={size} className="text-blue-400" />;
    }
  };

  return (
    <div
      className={`rounded-full bg-[#182030] border border-[#273248] flex items-center justify-center shrink-0 ${className}`}
    >
      {renderIcon()}
    </div>
  );
}
