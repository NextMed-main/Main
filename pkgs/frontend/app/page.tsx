"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { LoginScreen } from "@/components/login-screen"
import { PatientDashboard } from "@/components/patient-dashboard"
import { ResearcherDashboard } from "@/components/researcher-dashboard"
import { InstitutionDashboard } from "@/components/institution-dashboard"

export type UserRole = "patient" | "researcher" | "institution" | null

export default function Home() {
  const [showLanding, setShowLanding] = useState(true)
  const [userRole, setUserRole] = useState<UserRole>(null)

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />
  }

  if (!userRole) {
    return <LoginScreen onLogin={setUserRole} />
  }

  if (userRole === "patient") {
    return <PatientDashboard onLogout={() => setUserRole(null)} />
  }

  if (userRole === "researcher") {
    return <ResearcherDashboard onLogout={() => setUserRole(null)} />
  }

  if (userRole === "institution") {
    return <InstitutionDashboard onLogout={() => setUserRole(null)} />
  }

  return null
}
