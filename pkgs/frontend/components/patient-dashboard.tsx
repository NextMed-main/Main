"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shield, Wallet, History, LogOut, CheckCircle2, TrendingUp, Upload, FileText, Coins } from "lucide-react"
import { WalletButton } from "@/components/wallet/wallet-button"

interface PatientDashboardProps {
  onLogout: () => void
}

export function PatientDashboard({ onLogout }: PatientDashboardProps) {
  const [dataConsent, setDataConsent] = useState(true)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "complete">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [potentialEarnings, setPotentialEarnings] = useState(0)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleWalletConnectClick = () => {
    setShowWalletModal(true)
  }

  const handleWalletSelect = (walletType: string) => {
    const mockAddress = "0x" + Math.random().toString(16).substring(2, 10).toUpperCase()
    setWalletAddress(mockAddress)
    setWalletConnected(true)
    setShowWalletModal(false)
  }

  const handleWalletDisconnect = () => {
    setWalletAddress("")
    setWalletConnected(false)
  }

  const handleWithdraw = () => {
    if (!walletConnected) {
      alert("Please connect your wallet first")
      return
    }
    alert(`Withdrawing ${totalEarnings} NEXT tokens to ${walletAddress}`)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleFileUpload(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (file: File) => {
    setUploadStatus("uploading")
    setUploadProgress(0)
    setPotentialEarnings(15)

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setUploadStatus("processing")
          setTimeout(() => {
            setUploadStatus("complete")
          }, 2000)
          return 100
        }
        return prev + 25
      })
    }, 500)
  }

  const transactions = [
    { id: 1, amount: 10, purpose: "Public Health Analysis", date: "2025-02-01", researcher: "Researcher X" },
    { id: 2, amount: 25, purpose: "Hypertension Study", date: "2025-01-28", researcher: "Researcher Y" },
    { id: 3, amount: 15, purpose: "Diabetes Research", date: "2025-01-25", researcher: "Researcher Z" },
    { id: 4, amount: 20, purpose: "Cardiovascular Analysis", date: "2025-01-20", researcher: "Researcher X" },
  ]

  const auditLog = [
    { id: 1, researcher: "Researcher X", purpose: "Hypertension Study", date: "2025-02-01 14:30" },
    { id: 2, researcher: "Researcher Y", purpose: "Public Health Analysis", date: "2025-01-28 10:15" },
    { id: 3, researcher: "Researcher Z", purpose: "Diabetes Research", date: "2025-01-25 16:45" },
  ]

  const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0)

  const walletOptions = [
    {
      name: "MetaMask",
      description: "Connect using MetaMask browser extension",
      icon: "🦊",
      popular: true,
    },
    {
      name: "WalletConnect",
      description: "Scan QR code with your mobile wallet",
      icon: "📱",
      popular: true,
    },
    {
      name: "Coinbase Wallet",
      description: "Connect using Coinbase Wallet",
      icon: "🔵",
      popular: false,
    },
    {
      name: "Trust Wallet",
      description: "Connect using Trust Wallet",
      icon: "🛡️",
      popular: false,
    },
    {
      name: "Phantom",
      description: "Connect using Phantom wallet",
      icon: "👻",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Connect Your Wallet
            </DialogTitle>
            <DialogDescription>Choose your preferred wallet to connect and manage your NEXT tokens</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleWalletSelect(wallet.name)}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="text-3xl">{wallet.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold group-hover:text-primary transition-colors">{wallet.name}</p>
                    {wallet.popular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{wallet.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            <Shield className="h-3 w-3 inline mr-1" />
            Your wallet connection is secure and encrypted
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
            <span className="text-sm text-muted-foreground">Patient Portal</span>
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
          <h1 className="text-4xl font-bold mb-2 text-balance">My Data Wallet</h1>
          <p className="text-muted-foreground text-lg">Manage your medical data sharing and track your earnings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-success" />
                Total Earnings
              </CardTitle>
              <CardDescription>Your rewards for contributing to medical research</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-success">{totalEarnings}</span>
                  <span className="text-2xl text-muted-foreground">NEXT Tokens</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>+{transactions[0].amount} tokens this week</span>
                </div>
                <div className="flex gap-2 pt-2">
                  {!walletConnected ? (
                    <Button onClick={handleWalletConnectClick} className="flex-1 bg-transparent" variant="outline">
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleWalletDisconnect}
                        className="flex-1 bg-transparent"
                        variant="outline"
                        size="sm"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                      </Button>
                      <Button onClick={handleWithdraw} className="flex-1" variant="default">
                        Withdraw
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Data Consent
              </CardTitle>
              <CardDescription>Control how your data is used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Allow anonymized data usage</p>
                    <p className="text-sm text-muted-foreground">Earn rewards when your data is analyzed</p>
                  </div>
                  <Switch checked={dataConsent} onCheckedChange={setDataConsent} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Your name and address are never revealed</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Protected by Midnight's ZK technology</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Your Medical Data
            </CardTitle>
            <CardDescription>Share your medical records and earn NEXT tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-success/5 to-primary/5 rounded-lg border border-success/20">
              <div className="flex items-start gap-3 mb-3">
                <Coins className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-success mb-1">Earn Tokens by Uploading</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload your medical records, lab results, or health data. Each upload is processed securely with ZK
                    technology and you earn NEXT tokens when researchers use your anonymized data.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-success/20">
                <div>
                  <p className="text-lg font-bold text-success">10-30</p>
                  <p className="text-xs text-muted-foreground">Tokens per upload</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">100%</p>
                  <p className="text-xs text-muted-foreground">Privacy protected</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-accent">Instant</p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
              </div>
            </div>

            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={handleUploadClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.csv,.json,.dcm,.dicom"
                onChange={handleFileSelect}
              />
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-2">Drag & Drop Your Medical Files</p>
              <p className="text-sm text-muted-foreground mb-4">or click to select files (PDF, CSV, JSON, DICOM)</p>
              <Button type="button" disabled={uploadStatus !== "idle"}>
                Select File to Upload
              </Button>
            </div>

            {uploadStatus !== "idle" && (
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{selectedFile?.name || "my_lab_results_2025.pdf"}</span>
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
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Upload complete! Your data is now securely stored.</span>
                    </div>
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Potential Earnings</span>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-success" />
                          <span className="text-lg font-bold text-success">+{potentialEarnings} NEXT</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        You'll earn tokens when researchers access your anonymized data. All PII has been masked using
                        Midnight's ZK technology.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-secondary" />
              Transaction History
            </CardTitle>
            <CardDescription>Recent rewards from data usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.purpose}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.researcher} • {transaction.date}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-success bg-success/10">
                    +{transaction.amount} NEXT
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Consent & Audit Log
            </CardTitle>
            <CardDescription>Timeline of when your data was accessed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLog.map((log) => (
                <div key={log.id} className="relative pl-6 pb-4 border-l-2 border-accent/30 last:pb-0">
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-accent" />
                  <div className="space-y-1">
                    <p className="font-medium">{log.purpose}</p>
                    <p className="text-sm text-muted-foreground">Accessed by {log.researcher}</p>
                    <p className="text-xs text-muted-foreground">{log.date}</p>
                    <div className="mt-2 p-3 bg-accent/5 border border-accent/20 rounded-md">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <Shield className="h-3 w-3 inline mr-1 text-accent" />
                        Your data was used only after your PII (Name, Address) was protected and masked by Midnight's ZK
                        technology.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
