"use client";

import {
  Activity,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  LogOut,
  Search,
  Shield,
  TrendingUp,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/design/card";
import { Chart } from "@/components/design/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletButton } from "@/components/wallet/wallet-button";
import { EHR_PROVIDERS, type EHRProvider } from "@/lib/ehr-providers";

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
  const [selectedEHR, setSelectedEHR] = useState<EHRProvider | null>(null);

  const handleConnect = (providerId: string) => {
    const provider = EHR_PROVIDERS.find((p) => p.id === providerId);
    if (provider) {
      setSelectedEHR(provider);
    }
  };

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
    <div className="min-h-screen bg-slate-50">
      {/* Responsive Header (要件 8.1, 8.2, 8.3) */}
      <header className="relative z-10 border-b border-slate-200 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.jpg"
              alt="NextMed Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
            />
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              NextMed
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden md:inline text-sm text-muted-foreground">
              Company & Clinic Portal
            </span>
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-balance text-slate-900">
            Company & Clinic Dashboard
          </h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
            Securely upload and integrate medical records with ZK privacy
            protection
          </p>
        </div>

        {/* Statistics Overview - Responsive Grid (要件 8.1, 8.2, 8.3) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4 sm:mb-6">
          <Card
            variant="primary"
            className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-1">
              Total NEXT Tokens
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {totalTokens}
            </p>
            <p className="text-xs text-emerald-600">
              +{uploadHistory[0].tokens} this week
            </p>
          </Card>

          <Card
            variant="secondary"
            className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-1">
              Records Processed
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              320
            </p>
            <p className="text-xs text-blue-600">Today</p>
          </Card>

          <Card
            variant="accent"
            className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              {selectedEHR ? (
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              ) : (
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-1">EHR Status</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
              {selectedEHR ? "Connected" : "Not Connected"}
            </p>
            <p className="text-xs text-emerald-600">
              {selectedEHR ? selectedEHR.name : "Select Provider"}
            </p>
          </Card>
        </div>

        {/* Charts Section - Responsive Grid (要件 8.1, 8.2, 8.3) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-4 sm:mb-6">
          <Card variant="default" className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Weekly Upload Trend
            </h3>
            <Chart
              data={uploadTrendData}
              type="area"
              dataKey="records"
              xAxisKey="name"
              gradient={true}
              glow={true}
              height={250}
            />
          </Card>

          <Card variant="default" className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-600" />
              Token Earnings
            </h3>
            <Chart
              data={tokenEarningsData}
              type="bar"
              dataKey="tokens"
              xAxisKey="name"
              gradient={true}
              glow={true}
              height={250}
            />
          </Card>
        </div>

        <Card variant="secondary" className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Coins className="h-6 w-6 text-emerald-600" />
                Contribution Rewards
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Earn NEXT tokens for contributing medical data to the NextMed
                network
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-900 mb-3">
                  How NEXT Tokens Work
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Earn 1 NEXT token per medical record uploaded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Bonus tokens for high-quality, complete data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Use tokens for platform benefits and services</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900">
                  Recent Earnings
                </span>
                <Coins className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">This Week</span>
                  <span className="text-lg font-bold text-emerald-600">
                    +{uploadHistory[0].tokens} NEXT
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">This Month</span>
                  <span className="text-lg font-bold text-blue-600">
                    +{uploadHistory.reduce((sum, h) => sum + h.tokens, 0)} NEXT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload">Manual Upload</TabsTrigger>
            <TabsTrigger value="integration">EHR Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card variant="primary" className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Data Uploader
                </h3>
                <p className="text-sm text-slate-600">
                  Upload medical records for secure processing and anonymization
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Coins className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Earn NEXT Tokens with Every Upload
                        </p>
                        <p className="text-sm text-slate-600">
                          ~1 NEXT per record • Instant processing
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        +150
                      </p>
                      <p className="text-xs text-slate-600">estimated NEXT</p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 text-center hover:border-blue-300 transition-colors cursor-pointer bg-slate-50">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <p className="text-lg font-medium mb-2 text-slate-900">
                    Drag & Drop Files Here
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    or click to select files (CSV, JSON)
                  </p>
                  <Button
                    onClick={handleFileUpload}
                    disabled={uploadStatus !== "idle"}
                  >
                    Select File
                  </Button>
                </div>

                {uploadStatus !== "idle" && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-900">
                          patient_records_demo.csv
                        </span>
                      </div>
                      {uploadStatus === "complete" && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-600 border-emerald-200"
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
                            <span className="text-slate-600">Uploading...</span>
                            <span className="font-medium text-slate-900">
                              {uploadProgress}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {uploadStatus === "processing" && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-4 w-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                        <span className="font-medium text-blue-600">
                          Processing: Masking PII with Midnight ZK...
                        </span>
                      </div>
                    )}

                    {uploadStatus === "complete" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">
                            Complete. 150 records securely processed
                          </span>
                        </div>
                        <div className="p-4 bg-emerald-500/10 border border-emerald-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-900">
                              NEXT Tokens Earned
                            </span>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-emerald-600" />
                              <span className="text-xl font-bold text-emerald-600">
                                +{earnedTokens} NEXT
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <Shield className="h-3 w-3 inline mr-1 text-emerald-600" />
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
            </Card>

            <Card variant="secondary" className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  Upload History
                </h3>
                <p className="text-sm text-slate-600">
                  Recent file uploads and processing status
                </p>
              </div>
              <div className="space-y-3">
                {uploadHistory.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm text-slate-900">
                          {upload.filename}
                        </p>
                        <p className="text-xs text-slate-600">
                          {upload.date} • {upload.records} records
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-600">
                          +{upload.tokens} NEXT
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-600 border-emerald-200"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card variant="accent" className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  EHR System Integration
                </h3>
                <p className="text-sm text-slate-600">
                  {selectedEHR
                    ? "Managed connection with your Electronic Health Records system"
                    : "Select your EHR provider to begin integration"}
                </p>
              </div>

              {!selectedEHR ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {EHR_PROVIDERS.map((provider) => (
                    <Card
                      key={provider.id}
                      variant="secondary"
                      className="p-4 flex flex-col h-full hover:border-blue-300 transition-colors group"
                    >
                      <div className="mb-3">
                        <Badge
                          variant="outline"
                          className="mb-2 border-slate-200 text-xs text-slate-600"
                        >
                          {provider.categoryJa}
                        </Badge>
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                          {provider.name}
                        </h4>
                        <p className="text-xs text-emerald-600 font-medium">
                          {provider.vendorJa}
                        </p>
                      </div>

                      <div className="flex-grow space-y-2 mb-4">
                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                            Target
                          </p>
                          <p className="text-xs text-slate-500">
                            {provider.targetJa}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 leading-snug">
                          {provider.descriptionJa}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleConnect(provider.id)}
                        className="w-full mt-auto bg-blue-50 hover:bg-blue-200 text-blue-600 border border-blue-200"
                        size="sm"
                      >
                        Connect System
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-slate-900">
                            {selectedEHR.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {selectedEHR.vendorJa} / {selectedEHR.vendor}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-600 border-emerald-200"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-slate-400 hover:text-slate-900"
                          onClick={() => setSelectedEHR(null)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          Connection Status
                        </p>
                        <p className="font-semibold text-emerald-600">
                          Active & Synchronizing
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Last Sync</p>
                        <p className="font-semibold text-slate-900">Just now</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          Records Processed Today
                        </p>
                        <p className="text-2xl font-bold text-blue-600">320</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          NEXT Tokens Earned Today
                        </p>
                        <p className="text-2xl font-bold text-emerald-600">
                          +320
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">
                          Security Assurance:
                        </strong>{" "}
                        Data from {selectedEHR.name} is only integrated after
                        all PII (Name, Address) is completely masked. NextMed
                        never stores raw patient personal data.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card variant="default" className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  Real-Time Masking Log
                </h3>
                <p className="text-sm text-slate-600">
                  Live feed of automated data processing
                </p>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {syncLogs.map((log) => (
                  <div
                    key={`${log.time}-${log.action}`}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-slate-600 shrink-0">
                      [{log.time}]
                    </span>
                    <span
                      className={
                        log.status === "success"
                          ? "text-emerald-600"
                          : log.status === "processing"
                            ? "text-blue-600 font-semibold"
                            : "text-slate-900"
                      }
                    >
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
