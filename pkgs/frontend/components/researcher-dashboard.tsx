"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Shield,
  Database,
  Search,
  LogOut,
  CheckCircle2,
  BarChart3,
  Users,
  MessageSquare,
  Code2,
  Filter,
  CreditCard,
  Coins,
  Wallet,
  TrendingUp,
  Activity,
} from "lucide-react"
import { WalletButton } from "@/components/wallet/wallet-button"

interface ResearcherDashboardProps {
  onLogout: () => void
}

export function ResearcherDashboard({ onLogout }: ResearcherDashboardProps) {
  const [activeTab, setActiveTab] = useState("ai-chat")
  const [aiQuery, setAiQuery] = useState("Show me hypertension rates by age group in Suginami District")
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT age_group, COUNT(*) as count\nFROM medical_records\nWHERE condition = 'hypertension'\nGROUP BY age_group",
  )
  const [ageFilter, setAgeFilter] = useState("")
  const [symptomFilter, setSymptomFilter] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)

  const handleExecuteAnalysis = () => {
    if (!hasSubscription) {
      setShowPaymentModal(true)
      return
    }

    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  const handleTokenPayment = () => {
    setHasSubscription(true)
    setShowPaymentModal(false)
    alert("Payment successful! 1000 NEXT tokens deducted. You now have access to the platform.")
  }

  const handleSubscriptionPayment = () => {
    setHasSubscription(true)
    setShowPaymentModal(false)
    alert("Subscription activated! Monthly billing of $999 will begin. You now have unlimited access.")
  }

  const ageDistributionData = [
    { ageGroup: "20-39", cases: 148, total: 1200, rate: 12.3 },
    { ageGroup: "40-59", cases: 344, total: 1200, rate: 28.7 },
    { ageGroup: "60+", cases: 542, total: 1200, rate: 45.2 },
  ]

  const trendData = [
    { month: "Jan", rate: 26.5 },
    { month: "Feb", rate: 27.2 },
    { month: "Mar", rate: 27.8 },
    { month: "Apr", rate: 28.1 },
    { month: "May", rate: 28.5 },
    { month: "Jun", rate: 28.5 },
  ]

  const genderDistributionData = [
    { name: "Male", value: 185, color: "#3b82f6" },
    { name: "Female", value: 157, color: "#8b5cf6" },
  ]

  const regionComparisonData = [
    { region: "London", rate: 28.5 },
    { region: "Manchester", rate: 31.2 },
    { region: "Birmingham", rate: 29.8 },
    { region: "Leeds", rate: 27.3 },
    { region: "Glasgow", rate: 32.1 },
  ]

  const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Choose Your Payment Method
            </DialogTitle>
            <DialogDescription>Select how you'd like to access the NextMed research platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="p-5 rounded-lg border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Pay with NEXT Tokens</p>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Popular
                </Badge>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-success">1000</span>
                  <span className="text-lg text-muted-foreground">NEXT tokens</span>
                </div>
                <p className="text-xs text-muted-foreground">For 30 days of full platform access</p>
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
                    <p className="font-semibold text-lg">Monthly Subscription</p>
                    <p className="text-sm text-muted-foreground">Recurring payment</p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary">$999</span>
                  <span className="text-lg text-muted-foreground">/ month</span>
                </div>
                <p className="text-xs text-muted-foreground">Billed monthly, cancel anytime</p>
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
              <Button onClick={handleSubscriptionPayment} variant="outline" className="w-full bg-transparent" size="lg">
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

      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-bold">NextMed</span>
          </div>
          <div className="flex items-center gap-4">
            {hasSubscription && (
              <Badge variant="secondary" className="bg-success/10 text-success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active Subscription
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">Researcher Portal</span>
            <WalletButton />
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Confidential Sandbox</h1>
          <p className="text-muted-foreground text-lg">Analyze medical data without compromising patient privacy</p>
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
                    <p className="font-semibold text-lg mb-1">Subscribe to Access Research Data</p>
                    <p className="text-sm text-muted-foreground">
                      Choose between NEXT token payment or monthly subscription to start analyzing medical data
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

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Analyzable Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">3,450</span>
                <Database className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Regions Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">15</span>
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground">London (2,400 records)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conditions Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">12</span>
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground">Hypertension (1,500 records)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Data Analysis Tools
            </CardTitle>
            <CardDescription>Multiple ways to query and analyze anonymized medical data</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                    Example: "Show me diabetes prevalence in patients over 60" or "Compare cardiovascular disease rates
                    between regions"
                  </p>
                </div>
                <Button onClick={handleExecuteAnalysis} disabled={isAnalyzing} className="w-full" size="lg">
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Age Range</Label>
                    <Select value={ageFilter} onValueChange={setAgeFilter}>
                      <SelectTrigger>
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
                    <Select value={symptomFilter} onValueChange={setSymptomFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        <SelectItem value="hypertension">Hypertension</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="cardiovascular">Cardiovascular Disease</SelectItem>
                        <SelectItem value="respiratory">Respiratory Issues</SelectItem>
                        <SelectItem value="cancer">Cancer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select>
                      <SelectTrigger>
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
                      <SelectTrigger>
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

                <Button onClick={handleExecuteAnalysis} disabled={isAnalyzing} className="w-full" size="lg">
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
                    Available tables: medical_records, conditions, demographics, lab_results
                  </p>
                </div>
                <Button onClick={handleExecuteAnalysis} disabled={isAnalyzing} className="w-full" size="lg">
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
          </CardContent>
        </Card>

        {showResults && (
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-success" />
                    Analysis Results Dashboard
                  </CardTitle>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    ZK-Proof Verified
                  </Badge>
                </div>
                <CardDescription>
                  Hypertension Analysis - Aggregated results from confidential computing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg border border-success/20">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This analysis was executed via Confidential Computing. All PII was masked using Midnight's ZK
                      technology. Only aggregated results are displayed.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                          <p className="text-3xl font-bold text-primary">1,200</p>
                        </div>
                        <Database className="h-8 w-8 text-primary/20" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
                          <p className="text-3xl font-bold text-secondary">342</p>
                        </div>
                        <Activity className="h-8 w-8 text-secondary/20" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Overall Rate</p>
                          <p className="text-3xl font-bold text-accent">28.5%</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-accent/20" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Trend</p>
                          <p className="text-3xl font-bold text-success">+2.0%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-success/20" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Age Distribution Bar Chart */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">Hypertension Rate by Age Group</CardTitle>
                      <CardDescription>Distribution across different age ranges</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={ageDistributionData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="ageGroup" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                            }}
                          />
                          <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Trend Line Chart */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">6-Month Trend</CardTitle>
                      <CardDescription>Hypertension rate over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-xs" />
                          <YAxis className="text-xs" domain={[25, 30]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="hsl(var(--secondary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Gender Distribution Pie Chart */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">Gender Distribution</CardTitle>
                      <CardDescription>Cases by gender</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={genderDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {genderDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Regional Comparison */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">Regional Comparison</CardTitle>
                      <CardDescription>Top 5 regions by rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={regionComparisonData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" className="text-xs" />
                          <YAxis dataKey="region" type="category" className="text-xs" width={80} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                            }}
                          />
                          <Bar dataKey="rate" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Detailed Statistics</CardTitle>
                    <CardDescription>Comprehensive breakdown by age group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Age Group</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Records</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Cases</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ageDistributionData.map((row, index) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-3 px-4 font-medium">{row.ageGroup}</td>
                              <td className="text-right py-3 px-4">{row.total.toLocaleString()}</td>
                              <td className="text-right py-3 px-4">{row.cases.toLocaleString()}</td>
                              <td className="text-right py-3 px-4">
                                <Badge variant="secondary">{row.rate}%</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
