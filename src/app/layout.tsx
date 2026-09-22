import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "RedReeduc | Kinésithérapie & Musculation Rééducative",
  description:
    "Application de prescription et suivi de rééducation physique, inspirée par l'ergonomie et l'interface Hevy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#0b0d13] text-[#f8fafc]">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
      </body>
    </html>
  );
}
