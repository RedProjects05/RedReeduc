"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChevronDown,
  Dumbbell,
  Flame,
  History,
  LayoutDashboard,
  PlusCircle,
  RotateCcw,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import { useRedReeducStore } from "@/lib/store";

export function Navbar() {
  const pathname = usePathname();
  const { activeUser, users, setActiveUserId, resetToDefaults } = useRedReeducStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isKine = activeUser.role === "KINE";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <Link
          href={isKine ? "/kine" : "/patient"}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-slate-900 tracking-tight">RedReeduc</span>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block font-medium">
              Kinésithérapie &amp; Rééducation
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          {isKine ? (
            <>
              <Link
                href="/kine"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  pathname === "/kine"
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Tableau de Bord
              </Link>
              <Link
                href="/kine/routines/new"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  pathname.includes("/routines/new")
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <PlusCircle className="w-4 h-4 text-blue-600" /> Créer une Séance
              </Link>
              <Link
                href="/exercises"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  pathname === "/exercises"
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Dumbbell className="w-4 h-4" /> Pool d&apos;Exercices
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/patient"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  pathname === "/patient"
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Flame className="w-4 h-4 text-blue-600" /> Mon Entraînement
              </Link>
              <Link
                href="/patient/history"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  pathname === "/patient/history"
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <History className="w-4 h-4" /> Historique &amp; Douleur
              </Link>
              <Link
                href="/exercises"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  pathname === "/exercises"
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Dumbbell className="w-4 h-4" /> Exercices
              </Link>
            </>
          )}
        </nav>

        {/* Profile Switcher (Reda / Anaïs) */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-2xl transition-colors text-left cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs ${
                isKine
                  ? "bg-gradient-to-tr from-purple-600 to-indigo-600"
                  : "bg-gradient-to-tr from-blue-600 to-cyan-600"
              }`}
            >
              {isKine ? <Stethoscope className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>{activeUser.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                    isKine
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  {isKine ? "Kiné" : "Patient"}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                {isKine ? "Cabinet Anaïs" : activeUser.diagnosis ? activeUser.diagnosis.slice(0, 20) + "..." : "Profil Reda"}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Changer de Profil
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Basculez entre le kiné et le patient
                  </p>
                </div>

                <div className="space-y-1">
                  {users.map((u) => {
                    const isSelected = u.id === activeUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setActiveUserId(u.id);
                          setIsProfileOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 border border-blue-200 text-blue-900"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            u.role === "KINE"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {u.role === "KINE" ? "K" : "P"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                            <span>{u.name}</span>
                            <span className="text-[9px] text-blue-600 font-bold uppercase">
                              {u.role}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">
                            {u.diagnosis || u.clinicName || u.email}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2">
                  <button
                    onClick={() => {
                      if (confirm("Réinitialiser les données ?")) {
                        resetToDefaults();
                        setIsProfileOpen(false);
                      }
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Réinitialiser
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 px-1 text-[11px] font-semibold">
        {isKine ? (
          <>
            <Link
              href="/kine"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname === "/kine" ? "text-blue-600 font-bold" : "text-slate-600"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tableau de bord</span>
            </Link>
            <Link
              href="/kine/routines/new"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname.includes("/routines/new") ? "text-blue-600 font-bold" : "text-slate-600"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer séance</span>
            </Link>
            <Link
              href="/exercises"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname === "/exercises" ? "text-blue-600 font-bold" : "text-slate-600"
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Exercices</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/patient"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname === "/patient" ? "text-blue-600 font-bold" : "text-slate-600"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Entraînement</span>
            </Link>
            <Link
              href="/patient/history"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname === "/patient/history" ? "text-blue-600 font-bold" : "text-slate-600"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Historique</span>
            </Link>
            <Link
              href="/exercises"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname === "/exercises" ? "text-blue-600 font-bold" : "text-slate-600"
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Exercices</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
