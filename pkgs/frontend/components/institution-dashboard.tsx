"use client";

import { CyberChart } from "@/components/cyber/cyber-chart";
import { GlassCard } from "@/components/cyber/glass-card";
import { NeonButton } from "@/components/cyber/neon-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletButton } from "@/components/wallet/wallet-button";
import {
  Activity,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  LogOut,
  Shield,
  TrendingUp,
  Upload,
} from "lucide-react";
import { useState } from "react";

interface InstitutionDashboardProps {
  onLogout: () => void;
}

export function InstitutionDashboard({ onLogout }: InstitutionDashboardProps) {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "processing" | "complete"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(1250);

  const handleFileUpload = () => {
    setUploadStatus("uploading");
    setUploadProgress(0);
    const tokensForUpload = 150;

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadStatus("processing");
          setTimeout(() => {
            setUploadStatus("complete");
            setEarnedTokens(tokensForUpload);
            setTotalTokens((prev) => prev + tokensForUpload);
          }, 2000);
          return 100;
        }
        return prev + 25;
      });
    }, 500);
  };

  const uploadHistory = [
    {
      id: 1,
      filename: "patient_records_2025_01.csv",
      date: "2025-02-01 14:30",
      records: 150,
      status: "complete",
      tokens: 150,
    },
    {
      id: 2,
      filename: "lab_results_jan.json",
      date: "2025-01-28 10:15",
      records: 89,
      status: "complete",
      tokens: 90,
    },
    {
      id: 3,
      filename: "medical_history_q4.csv",
      date: "2025-01-20 16:45",
      records: 203,
      status: "complete",
      tokens: 200,
    },
  ];

  const syncLogs = [
    {
      time: "10:47",
      action: "50 new records fetched from EHR",
      status: "info",
    },
    {
      time: "10:47",
      action: "Processing: Masking PII with Midnight ZK...",
      status: "processing",
    },
    {
      time: "10:48",
      action: "Complete. 50 records securely added.",
      status: "success",
    },
    {
      time: "10:45",
      action: "32 new records fetched from EHR",
      status: "info",
    },
    {
      time: "10:45",
      action: "Processing: Masking PII with Midnight ZK...",
      status: "processing",
    },
    {
      time: "10:46",
      action: "Complete. 32 records securely added.",
      status: "success",
    },
  ];

  // Chart data for statistics
  const uploadTrendData = [
    { name: "Mon", records: 45 },
    { name: "Tue", records: 52 },
    { name: "Wed", records: 61 },
    { name: "Thu", records: 70 },
    { name: "Fri", records: 82 },
    { name: "Sat", records: 50 },
    { name: "Sun", records: 60 },
  ];

  const tokenEarningsData = [
    { name: "Week 1", tokens: 280 },
    { name: "Week 2", tokens: 350 },
    { name: "Week 3", tokens: 420 },
    { name: "Week 4", tokens: 500 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#060918] to-[#0f1629]">
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
            <span className="hidden md:inline text-sm text-muted-foreground">Company Portal</span>
            <WalletButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="touch-manipulation"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-balance bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Company Dashboard
          </h1>
          <p className="text-cyan-300/70 text-sm sm:text-base lg:text-lg">
            Securely upload and integrate medical records with ZK privacy
            protection
          </p>
        </div>

        {/* Statistics Overview - Responsive Grid (要件 8.1, 8.2, 8.3) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4 sm:mb-6">
          <GlassCard variant="primary" className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
              </div>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
            </div>
            <p className="text-xs sm:text-sm text-cyan-300/70 mb-1">Total NEXT Tokens</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{totalTokens}</p>
            <p className="text-xs text-emerald-400">
              +{uploadHistory[0].tokens} this week
            </p>
          </GlassCard>

          <GlassCard variant="secondary" className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
              </div>
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
            </div>
            <p className="text-xs sm:text-sm text-cyan-300/70 mb-1">Records Processed</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">320</p>
            <p className="text-xs text-cyan-400">Today</p>
          </GlassCard>

          <GlassCard variant="accent" className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
              </div>
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
            </div>
            <p className="text-xs sm:text-sm text-cyan-300/70 mb-1">EHR Status</p>
            <p className="text-lg sm:text-xl font-bold text-white mb-1">Connected</p>
            <p className="text-xs text-emerald-400">Sakura Net EHR</p>
          </GlassCard>
        </div>

        {/* Charts Section - Responsive Grid (要件 8.1, 8.2, 8.3) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-4 sm:mb-6">
          <GlassCard variant="default" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Weekly Upload Trend
            </h3>
            <CyberChart
              data={uploadTrendData}
              type="area"
              dataKey="records"
              xAxisKey="name"
              gradient={true}
              glow={true}
              height={250}
            />
          </GlassCard>

          <GlassCard variant="default" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-400" />
              Token Earnings
            </h3>
            <CyberChart
              data={tokenEarningsData}
              type="bar"
              dataKey="tokens"
              xAxisKey="name"
              gradient={true}
              glow={true}
              height={250}
            />
          </GlassCard>
        </div>

        <GlassCard variant="secondary" className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Coins className="h-6 w-6 text-emerald-400" />
                Contribution Rewards
              </h3>
              <p className="text-sm text-cyan-300/70 mt-1">
                Earn NEXT tokens for contributing medical data to the NextMed
                network
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm font-medium text-white mb-3">
                  How NEXT Tokens Work
                </p>
                <ul className="space-y-2 text-sm text-cyan-300/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Earn 1 NEXT token per medical record uploaded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Bonus tokens for high-quality, complete data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Use tokens for platform benefits and services</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-lg border border-emerald-400/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  Recent Earnings
                </span>
                <Coins className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-cyan-300/70">This Week</span>
                  <span className="text-lg font-bold text-emerald-400">
                    +{uploadHistory[0].tokens} NEXT
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-cyan-300/70">This Month</span>
                  <span className="text-lg font-bold text-cyan-400">
                    +{uploadHistory.reduce((sum, h) => sum + h.tokens, 0)} NEXT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload">Manual Upload</TabsTrigger>
            <TabsTrigger value="integration">EHR Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <GlassCard variant="primary" className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                  <Upload className="h-5 w-5 text-cyan-400" />
                  Data Uploader
                </h3>
                <p className="text-sm text-cyan-300/70">
                  Upload medical records for secure processing and anonymization
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 rounded-lg border border-indigo-400/30 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Coins className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          Earn NEXT Tokens with Every Upload
                        </p>
                        <p className="text-sm text-cyan-300/70">
                          ~1 NEXT per record • Instant processing
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-400">
                        +150
                      </p>
                      <p className="text-xs text-cyan-300/70">estimated NEXT</p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-cyan-400/50 transition-colors cursor-pointer bg-white/5">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
                  <p className="text-lg font-medium mb-2 text-white">
                    Drag & Drop Files Here
                  </p>
                  <p className="text-sm text-cyan-300/70 mb-4">
                    or click to select files (CSV, JSON)
                  </p>
                  <NeonButton
                    variant="primary"
                    size="md"
                    onClick={handleFileUpload}
                    disabled={uploadStatus !== "idle"}
                  >
                    Select File
                  </NeonButton>
                </div>

                {uploadStatus !== "idle" && (
                  <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm font-medium text-white">
                          patient_records_demo.csv
                        </span>
                      </div>
                      {uploadStatus === "complete" && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>

                    {uploadStatus === "uploading" && (
                      <>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-cyan-300/70">
                              Uploading...
                            </span>
                            <span className="font-medium text-white">
                              {uploadProgress}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {uploadStatus === "processing" && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-4 w-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                        <span className="font-medium text-cyan-400">
                          Processing: Masking PII with Midnight ZK...
                        </span>
                      </div>
                    )}

                    {uploadStatus === "complete" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">
                            Complete. 150 records securely processed
                          </span>
                        </div>
                        <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">
                              NEXT Tokens Earned
                            </span>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-emerald-400" />
                              <span className="text-xl font-bold text-emerald-400">
                                +{earnedTokens} NEXT
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-cyan-300/70 leading-relaxed">
                            <Shield className="h-3 w-3 inline mr-1 text-emerald-400" />
                            All PII has been masked using Midnight's ZK
                            technology. Records are now available for
                            confidential analysis.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard variant="secondary" className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-emerald-400" />
                  Upload History
                </h3>
                <p className="text-sm text-cyan-300/70">
                  Recent file uploads and processing status
                </p>
              </div>
              <div className="space-y-3">
                {uploadHistory.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="font-medium text-sm text-white">
                          {upload.filename}
                        </p>
                        <p className="text-xs text-cyan-300/70">
                          {upload.date} • {upload.records} records
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-400">
                          +{upload.tokens} NEXT
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <GlassCard variant="accent" className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  EHR System Integration
                </h3>
                <p className="text-sm text-cyan-300/70">
                  Automated synchronization with your Electronic Health Records
                  system
                </p>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-lg border border-cyan-400/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-white">
                          Sakura Net EHR
                        </p>
                        <p className="text-sm text-cyan-300/70">
                          Enterprise Edition
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-sm text-cyan-300/70 mb-1">
                        Connection Status
                      </p>
                      <p className="font-semibold text-emerald-400">
                        Active & Synchronizing
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cyan-300/70 mb-1">Last Sync</p>
                      <p className="font-semibold text-white">
                        02 Nov 2025, 10:48:12
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cyan-300/70 mb-1">
                        Records Processed Today
                      </p>
                      <p className="text-2xl font-bold text-cyan-400">320</p>
                    </div>
                    <div>
                      <p className="text-sm text-cyan-300/70 mb-1">
                        NEXT Tokens Earned Today
                      </p>
                      <p className="text-2xl font-bold text-emerald-400">
                        +320
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-400/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-indigo-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-cyan-300/70 leading-relaxed">
                      <strong className="text-white">
                        Security Assurance:
                      </strong>{" "}
                      Data from your EHR is only integrated after all PII (Name,
                      Address) is completely masked. NextMed never stores raw
                      patient personal data.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="default" className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-emerald-400" />
                  Real-Time Masking Log
                </h3>
                <p className="text-sm text-cyan-300/70">
                  Live feed of automated data processing
                </p>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {syncLogs.map((log) => (
                  <div
                    key={`${log.time}-${log.action}`}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-cyan-300/70 shrink-0">
                      [{log.time}]
                    </span>
                    <span
                      className={
                        log.status === "success"
                          ? "text-emerald-400"
                          : log.status === "processing"
                            ? "text-cyan-400 font-semibold"
                            : "text-white"
                      }
                    >
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
