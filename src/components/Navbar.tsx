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
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-[#1b2234]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <Link
          href={isKine ? "/kine" : "/patient"}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-white tracking-tight">RedReeduc</span>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-[#8F9BB3] -mt-0.5 hidden sm:block">
              Kiné & Musculation Rééducative
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          {isKine ? (
            <>
              <Link
                href="/kine"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === "/kine"
                    ? "bg-[#182030] text-blue-400 border border-[#273248]"
                    : "text-[#8F9BB3] hover:text-white hover:bg-[#141926]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Tableau de Bord
              </Link>
              <Link
                href="/kine/routines/new"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname.includes("/routines/new")
                    ? "bg-[#182030] text-blue-400 border border-[#273248]"
                    : "text-[#8F9BB3] hover:text-white hover:bg-[#141926]"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-400" /> Créer une Séance
              </Link>
              <Link
                href="/exercises"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === "/exercises"
                    ? "bg-[#182030] text-blue-400 border border-[#273248]"
                    : "text-[#8F9BB3] hover:text-white hover:bg-[#141926]"
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" /> Pool d&apos;Exercices
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/patient"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === "/patient"
                    ? "bg-[#182030] text-blue-400 border border-[#273248]"
                    : "text-[#8F9BB3] hover:text-white hover:bg-[#141926]"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-blue-400" /> Mes Séances
              </Link>
              <Link
                href="/patient/history"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === "/patient/history"
                    ? "bg-[#182030] text-blue-400 border border-[#273248]"
                    : "text-[#8F9BB3] hover:text-white hover:bg-[#141926]"
                }`}
              >
                <History className="w-3.5 h-3.5" /> Historique & Douleur
              </Link>
              <Link
                href="/exercises"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === "/exercises"
                    ? "bg-[#182030] text-blue-400 border border-[#273248]"
                    : "text-[#8F9BB3] hover:text-white hover:bg-[#141926]"
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" /> Exercices
              </Link>
            </>
          )}
        </nav>

        {/* Profile Switcher & Action */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-[#141926] hover:bg-[#1c2335] border border-[#232b3e] rounded-2xl transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {isKine ? <Stethoscope className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{activeUser.name}</span>
                <span
                  className={`text-[9px] px-1 rounded font-extrabold uppercase ${
                    isKine
                      ? "bg-purple-950 text-purple-300 border border-purple-800"
                      : "bg-blue-950 text-blue-300 border border-blue-800"
                  }`}
                >
                  {isKine ? "Kiné" : "Patient"}
                </span>
              </div>
              <div className="text-[10px] text-[#8F9BB3] truncate max-w-[130px]">
                {isKine ? "Cabinet Dupont" : activeUser.diagnosis || "Rééducation"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8F9BB3]" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-[#121622] border border-[#232b3e] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#202738] mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9BB3]">
                    Changer de Profil
                  </p>
                  <p className="text-[10px] text-[#6b7792]">
                    Basculez instantanément pour tester les flux Kiné ou Patient
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
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                          isSelected
                            ? "bg-blue-600/15 border border-blue-500/30 text-white"
                            : "hover:bg-[#182030] text-[#8F9BB3] hover:text-white"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            u.role === "KINE"
                              ? "bg-purple-900/60 text-purple-300 border border-purple-700"
                              : "bg-blue-900/60 text-blue-300 border border-blue-700"
                          }`}
                        >
                          {u.role === "KINE" ? "K" : "P"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-white flex items-center justify-between">
                            <span className="truncate">{u.name}</span>
                            <span className="text-[9px] text-blue-400 font-bold uppercase">
                              {u.role}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#6b7792] truncate">
                            {u.diagnosis || u.clinicName || u.email}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-[#202738] flex items-center justify-between px-2">
                  <button
                    onClick={() => {
                      if (confirm("Réinitialiser toutes les données de démo ?")) {
                        resetToDefaults();
                        setIsProfileOpen(false);
                      }
                    }}
                    className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3 h-3" /> Réinitialiser données
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation bottom bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#1b2234] bg-[#0c0f17] py-2 px-1 text-[11px] font-semibold">
        {isKine ? (
          <>
            <Link
              href="/kine"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname === "/kine" ? "text-blue-400 font-bold" : "text-[#8F9BB3]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tableau de bord</span>
            </Link>
            <Link
              href="/kine/routines/new"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname.includes("/routines/new") ? "text-blue-400 font-bold" : "text-[#8F9BB3]"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nouvelle séance</span>
            </Link>
            <Link
              href="/exercises"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname === "/exercises" ? "text-blue-400 font-bold" : "text-[#8F9BB3]"
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
                pathname === "/patient" ? "text-blue-400 font-bold" : "text-[#8F9BB3]"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Entraînement</span>
            </Link>
            <Link
              href="/patient/history"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname === "/patient/history" ? "text-blue-400 font-bold" : "text-[#8F9BB3]"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Historique</span>
            </Link>
            <Link
              href="/exercises"
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
                pathname === "/exercises" ? "text-blue-400 font-bold" : "text-[#8F9BB3]"
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
