"use client";

import { GlassCard } from "@/components/cyber/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { WalletButton } from "@/components/wallet/wallet-button";
import { calculateCountUp, easingFunctions, smoothTransition } from "@/lib/animations";
import {
  CheckCircle2,
  Coins,
  ExternalLink,
  FileText,
  History,
  LogOut,
  Shield,
  TrendingUp,
  Upload,
  Wallet,
} from "lucide-react";
import { formatTxHash, getTxUrl } from "@/lib/explorer";
import React, { useEffect, useRef, useState } from "react";

interface PatientDashboardProps {
  onLogout: () => void;
}

// React.memo for optimization (要件 10.3)
export const PatientDashboard = React.memo(function PatientDashboard({ onLogout }: PatientDashboardProps) {
  const [dataConsent, setDataConsent] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "processing" | "complete"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [potentialEarnings, setPotentialEarnings] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Count-up animation state (要件 3.3)
  const [displayedEarnings, setDisplayedEarnings] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // useCallback for event handlers (要件 10.4)
  const handleWalletConnectClick = React.useCallback(() => {
    setShowWalletModal(true);
  }, []);

  const handleWalletSelect = React.useCallback((_walletType: string) => {
    const mockAddress = `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    setWalletAddress(mockAddress);
    setWalletConnected(true);
    setShowWalletModal(false);
  }, []);

  const handleWalletDisconnect = React.useCallback(() => {
    setWalletAddress("");
    setWalletConnected(false);
  }, []);

  const transactions = [
    {
      id: 1,
      amount: 10,
      purpose: "Public Health Analysis",
      date: "2025-02-01",
      researcher: "Researcher X",
      txHash: "00000000cedb75e9c6315a3fa646718dc64290399e92dcc7401f00d7a1ab1dfc",
      blockHeight: 2599043,
    },
    {
      id: 2,
      amount: 25,
      purpose: "Hypertension Study",
      date: "2025-01-28",
      researcher: "Researcher Y",
      txHash: "00000000f8a721bc5e4d903281a6f3c92b8e47d156c904ea23f701b8cd92ef41",
      blockHeight: 2598012,
    },
    {
      id: 3,
      amount: 15,
      purpose: "Diabetes Research",
      date: "2025-01-25",
      researcher: "Researcher Z",
      txHash: "00000000a3e8b2c94f1d6078e52a9b3c71d4e8f609a2b5c8d7e6f0123456789a",
      blockHeight: 2596847,
    },
    {
      id: 4,
      amount: 20,
      purpose: "Cardiovascular Analysis",
      date: "2025-01-20",
      researcher: "Researcher X",
      txHash: "000000007b2c4d5e6f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e",
      blockHeight: 2594521,
    },
  ];

  const auditLog = [
    {
      id: 1,
      researcher: "Researcher X",
      purpose: "Hypertension Study",
      date: "2025-02-01 14:30",
      txHash: "00000000d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7081920304050",
    },
    {
      id: 2,
      researcher: "Researcher Y",
      purpose: "Public Health Analysis",
      date: "2025-01-28 10:15",
      txHash: "00000000e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f70819203040506",
    },
    {
      id: 3,
      researcher: "Researcher Z",
      purpose: "Diabetes Research",
      date: "2025-01-25 16:45",
      txHash: "00000000f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7081920304050607",
    },
  ];

  // useMemo for computed values (要件 10.4)
  const totalEarnings = React.useMemo(
    () => transactions.reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const handleWithdraw = React.useCallback(() => {
    if (!walletConnected) {
      alert("Please connect your wallet first");
      return;
    }
    alert(`Withdrawing ${totalEarnings} NEXT tokens to ${walletAddress}`);
  }, [walletConnected, walletAddress, totalEarnings]);

  const handleFileUpload = React.useCallback((_file: File) => {
    setUploadStatus("uploading");
    setUploadProgress(0);
    setPotentialEarnings(15);

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadStatus("processing");
          setTimeout(() => {
            setUploadStatus("complete");
          }, 2000);
          return 100;
        }
        return prev + 25;
      });
    }, 500);
  }, []);

  const handleFileSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleUploadClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Count-up animation effect (要件 3.3: カウントアップアニメーション)
  useEffect(() => {
    if (displayedEarnings === totalEarnings) return;
    
    setIsAnimating(true);
    const duration = 1000; // 1 second
    const startTime = Date.now();
    const startValue = displayedEarnings;
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = calculateCountUp(
        { start: startValue, end: totalEarnings, easing: easingFunctions.easeOutCubic },
        progress
      );
      
      setDisplayedEarnings(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  }, [totalEarnings, displayedEarnings]);

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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Connect Your Wallet
            </DialogTitle>
            <DialogDescription>
              Choose your preferred wallet to connect and manage your NEXT
              tokens
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.name}
                type="button"
                onClick={() => handleWalletSelect(wallet.name)}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="text-3xl">{wallet.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {wallet.name}
                    </p>
                    {wallet.popular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {wallet.description}
                  </p>
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

      {/* Header with glassmorphism - Responsive (要件 3.4, 8.1, 8.2, 8.3) */}
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
            <span className="hidden md:inline text-sm text-muted-foreground">
              Patient Portal
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
            My Data Wallet
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Manage your medical data sharing and track your earnings
          </p>
        </div>

        {/* Responsive Grid: 1 column mobile, 2 columns tablet+ (要件 8.1, 8.2, 8.3) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-4 sm:mb-6">
          {/* Earnings Card with GlassCard - Responsive (要件 3.1, 8.1) */}
          <GlassCard variant="accent" glow className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform" style={smoothTransition(['all'], { duration: 300 })}>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-semibold text-white">Total Earnings</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-300">
                Your rewards for contributing to medical research
              </p>
            </div>
            <div className="space-y-4">
              {/* Count-up animation - Responsive (要件 3.3, 8.1) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-2" style={smoothTransition(['opacity'], { duration: 500 })}>
                <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-400 ${isAnimating ? 'opacity-80' : 'opacity-100'}`}>
                  {displayedEarnings}
                </span>
                <span className="text-lg sm:text-xl lg:text-2xl text-gray-300">
                  NEXT Tokens
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                <span>+{transactions[0].amount} tokens this week</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {!walletConnected ? (
                  <Button
                    onClick={handleWalletConnectClick}
                    className="w-full sm:flex-1 bg-transparent border-cyan-400/50 hover:bg-cyan-400/10 touch-manipulation"
                    variant="outline"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleWalletDisconnect}
                      className="w-full sm:flex-1 bg-transparent border-cyan-400/50 hover:bg-cyan-400/10 touch-manipulation"
                      variant="outline"
                      size="sm"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
                      <span className="sm:hidden">{walletAddress.substring(0, 4)}...{walletAddress.substring(walletAddress.length - 4)}</span>
                    </Button>
                    <Button
                      onClick={handleWithdraw}
                      className="w-full sm:flex-1 bg-cyan-500 hover:bg-cyan-600 touch-manipulation"
                      variant="default"
                    >
                      Withdraw
                    </Button>
                  </>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Data Consent Card with GlassCard - Responsive (要件 3.1, 8.1) */}
          <GlassCard variant="primary" glow className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform" style={smoothTransition(['all'], { duration: 300 })}>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
                <h3 className="text-base sm:text-lg font-semibold text-white">Data Consent</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-300">Control how your data is used</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="space-y-1">
                  <p className="font-medium text-white">Allow anonymized data usage</p>
                  <p className="text-sm text-gray-300">
                    Earn rewards when your data is analyzed
                  </p>
                </div>
                <Switch
                  checked={dataConsent}
                  onCheckedChange={setDataConsent}
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300">
                    Your name and address are never revealed
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300">
                    Protected by Midnight's ZK technology
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Upload Card with GlassCard (要件 3.1: グラスモーフィズムカードレイアウト) */}
        <GlassCard variant="secondary" glow className="p-6 mb-6" style={smoothTransition(['all'], { duration: 300 })}>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Upload Your Medical Data</h3>
            </div>
            <p className="text-sm text-gray-300">
              Share your medical records and earn NEXT tokens
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-linear-to-br from-emerald-500/10 to-indigo-500/10 rounded-lg border border-emerald-400/20">
              <div className="flex items-start gap-3 mb-3">
                <Coins className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-400 mb-1">
                    Earn Tokens by Uploading
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Upload your medical records, lab results, or health data.
                    Each upload is processed securely with ZK technology and you
                    earn NEXT tokens when researchers use your anonymized data.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-emerald-400/20">
                <div>
                  <p className="text-lg font-bold text-emerald-400">10-30</p>
                  <p className="text-xs text-gray-400">
                    Tokens per upload
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-indigo-400">100%</p>
                  <p className="text-xs text-gray-400">
                    Privacy protected
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-cyan-400">Instant</p>
                  <p className="text-xs text-gray-400">Processing</p>
                </div>
              </div>
            </div>

            <div
              role="button"
              tabIndex={0}
              className="w-full border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-emerald-400/50 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              onClick={handleUploadClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleUploadClick();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.csv,.json,.dcm,.dicom"
                onChange={handleFileSelect}
              />
              <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <p className="font-medium mb-2 text-white">Drag & Drop Your Medical Files</p>
              <p className="text-sm text-gray-300 mb-4">
                or click to select files (PDF, CSV, JSON, DICOM)
              </p>
              <Button type="button" disabled={uploadStatus !== "idle"} className="bg-emerald-500 hover:bg-emerald-600 pointer-events-none">
                Select File to Upload
              </Button>
            </div>

            {/* Data update transitions (要件 3.5: データ更新時のトランジション) */}
            {uploadStatus !== "idle" && (
              <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10" style={smoothTransition(['opacity', 'transform'], { duration: 500 })}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium text-white">
                      {selectedFile?.name || "my_lab_results_2025.pdf"}
                    </span>
                  </div>
                  {uploadStatus === "complete" && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-400 border-emerald-400/20"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>

                {uploadStatus === "uploading" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        Uploading...
                      </span>
                      <span className="font-medium text-white">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadStatus === "processing" && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                    <span className="font-medium text-indigo-400">
                      Processing: Masking PII with Midnight ZK...
                    </span>
                  </div>
                )}

                {uploadStatus === "complete" && (
                  <div className="space-y-3" style={smoothTransition(['opacity'], { duration: 500 })}>
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">
                        Upload complete! Your data is now securely stored.
                      </span>
                    </div>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">
                          Potential Earnings
                        </span>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-emerald-400" />
                          <span className="text-lg font-bold text-emerald-400">
                            +{potentialEarnings} NEXT
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        You'll earn tokens when researchers access your
                        anonymized data. All PII has been masked using
                        Midnight's ZK technology.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Transaction History with GlassCard (要件 3.1: グラスモーフィズムカードレイアウト) */}
        <GlassCard variant="secondary" glow className="p-6 mb-6" style={smoothTransition(['all'], { duration: 300 })}>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Transaction History</h3>
            </div>
            <p className="text-sm text-gray-300">Recent rewards from data usage</p>
          </div>
          <div>
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                  style={smoothTransition(['background-color', 'transform'], { duration: 300, delay: index * 50 })}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-white">{transaction.purpose}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-300">
                      <span>{transaction.researcher}</span>
                      <span>•</span>
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <a
                        href={getTxUrl(transaction.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                        title={`View transaction on Midnight Explorer`}
                      >
                        <span className="font-mono text-xs">{formatTxHash(transaction.txHash)}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-emerald-400 bg-emerald-500/10 border-emerald-400/20"
                  >
                    +{transaction.amount} NEXT
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Audit Log with GlassCard (要件 3.1: グラスモーフィズムカードレイアウト) */}
        <GlassCard variant="accent" glow className="p-6" style={smoothTransition(['all'], { duration: 300 })}>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Consent & Audit Log</h3>
            </div>
            <p className="text-sm text-gray-300">
              Timeline of when your data was accessed
            </p>
          </div>
          <div>
            <div className="space-y-4">
              {auditLog.map((log, index) => (
                <div
                  key={log.id}
                  className="relative pl-6 pb-4 border-l-2 border-cyan-400/30 last:pb-0"
                  style={smoothTransition(['opacity'], { duration: 300, delay: index * 100 })}
                >
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400" />
                  <div className="space-y-1">
                    <p className="font-medium text-white">{log.purpose}</p>
                    <p className="text-sm text-gray-300">
                      Accessed by {log.researcher}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{log.date}</span>
                      <span>•</span>
                      <a
                        href={getTxUrl(log.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                        title="View access transaction on Midnight Explorer"
                      >
                        <span className="font-mono">{formatTxHash(log.txHash)}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="mt-2 p-3 bg-cyan-500/5 border border-cyan-400/20 rounded-md">
                      <p className="text-xs text-gray-300 leading-relaxed">
                        <Shield className="h-3 w-3 inline mr-1 text-cyan-400" />
                        Your data was used only after your PII (Name, Address)
                        was protected and masked by Midnight's ZK technology.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
});
