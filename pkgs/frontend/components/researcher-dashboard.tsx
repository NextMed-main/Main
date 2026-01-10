"use client";

import { CyberChart } from "@/components/cyber/cyber-chart";
import { GlassCard } from "@/components/cyber/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { WalletButton } from "@/components/wallet/wallet-button";
import { EHR_PROVIDERS, type EHRProvider } from "@/lib/ehr-providers";
import {
    Activity,
    BarChart3,
    CheckCircle2,
    Code2,
    Coins,
    CreditCard,
    Database,
    Filter,
    LogOut,
    MessageSquare,
    Search,
    Shield,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react";
import { useState } from "react";

interface ResearcherDashboardProps {
  onLogout: () => void;
}

export function ResearcherDashboard({ onLogout }: ResearcherDashboardProps) {
  const [activeTab, setActiveTab] = useState("ai-chat");
  const [aiQuery, setAiQuery] = useState(
    "Show me hypertension rates by age group in Suginami District",
  );
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT age_group, COUNT(*) as count\nFROM medical_records\nWHERE condition = 'hypertension'\nGROUP BY age_group",
  );
  const [ageFilter, setAgeFilter] = useState("");
  const [symptomFilter, setSymptomFilter] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [selectedEHR, setSelectedEHR] = useState<EHRProvider | null>(null);
  const [showEHRSelector, setShowEHRSelector] = useState(false);

  const handleConnectEHR = (providerId: string) => {
    const provider = EHR_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      setSelectedEHR(provider);
      setShowEHRSelector(false);
    }
  };

  const handleExecuteAnalysis = () => {
    if (!hasSubscription) {
      setShowPaymentModal(true);
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const handleTokenPayment = () => {
    setHasSubscription(true);
    setShowPaymentModal(false);
    alert(
      "Payment successful! 1000 NEXT tokens deducted. You now have access to the platform.",
    );
  };

  const handleSubscriptionPayment = () => {
    setHasSubscription(true);
    setShowPaymentModal(false);
    alert(
      "Subscription activated! Monthly billing of $999 will begin. You now have unlimited access.",
    );
  };

  const ageDistributionData = [
    { ageGroup: "20-39", cases: 148, total: 1200, rate: 12.3 },
    { ageGroup: "40-59", cases: 344, total: 1200, rate: 28.7 },
    { ageGroup: "60+", cases: 542, total: 1200, rate: 45.2 },
  ];

  const trendData = [
    { month: "Jan", rate: 26.5 },
    { month: "Feb", rate: 27.2 },
    { month: "Mar", rate: 27.8 },
    { month: "Apr", rate: 28.1 },
    { month: "May", rate: 28.5 },
    { month: "Jun", rate: 28.5 },
  ];

  const genderDistributionData = [
    { name: "Male", value: 185, color: "#3b82f6" },
    { name: "Female", value: 157, color: "#8b5cf6" },
  ];

  const regionComparisonData = [
    { region: "London", rate: 28.5 },
    { region: "Manchester", rate: 31.2 },
    { region: "Birmingham", rate: 29.8 },
    { region: "Leeds", rate: 27.3 },
    { region: "Glasgow", rate: 32.1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Choose Your Payment Method
            </DialogTitle>
            <DialogDescription>
              Select how you'd like to access the NextMed research platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="p-5 rounded-lg border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      Pay with NEXT Tokens
                    </p>
                    <p className="text-sm text-muted-foreground">
                      One-time payment
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-success/10 text-success"
                >
                  Popular
                </Badge>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-success">1000</span>
                  <span className="text-lg text-muted-foreground">
                    NEXT tokens
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  For 30 days of full platform access
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Unlimited queries and analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Access to all 3,450+ medical records</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>AI chat, filters, and SQL query tools</span>
                </li>
              </ul>
              <Button onClick={handleTokenPayment} className="w-full" size="lg">
                <Wallet className="h-4 w-4 mr-2" />
                Pay with NEXT Tokens
              </Button>
            </div>

            <div className="p-5 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      Monthly Subscription
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Recurring payment
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary">$999</span>
                  <span className="text-lg text-muted-foreground">/ month</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Billed monthly, cancel anytime
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Unlimited queries and analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Access to all 3,450+ medical records</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Priority support and early feature access</span>
                </li>
              </ul>
              <Button
                onClick={handleSubscriptionPayment}
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Subscribe Monthly
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            <Shield className="h-3 w-3 inline mr-1" />
            All payments are secure and encrypted. Cancel subscription anytime.
          </div>
        </DialogContent>
      </Dialog>

      {/* EHR Provider Selection Dialog */}
      <Dialog open={showEHRSelector} onOpenChange={setShowEHRSelector}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Select EHR Data Source
            </DialogTitle>
            <DialogDescription>
              Choose which EHR system's data you want to analyze. All data is anonymized and aggregated.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEHR && (
            <div className="p-4 mb-4 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="font-semibold">{selectedEHR.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedEHR.vendorJa}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedEHR(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Change
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid gap-3 md:grid-cols-2">
            {EHR_PROVIDERS.map((provider) => (
              <div 
                key={provider.id}
                onClick={() => handleConnectEHR(provider.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedEHR?.id === provider.id 
                    ? 'border-emerald-400 bg-emerald-500/10' 
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
              >
                <div className="mb-2">
                  <Badge variant="outline" className="mb-1 text-xs">
                    {provider.categoryJa}
                  </Badge>
                  <h4 className="font-bold text-base">{provider.name}</h4>
                  <p className="text-xs text-emerald-500">{provider.vendorJa}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">対象:</span> {provider.targetJa}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {provider.descriptionJa}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEHRSelector(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => setShowEHRSelector(false)}
              disabled={!selectedEHR}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Responsive Header (要件 8.1, 8.2, 8.3) */}
      <header className="relative z-10 border-b border-white/10 glass">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="/logo.jpg" 
              alt="NextMed Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
            />
            <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              NextMed
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {hasSubscription && (
              <Badge variant="secondary" className="hidden sm:flex bg-success/10 text-success text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
            <span className="hidden md:inline text-sm text-muted-foreground">
              Researcher Portal
            </span>
            <WalletButton />
            <Button variant="ghost" size="sm" onClick={onLogout} className="touch-manipulation">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-balance">
            Confidential Sandbox
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Analyze medical data without compromising patient privacy
          </p>
        </div>

        {!hasSubscription && (
          <Card className="shadow-lg mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">
                      Subscribe to Access Research Data
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Choose between NEXT token payment or monthly subscription
                      to start analyzing medical data
                    </p>
                  </div>
                </div>
                <Button onClick={() => setShowPaymentModal(true)} size="lg">
                  View Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Responsive Stats Grid (要件 8.1, 8.2, 8.3) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-6">
          <GlassCard variant="primary" className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Analyzable Records
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold">3,450</span>
                <Database className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="secondary" className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Regions Available
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold">15</span>
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground">
                London (2,400 records)
              </p>
            </div>
          </GlassCard>

          <GlassCard variant="accent" className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Conditions Tracked
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold">12</span>
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground">
                Hypertension (1,500 records)
              </p>
            </div>
          </GlassCard>

          {/* EHR Status Card */}
          <GlassCard 
            variant="default" 
            className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform cursor-pointer hover:border-primary/50"
            onClick={() => setShowEHRSelector(true)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  EHR Data Source
                </p>
                {selectedEHR ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Search className="h-4 w-4 text-yellow-400" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold">
                  {selectedEHR ? "Connected" : "Select Source"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {selectedEHR ? selectedEHR.name : "Click to choose EHR"}
              </p>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="mb-6 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-primary" />
              Data Analysis Tools
            </h2>
            <p className="text-muted-foreground">
              Multiple ways to query and analyze anonymized medical data
            </p>
          </div>
          <div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ai-chat" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="filters" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </TabsTrigger>
                <TabsTrigger value="sql" className="gap-2">
                  <Code2 className="h-4 w-4" />
                  SQL Query
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai-chat" className="space-y-4">
                <div className="space-y-2">
                  <Label>Ask AI to Analyze Data</Label>
                  <Textarea
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask questions in natural language..."
                    className="min-h-[100px] font-sans"
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: "Show me diabetes prevalence in patients over 60"
                    or "Compare cardiovascular disease rates between regions"
                  </p>
                </div>
                <Button
                  onClick={handleExecuteAnalysis}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask AI
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="filters" className="space-y-4">
                <GlassCard variant="default" className="p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Age Range</Label>
                      <Select value={ageFilter} onValueChange={setAgeFilter}>
                        <SelectTrigger className="backdrop-blur-sm bg-white/5 border-white/20">
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ages</SelectItem>
                          <SelectItem value="0-19">0-19 years</SelectItem>
                          <SelectItem value="20-39">20-39 years</SelectItem>
                          <SelectItem value="40-59">40-59 years</SelectItem>
                          <SelectItem value="60+">60+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Condition/Symptom</Label>
                      <Select
                        value={symptomFilter}
                        onValueChange={setSymptomFilter}
                      >
                        <SelectTrigger className="backdrop-blur-sm bg-white/5 border-white/20">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Conditions</SelectItem>
                          <SelectItem value="hypertension">
                            Hypertension
                          </SelectItem>
                          <SelectItem value="diabetes">Diabetes</SelectItem>
                          <SelectItem value="cardiovascular">
                            Cardiovascular Disease
                          </SelectItem>
                          <SelectItem value="respiratory">
                            Respiratory Issues
                          </SelectItem>
                          <SelectItem value="cancer">Cancer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Region</Label>
                      <Select>
                        <SelectTrigger className="backdrop-blur-sm bg-white/5 border-white/20">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="london">London</SelectItem>
                          <SelectItem value="manchester">Manchester</SelectItem>
                          <SelectItem value="birmingham">Birmingham</SelectItem>
                          <SelectItem value="leeds">Leeds</SelectItem>
                          <SelectItem value="glasgow">Glasgow</SelectItem>
                          <SelectItem value="liverpool">Liverpool</SelectItem>
                          <SelectItem value="edinburgh">Edinburgh</SelectItem>
                          <SelectItem value="bristol">Bristol</SelectItem>
                          <SelectItem value="cardiff">Cardiff</SelectItem>
                          <SelectItem value="belfast">Belfast</SelectItem>
                          <SelectItem value="newcastle">Newcastle</SelectItem>
                          <SelectItem value="sheffield">Sheffield</SelectItem>
                          <SelectItem value="nottingham">Nottingham</SelectItem>
                          <SelectItem value="southampton">Southampton</SelectItem>
                          <SelectItem value="cambridge">Cambridge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select>
                        <SelectTrigger className="backdrop-blur-sm bg-white/5 border-white/20">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </GlassCard>

                <Button
                  onClick={handleExecuteAnalysis}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Applying Filters...
                    </>
                  ) : (
                    <>
                      <Filter className="h-4 w-4 mr-2" />
                      Apply Filters & Analyze
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="sql" className="space-y-4">
                <div className="space-y-2">
                  <Label>SQL Query</Label>
                  <Textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Write your SQL query..."
                    className="min-h-[150px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available tables: medical_records, conditions, demographics,
                    lab_results
                  </p>
                </div>
                <Button
                  onClick={handleExecuteAnalysis}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Executing Query...
                    </>
                  ) : (
                    <>
                      <Code2 className="h-4 w-4 mr-2" />
                      Execute SQL Query
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </GlassCard>

        {showResults && (
          <div className="space-y-6">
            <GlassCard glow className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-success" />
                    Analysis Results Dashboard
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-success/10 text-success"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    ZK-Proof Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Hypertension Analysis - Aggregated results from confidential
                  computing
                </p>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg border border-success/20">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This analysis was executed via Confidential Computing. All
                      PII was masked using Midnight's ZK technology. Only
                      aggregated results are displayed.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <GlassCard variant="primary" className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Records
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          1,200
                        </p>
                      </div>
                      <Database className="h-8 w-8 text-primary/20" />
                    </div>
                  </GlassCard>

                  <GlassCard variant="secondary" className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Cases
                        </p>
                        <p className="text-3xl font-bold text-secondary">
                          342
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-secondary/20" />
                    </div>
                  </GlassCard>

                  <GlassCard variant="accent" className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Overall Rate
                        </p>
                        <p className="text-3xl font-bold text-accent">
                          28.5%
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-accent/20" />
                    </div>
                  </GlassCard>

                  <GlassCard variant="default" className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Trend
                        </p>
                        <p className="text-3xl font-bold text-success">
                          +2.0%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-success/20" />
                    </div>
                  </GlassCard>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Age Distribution Bar Chart */}
                  <GlassCard className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-1">
                        Hypertension Rate by Age Group
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Distribution across different age ranges
                      </p>
                    </div>
                    <CyberChart
                      data={ageDistributionData.map(d => ({
                        name: d.ageGroup,
                        value: d.rate
                      }))}
                      type="bar"
                      dataKey="value"
                      xAxisKey="name"
                      gradient={true}
                      glow={true}
                      height={250}
                    />
                  </GlassCard>

                  {/* Trend Line Chart */}
                  <GlassCard className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-1">6-Month Trend</h3>
                      <p className="text-sm text-muted-foreground">
                        Hypertension rate over time
                      </p>
                    </div>
                    <CyberChart
                      data={trendData.map(d => ({
                        name: d.month,
                        value: d.rate
                      }))}
                      type="line"
                      dataKey="value"
                      xAxisKey="name"
                      gradient={true}
                      glow={true}
                      height={250}
                      colors={{
                        primary: "#10b981",
                        secondary: "#10b981",
                        accent: "#10b981"
                      }}
                    />
                  </GlassCard>

                  {/* Gender Distribution Pie Chart */}
                  <GlassCard className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-1">
                        Gender Distribution
                      </h3>
                      <p className="text-sm text-muted-foreground">Cases by gender</p>
                    </div>
                    <CyberChart
                      data={genderDistributionData}
                      type="pie"
                      dataKey="value"
                      gradient={true}
                      glow={true}
                      height={250}
                      showLegend={true}
                    />
                  </GlassCard>

                  {/* Regional Comparison */}
                  <GlassCard className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-1">
                        Regional Comparison
                      </h3>
                      <p className="text-sm text-muted-foreground">Top 5 regions by rate</p>
                    </div>
                    <CyberChart
                      data={regionComparisonData.map(d => ({
                        name: d.region,
                        value: d.rate
                      }))}
                      type="bar"
                      dataKey="value"
                      xAxisKey="name"
                      gradient={true}
                      glow={true}
                      height={250}
                      colors={{
                        primary: "#06b6d4",
                        secondary: "#06b6d4",
                        accent: "#06b6d4"
                      }}
                    />
                  </GlassCard>
                </div>

                <GlassCard className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">
                      Detailed Statistics
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive breakdown by age group
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                            Age Group
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                            Total Records
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                            Cases
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                            Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ageDistributionData.map((row) => (
                          <tr key={row.ageGroup} className="border-b border-white/5 last:border-0">
                            <td className="py-3 px-4 font-medium">
                              {row.ageGroup}
                            </td>
                            <td className="text-right py-3 px-4">
                              {row.total.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-4">
                              {row.cases.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-4">
                              <Badge variant="secondary">{row.rate}%</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}
