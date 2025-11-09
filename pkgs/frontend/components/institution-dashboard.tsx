"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Upload, LogOut, CheckCircle2, Clock, FileText, Activity, Coins, TrendingUp } from "lucide-react"

interface InstitutionDashboardProps {
  onLogout: () => void
}

export function InstitutionDashboard({ onLogout }: InstitutionDashboardProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "complete">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [earnedTokens, setEarnedTokens] = useState(0)
  const [totalTokens, setTotalTokens] = useState(1250)

  const handleFileUpload = () => {
    setUploadStatus("uploading")
    setUploadProgress(0)
    const tokensForUpload = 150

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setUploadStatus("processing")
          setTimeout(() => {
            setUploadStatus("complete")
            setEarnedTokens(tokensForUpload)
            setTotalTokens((prev) => prev + tokensForUpload)
          }, 2000)
          return 100
        }
        return prev + 25
      })
    }, 500)
  }

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
  ]

  const syncLogs = [
    { time: "10:47", action: "50 new records fetched from EHR", status: "info" },
    { time: "10:47", action: "Processing: Masking PII with Midnight ZK...", status: "processing" },
    { time: "10:48", action: "Complete. 50 records securely added.", status: "success" },
    { time: "10:45", action: "32 new records fetched from EHR", status: "info" },
    { time: "10:45", action: "Processing: Masking PII with Midnight ZK...", status: "processing" },
    { time: "10:46", action: "Complete. 32 records securely added.", status: "success" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-bold">NextMed</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Company Portal</span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Company Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Securely upload and integrate medical records with ZK privacy protection
          </p>
        </div>

        <Card className="shadow-lg mb-6 bg-gradient-to-br from-success/5 to-primary/5 border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-success" />
              Contribution Rewards
            </CardTitle>
            <CardDescription>Earn NEXT tokens for contributing medical data to the NextMed network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total NEXT Tokens Earned</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-success">{totalTokens}</span>
                  <span className="text-lg text-muted-foreground">NEXT</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>+{uploadHistory[0].tokens} NEXT this week</span>
                </div>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border">
                <p className="text-sm font-medium mb-3">How NEXT Tokens Work</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Earn 1 NEXT token per medical record uploaded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Bonus tokens for high-quality, complete data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Use tokens for platform benefits and services</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload">Manual Upload</TabsTrigger>
            <TabsTrigger value="integration">EHR Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Data Uploader
                </CardTitle>
                <CardDescription>Upload medical records for secure processing and anonymization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-primary/5 to-success/5 rounded-lg border border-primary/20 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                        <Coins className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-semibold">Earn NEXT Tokens with Every Upload</p>
                        <p className="text-sm text-muted-foreground">~1 NEXT per record • Instant processing</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">+150</p>
                      <p className="text-xs text-muted-foreground">estimated NEXT</p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Drag & Drop Files Here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to select files (CSV, JSON)</p>
                  <Button onClick={handleFileUpload} disabled={uploadStatus !== "idle"}>
                    Select File
                  </Button>
                </div>

                {uploadStatus !== "idle" && (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">patient_records_demo.csv</span>
                      </div>
                      {uploadStatus === "complete" && (
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>

                    {uploadStatus === "uploading" && (
                      <>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Uploading...</span>
                            <span className="font-medium">{uploadProgress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {uploadStatus === "processing" && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="font-medium text-primary">Processing: Masking PII with Midnight ZK...</span>
                      </div>
                    )}

                    {uploadStatus === "complete" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-success">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">Complete. 150 records securely processed</span>
                        </div>
                        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">NEXT Tokens Earned</span>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-success" />
                              <span className="text-xl font-bold text-success">+{earnedTokens} NEXT</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            <Shield className="h-3 w-3 inline mr-1 text-success" />
                            All PII has been masked using Midnight's ZK technology. Records are now available for
                            confidential analysis.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  Upload History
                </CardTitle>
                <CardDescription>Recent file uploads and processing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadHistory.map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{upload.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {upload.date} • {upload.records} records
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-success">+{upload.tokens} NEXT</p>
                        </div>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  EHR System Integration
                </CardTitle>
                <CardDescription>Automated synchronization with your Electronic Health Records system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Sakura Net EHR</p>
                        <p className="text-sm text-muted-foreground">Enterprise Edition</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Connection Status</p>
                      <p className="font-semibold text-success">Active & Synchronizing</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Last Sync</p>
                      <p className="font-semibold">02 Nov 2025, 10:48:12</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Records Processed Today</p>
                      <p className="text-2xl font-bold text-primary">320</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">NEXT Tokens Earned Today</p>
                      <p className="text-2xl font-bold text-success">+320</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Security Assurance:</strong> Data from your EHR is only
                      integrated after all PII (Name, Address) is completely masked. NextMed never stores raw patient
                      personal data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  Real-Time Masking Log
                </CardTitle>
                <CardDescription>Live feed of automated data processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-xs">
                  {syncLogs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-muted/30 rounded hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-muted-foreground shrink-0">[{log.time}]</span>
                      <span
                        className={
                          log.status === "success"
                            ? "text-success"
                            : log.status === "processing"
                              ? "text-primary font-semibold"
                              : "text-foreground"
                        }
                      >
                        {log.action}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
