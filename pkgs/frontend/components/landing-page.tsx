"use client";

import { GlassCard } from "@/components/cyber/glass-card";
import { GradientText } from "@/components/cyber/gradient-text";
import { NeonButton } from "@/components/cyber/neon-button";
import { ParticleBackground } from "@/components/cyber/particle-background";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Database,
  FlaskConical,
  Lock,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useRef } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
}

// React.memo for optimization (要件 10.3)
export const LandingPage = React.memo(function LandingPage({ onGetStarted }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // useMemo for observer options (要件 10.4)
  const observerOptions = React.useMemo(() => ({ threshold: 0.1 }), []);

  // useCallback for observer callback (要件 10.4)
  const handleIntersection = React.useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in", "fade-in", "slide-in-from-bottom", "duration-700");
      }
    });
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const refs = [heroRef, featuresRef, techRef, ctaRef];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [handleIntersection, observerOptions]);

  return (
    <div className="relative min-h-screen bg-[rgb(var(--bg-dark))] overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground
        particleCount={80}
        particleColor="#06b6d4"
        particleSize={2}
        speed={0.5}
        interactive={true}
      />

      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 z-0 cyber-mesh-bg opacity-30" />

      {/* スキップリンク（要件 9.2: キーボードナビゲーション） */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section - Responsive Header (要件 8.1, 8.2, 8.3) */}
      <header className="relative z-10 border-b border-white/10 glass" role="banner">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="/logo.jpg" 
              alt="NextMed Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
            />
            <GradientText as="span" className="text-xl sm:text-2xl font-bold" gradient="default">
              NextMed
            </GradientText>
          </div>
          <NeonButton 
            onClick={onGetStarted} 
            variant="accent" 
            size="sm" 
            glow 
            className="sm:hidden"
            aria-label="Get started with NextMed platform"
          >
            Start
          </NeonButton>
          <NeonButton 
            onClick={onGetStarted} 
            variant="accent" 
            size="md" 
            glow 
            className="hidden sm:inline-flex"
            aria-label="Get started with NextMed platform"
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
          </NeonButton>
        </div>
      </header>

      <main id="main-content" className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-6xl" role="main">
        {/* Hero - Responsive Typography (要件 8.1: モバイル最適化) */}
        <section ref={heroRef} className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6 opacity-0" aria-labelledby="hero-heading">
          <Badge variant="secondary" className="mb-2 sm:mb-4 glass-accent border-accent/30 text-xs sm:text-sm" role="status">
            Powered by Midnight ZK Technology
          </Badge>
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight px-2">
            <GradientText as="span" gradient="default" animate>
              Medical Data Platform
            </GradientText>
            <br />
            <span className="text-white">Without Compromising Privacy</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto text-balance leading-relaxed px-4">
            NextMed uses zero-knowledge proofs to enable medical research while
            keeping patient data completely confidential. Patients earn rewards,
            researchers gain insights, institutions contribute data.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 px-4">
            <NeonButton 
              size="lg" 
              onClick={onGetStarted} 
              variant="primary" 
              glow 
              pulse 
              className="w-full sm:w-auto touch-manipulation"
              aria-label="Launch NextMed platform"
            >
              Launch Platform
              <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
            </NeonButton>
          </div>
        </section>

        {/* Features Grid - Responsive Layout (要件 8.1, 8.2, 8.3: モバイル1列、タブレット2列、デスクトップ3列) */}
        <section ref={featuresRef} className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16 opacity-0" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Platform Features</h2>
          
          <GlassCard 
            variant="primary" 
            hover 
            className="p-4 sm:p-6 touch-manipulation active:scale-95 transition-transform"
            aria-labelledby="patient-feature-heading"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-3 sm:mb-4 neon-glow-primary" aria-hidden="true">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
            </div>
            <h3 id="patient-feature-heading" className="text-lg sm:text-xl font-bold mb-2 text-white">For Patients</h3>
            <p className="text-sm text-slate-300 mb-3 sm:mb-4">
              Control your data and earn rewards
            </p>
            <ul className="space-y-3" role="list">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  Manage consent for data usage
                </p>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  Earn tokens when data is used
                </p>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  Full audit trail of data access
                </p>
              </li>
            </ul>
          </GlassCard>

          <GlassCard 
            variant="secondary" 
            hover 
            className="p-4 sm:p-6 touch-manipulation active:scale-95 transition-transform"
            aria-labelledby="researcher-feature-heading"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3 sm:mb-4 neon-glow-secondary" aria-hidden="true">
              <FlaskConical className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
            </div>
            <h3 id="researcher-feature-heading" className="text-lg sm:text-xl font-bold mb-2 text-white">For Researchers</h3>
            <p className="text-sm text-slate-300 mb-3 sm:mb-4">
              Analyze data without seeing PII
            </p>
            <ul className="space-y-3" role="list">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  Query anonymized medical records
                </p>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  AI-powered analysis tools
                </p>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  SQL and natural language queries
                </p>
              </li>
            </ul>
          </GlassCard>

          <GlassCard 
            variant="accent" 
            hover 
            className="p-4 sm:p-6 touch-manipulation active:scale-95 transition-transform"
            aria-labelledby="company-feature-heading"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3 sm:mb-4 neon-glow-accent" aria-hidden="true">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
            </div>
            <h3 id="company-feature-heading" className="text-lg sm:text-xl font-bold mb-2 text-white">For Companies</h3>
            <p className="text-sm text-slate-300 mb-3 sm:mb-4">
              Contribute data securely
            </p>
            <ul className="space-y-3" role="list">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  Upload encrypted medical records
                </p>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  Earn points for contributions
                </p>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  Seamless EHR integration
                </p>
              </li>
            </ul>
          </GlassCard>
        </section>

        {/* Technology Section - Responsive Grid (要件 8.1, 8.2, 8.3) */}
        <section ref={techRef} className="opacity-0" aria-labelledby="technology-heading">
          <GlassCard 
            variant="default" 
            className="p-4 sm:p-6 lg:p-8 mb-12 sm:mb-16"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 id="technology-heading" className="text-2xl sm:text-3xl font-bold mb-2">
                <GradientText gradient="default">
                  Zero-Knowledge Privacy Protection
                </GradientText>
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Built on Midnight's cutting-edge ZK technology
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" role="list">
              <article className="text-center space-y-2 touch-manipulation active:scale-95 transition-transform">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto neon-glow-primary" aria-hidden="true">
                  <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-white">Encrypted Storage</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  All data encrypted at rest and in transit
                </p>
              </article>

              <article className="text-center space-y-2 touch-manipulation active:scale-95 transition-transform">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto neon-glow-secondary" aria-hidden="true">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-white">ZK Proofs</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Verify data without revealing content
                </p>
              </article>

              <article className="text-center space-y-2 touch-manipulation active:scale-95 transition-transform">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto neon-glow-accent" aria-hidden="true">
                  <Database className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-white">Confidential Computing</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Analysis in secure enclaves
                </p>
              </article>

              <article className="text-center space-y-2 touch-manipulation active:scale-95 transition-transform">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto neon-glow-secondary" aria-hidden="true">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-white">Fast & Scalable</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Real-time queries on millions of records
                </p>
              </article>
            </div>
          </GlassCard>
        </section>

        {/* CTA Section - Responsive (要件 8.1) */}
        <section ref={ctaRef} className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 px-4 opacity-0" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
            <GradientText gradient="default" animate>
              Ready to Transform Medical Research?
            </GradientText>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto text-balance">
            Join NextMed today and be part of the privacy-preserving medical
            data revolution.
          </p>
          <NeonButton 
            size="lg" 
            onClick={onGetStarted} 
            variant="accent" 
            glow 
            pulse 
            className="w-full sm:w-auto touch-manipulation"
            aria-label="Access NextMed platform"
          >
            Access Platform
            <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
          </NeonButton>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-6 sm:py-8 mt-12 sm:mt-16 glass" role="contentinfo">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-slate-300">
          <p>© 2025 NextMed. Powered by Midnight ZK Technology.</p>
        </div>
      </footer>
    </div>
  );
});
