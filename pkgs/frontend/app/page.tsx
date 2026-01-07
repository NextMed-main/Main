"use client";

import { LandingPage } from "@/components/landing-page";
import { LoginScreen } from "@/components/login-screen";
import { ErrorBoundary, SuspenseFallback } from "@/components/ui/error-boundary";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// Dynamic imports for code splitting (要件 10.5)
const PatientDashboard = dynamic(
  () => import("@/components/patient-dashboard").then(mod => ({ default: mod.PatientDashboard })),
  {
    loading: () => <SuspenseFallback message="Loading Patient Portal..." />,
    ssr: false,
  }
);

const ResearcherDashboard = dynamic(
  () => import("@/components/researcher-dashboard").then(mod => ({ default: mod.ResearcherDashboard })),
  {
    loading: () => <SuspenseFallback message="Loading Research Portal..." />,
    ssr: false,
  }
);

const InstitutionDashboard = dynamic(
  () => import("@/components/institution-dashboard").then(mod => ({ default: mod.InstitutionDashboard })),
  {
    loading: () => <SuspenseFallback message="Loading Institution Portal..." />,
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
      <ErrorBoundary title="Patient Dashboard Error" onError={(e) => console.error("Patient Dashboard Error:", e)}>
        <Suspense fallback={<SuspenseFallback message="Loading Patient Portal..." />}>
          <PatientDashboard onLogout={() => setUserRole(null)} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (userRole === "researcher") {
    return (
      <ErrorBoundary title="Researcher Dashboard Error" onError={(e) => console.error("Researcher Dashboard Error:", e)}>
        <Suspense fallback={<SuspenseFallback message="Loading Research Portal..." />}>
          <ResearcherDashboard onLogout={() => setUserRole(null)} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (userRole === "institution") {
    return (
      <ErrorBoundary title="Institution Dashboard Error" onError={(e) => console.error("Institution Dashboard Error:", e)}>
        <Suspense fallback={<SuspenseFallback message="Loading Institution Portal..." />}>
          <InstitutionDashboard onLogout={() => setUserRole(null)} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return null;
}

