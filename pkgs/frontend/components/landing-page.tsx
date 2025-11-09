"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Database, Lock, Zap, Users, Building2, FlaskConical, ArrowRight, CheckCircle2 } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-bold">NextMed</span>
          </div>
          <Button onClick={onGetStarted} variant="default">
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-16 space-y-6">
          <Badge variant="secondary" className="mb-4">
            Powered by Midnight ZK Technology
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
            Medical Data Platform
            <br />
            <span className="text-primary">Without Compromising Privacy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            NextMed uses zero-knowledge proofs to enable medical research while keeping patient data completely
            confidential. Patients earn rewards, researchers gain insights, institutions contribute data.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8">
              Launch Platform
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>For Patients</CardTitle>
              <CardDescription>Control your data and earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Manage consent for data usage</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Earn tokens when data is used</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Full audit trail of data access</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-secondary/20">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <FlaskConical className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>For Researchers</CardTitle>
              <CardDescription>Analyze data without seeing PII</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Query anonymized medical records</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">AI-powered analysis tools</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">SQL and natural language queries</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-accent/20">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>For Companies</CardTitle>
              <CardDescription>Contribute data securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Upload encrypted medical records</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Earn points for contributions</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Seamless EHR integration</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Section */}
        <Card className="shadow-lg mb-16 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Zero-Knowledge Privacy Protection</CardTitle>
            <CardDescription className="text-base">Built on Midnight's cutting-edge ZK technology</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Encrypted Storage</h3>
                <p className="text-sm text-muted-foreground">All data encrypted at rest and in transit</p>
              </div>

              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold">ZK Proofs</h3>
                <p className="text-sm text-muted-foreground">Verify data without revealing content</p>
              </div>

              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <Database className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold">Confidential Computing</h3>
                <p className="text-sm text-muted-foreground">Analysis in secure enclaves</p>
              </div>

              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold">Fast & Scalable</h3>
                <p className="text-sm text-muted-foreground">Real-time queries on millions of records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-12">
          <h2 className="text-4xl font-bold text-balance">Ready to Transform Medical Research?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Join NextMed today and be part of the privacy-preserving medical data revolution.
          </p>
          <Button size="lg" onClick={onGetStarted} className="text-lg px-8">
            Access Platform
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </main>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 NextMed. Powered by Midnight ZK Technology.</p>
        </div>
      </footer>
    </div>
  )
}
