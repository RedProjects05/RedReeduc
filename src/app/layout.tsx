import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ActiveWorkoutBanner } from "@/components/ActiveWorkoutBanner";

export const metadata: Metadata = {
  title: "RedReeduc | Kinésithérapie & Rééducation du Sport",
  description:
    "Application interactive de prescription et de suivi de séances de rééducation avec l'expérience Hevy.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <ActiveWorkoutBanner />
      </body>
    </html>
  );
}
