"use client";

import {
  ArrowRight,
  CheckCircle2,
  Database,
  Shield,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { ParticleBackground } from "@/components/design/background";
import { Button } from "@/components/design/button";
import { Card } from "@/components/design/card";

interface LandingPageProps {
  onGetStarted: () => void;
}

type Language = "en" | "ja";

export const LandingPage = React.memo(function LandingPage({
  onGetStarted,
}: LandingPageProps) {
  const [lang, setLang] = useState<Language>("en");

  const content = {
    en: {
      nav: {
        about: "About",
        solution: "Solution",
        partners: "Partners",
        roadmap: "Roadmap",
      },
      hero: {
        title: "Protecting Medical Data Sovereignty with ZK",
        subtitle:
          "Next-Generation AI Analytics Platform: Bridging the gap between data existence and safe utilization.",
        cta: "Get Started",
      },
      problem: {
        title: "The Problem",
        subtitle: "Why medical data remains locked away",
        cards: [
          {
            title: "Lack of Trust",
            description:
              "Stakeholders hesitate to provide data without clear consent or visible benefits.",
          },
          {
            title: "Technical Fragmentation",
            description:
              "Infrastructure and data quality differ across institutions, preventing AI-ready usage.",
          },
          {
            title: "Incentive Gap",
            description:
              "Lack of rewards for data providers leads to stagnant data and market failure.",
          },
        ],
      },
      solution: {
        title: "Our Solution",
        subtitle: "Zero-knowledge technology meets healthcare",
        cards: [
          {
            title: "Midnight ZK Technology",
            description:
              "Securely masks EHR data, enabling AI analysis without accessing personal information.",
            icon: Shield,
          },
          {
            title: "Incentive Model",
            description:
              "Creates a transparent ecosystem where value is returned to patients and providers.",
            icon: TrendingUp,
          },
        ],
      },
      vendors: {
        title: "Partnership with Leading EHR Vendors",
        subtitle: "Building the future of medical data together",
        value: "Value Proposition for EHR Vendors",
        benefits: [
          {
            title: "New Revenue Streams",
            description:
              "Unlock global expansion opportunities and new income through privacy-preserving collaboration.",
          },
          {
            title: "AI-Ready Infrastructure",
            description:
              "Integrate with NextMed's ZK-masking to deliver value-added services without heavy anonymization costs.",
          },
          {
            title: "Interoperability",
            description:
              "Standardize fragmented data formats (e.g., SS-MIX2) for secure research use.",
          },
        ],
        partners: "Expected Key Integration Partners",
      },
      market: {
        title: "Market Opportunity",
        stats: [
          { value: "$826.7B", label: "AI Healthcare Market by 2030" },
          { value: "$2.3B", label: "Average cost per new drug" },
          { value: "10-15 years", label: "Timeline for drug development" },
        ],
      },
      roadmap: {
        title: "Roadmap",
        subtitle: "Our journey to transform healthcare data",
        phases: [
          {
            period: "2026 Q1",
            title: "Project Launch",
            description:
              "Project start and discussions with EHR vendors and clinics.",
          },
          {
            period: "2026 Q2",
            title: "API Integration",
            description:
              "API integration partnership with Japanese EHR vendors and expansion into the Asia market.",
          },
          {
            period: "2026 Q4",
            title: "Global Expansion",
            description:
              "Partnership with universities/medical companies and global provision (US, Africa, India).",
          },
        ],
      },
      footer: {
        cta: "Ready to transform medical data?",
        button: "Get Started",
      },
    },
    ja: {
      nav: {
        about: "概要",
        solution: "ソリューション",
        partners: "パートナー",
        roadmap: "ロードマップ",
      },
      hero: {
        title: "ゼロ知識証明（ZK）で医療データの主権を守る",
        subtitle:
          "次世代AI解析プラットフォーム：「データはあるが活用できない」現状を打破し、安全な利用を実現。",
        cta: "始める",
      },
      problem: {
        title: "課題",
        subtitle: "医療データが活用されない理由",
        cards: [
          {
            title: "信頼の欠如",
            description:
              "明確な同意や目に見える利益がないため、ステークホルダーがデータ提供を躊躇している。",
          },
          {
            title: "技術的分断",
            description:
              "施設ごとにインフラやデータ品質が異なり、AIで即利用可能な状態になっていない。",
          },
          {
            title: "インセンティブの不在",
            description:
              "データ提供者への還元がないため、データが停滞し市場が発展しない。",
          },
        ],
      },
      solution: {
        title: "ソリューション",
        subtitle: "ゼロ知識証明技術とヘルスケアの融合",
        cards: [
          {
            title: "Midnight ZK技術",
            description:
              "EHRデータを安全にマスクし、個人情報にアクセスすることなくAI解析を可能にする。",
            icon: Shield,
          },
          {
            title: "インセンティブモデル",
            description:
              "患者や提供者に価値を還元する、透明性の高いエコシステムを構築する。",
            icon: TrendingUp,
          },
        ],
      },
      vendors: {
        title: "主要EHRベンダーとの連携",
        subtitle: "医療データの未来を共に創る",
        value: "EHRベンダーへの提供価値",
        benefits: [
          {
            title: "新規収益源",
            description:
              "プライバシーを保護した連携により、グローバル展開の機会と新たな収益源を確保。",
          },
          {
            title: "AI対応インフラ",
            description:
              "NextMedのZK技術と統合することで、高額な匿名化コストをかけずに付加価値サービスを提供。",
          },
          {
            title: "相互運用性",
            description:
              "断片化されたデータ形式（SS-MIX2等）を標準化し、安全な研究利用を可能にする。",
          },
        ],
        partners: "主要連携パートナー（想定）",
      },
      market: {
        title: "市場機会",
        stats: [
          { value: "$826.7B", label: "2030年までのAIヘルスケア市場規模" },
          { value: "$2.3B", label: "新薬開発の平均コスト" },
          { value: "10〜15年", label: "創薬開発期間" },
        ],
      },
      roadmap: {
        title: "ロードマップ",
        subtitle: "ヘルスケアデータ変革への道のり",
        phases: [
          {
            period: "2026年 Q1",
            title: "プロジェクト開始",
            description:
              "プロジェクト開始、EHRベンダーおよびクリニックとの協議。",
          },
          {
            period: "2026年 Q2",
            title: "API連携",
            description:
              "日本のEHRベンダーとのAPI連携提携、およびアジア市場への展開。",
          },
          {
            period: "2026年 Q4",
            title: "グローバル展開",
            description:
              "大学・医療企業との提携、およびグローバル展開（米国、アフリカ、インド等）。",
          },
        ],
      },
      footer: {
        cta: "医療データを変革する準備はできましたか？",
        button: "始める",
      },
    },
  };

  const t = content[lang];

  const ehrVendors = [
    { name: "Fujitsu", product: "HumanBridge", category: "Enterprise" },
    { name: "NEC", product: "ID-Link", category: "Enterprise" },
    { name: "CSI", product: "MI・RA・Is", category: "Enterprise" },
    { name: "Medley", product: "CLINICS", category: "Cloud" },
    { name: "M3", product: "M3 Digikar", category: "Cloud" },
    { name: "Henry", product: "Henry", category: "Cloud" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <ParticleBackground />

      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav
        className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="NextMed Logo"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-slate-900">NextMed</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#problem"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                {t.nav.about}
              </a>
              <a
                href="#solution"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                {t.nav.solution}
              </a>
              <a
                href="#vendors"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                {t.nav.partners}
              </a>
              <a
                href="#roadmap"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                {t.nav.roadmap}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={lang === "en" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLang("en")}
              >
                EN
              </Button>
              <Button
                variant={lang === "ja" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLang("ja")}
              >
                日本語
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main id="main-content" className="relative z-10" role="main">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 text-balance">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto text-pretty leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="primary"
                glow
                onClick={onGetStarted}
                aria-label="Get started with NextMed platform"
              >
                {t.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section
          id="problem"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {t.problem.title}
              </h2>
              <p className="text-xl text-slate-600">{t.problem.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {t.problem.cards.map((card, index) => (
                <Card key={index} variant="default" className="p-8 bg-white">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {t.solution.title}
              </h2>
              <p className="text-xl text-slate-600">{t.solution.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {t.solution.cards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={index}
                    variant="primary"
                    className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {card.title}
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      {card.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* EHR Vendors Section */}
        <section
          id="vendors"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {t.vendors.title}
              </h2>
              <p className="text-xl text-slate-600 mb-12">
                {t.vendors.subtitle}
              </p>
            </div>

            <div className="mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                {t.vendors.value}
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {t.vendors.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <h4 className="text-xl font-bold text-slate-900">
                        {benefit.title}
                      </h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed ml-9">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                {t.vendors.partners}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {ehrVendors.map((vendor, index) => (
                  <Card
                    key={index}
                    variant="default"
                    hover
                    className="bg-white border-slate-200 hover:border-blue-300 transition-colors p-6 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="font-bold text-slate-900 mb-1">
                      {vendor.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {vendor.product}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Market Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
              {t.market.title}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {t.market.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg"
                >
                  <div className="text-5xl font-bold text-blue-600 mb-3">
                    {stat.value}
                  </div>
                  <div className="text-slate-700 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section
          id="roadmap"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {t.roadmap.title}
              </h2>
              <p className="text-xl text-slate-600">{t.roadmap.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {t.roadmap.phases.map((phase, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-8 rounded-lg border-2 border-blue-100 h-full">
                    <div className="text-sm font-bold text-blue-600 mb-2">
                      {phase.period}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {phase.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                  {index < t.roadmap.phases.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-blue-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-cyan-500">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              {t.footer.cta}
            </h2>
            <Button
              size="lg"
              variant="accent"
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-slate-100"
              aria-label="Get started with NextMed platform"
            >
              {t.footer.button}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 bg-slate-900"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="/logo.jpg"
              alt="NextMed Logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-white">NextMed</span>
          </div>
          <p className="text-slate-400">
            © 2026 NextMed. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
});
