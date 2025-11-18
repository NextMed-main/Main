"use client";

import { LandingPage } from "@/components/landing-page";
import { LoginScreen } from "@/components/login-screen";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// Dynamic imports for code splitting (要件 10.5)
const PatientDashboard = dynamic(
  () => import("@/components/patient-dashboard").then(mod => ({ default: mod.PatientDashboard })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const ResearcherDashboard = dynamic(
  () => import("@/components/researcher-dashboard").then(mod => ({ default: mod.ResearcherDashboard })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const InstitutionDashboard = dynamic(
  () => import("@/components/institution-dashboard").then(mod => ({ default: mod.InstitutionDashboard })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#060918] to-[#0f1629]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-300/70">Loading dashboard...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export type UserRole = "patient" | "researcher" | "institution" | null;

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Register Service Worker for PWA
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);
        })
        .catch((err) => {
          console.error("[PWA] Service Worker registration failed:", err);
        });
    }
  }, []);

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!userRole) {
    return <LoginScreen onLogin={setUserRole} />;
  }

  if (userRole === "patient") {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PatientDashboard onLogout={() => setUserRole(null)} />
      </Suspense>
    );
  }

  if (userRole === "researcher") {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ResearcherDashboard onLogout={() => setUserRole(null)} />
      </Suspense>
    );
  }

  if (userRole === "institution") {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <InstitutionDashboard onLogout={() => setUserRole(null)} />
      </Suspense>
    );
  }

  return null;
}
