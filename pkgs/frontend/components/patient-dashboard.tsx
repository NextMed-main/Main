'use client';

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
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/design/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileUploadDropzone } from '@/components/ui/file-upload-dropzone';
import { Switch } from '@/components/ui/switch';
import { useMidnightWalletContext } from '@/components/wallet/midnight-wallet-provider';
import { WalletButton } from '@/components/wallet/wallet-button';
import { WalletSelectionModal } from '@/components/wallet/wallet-modal';
import { usePatientRegistry } from '@/hooks/use-patient-registry';
import {
  calculateCountUp,
  easingFunctions,
  smoothTransition,
} from '@/lib/animations';
import { formatTxHash, getTxUrl } from '@/lib/explorer';

interface PatientDashboardProps {
  onLogout: () => void;
}

// React.memo for optimization (要件 10.3)
export const PatientDashboard = React.memo(function PatientDashboard({
  onLogout,
}: PatientDashboardProps) {
  // Use shared Midnight wallet context
  const midnightWallet = useMidnightWalletContext();

  // Use Patient Registry contract hook
  const {
    register: registerPatient,
    isSubmitting: isRegistering,
    error: registrationError,
    clearError,
  } = usePatientRegistry();

  const [dataConsent, setDataConsent] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'processing' | 'complete' | 'error'
  >('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [potentialEarnings, setPotentialEarnings] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Count-up animation state (要件 3.3)
  const [displayedEarnings, setDisplayedEarnings] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Derive wallet state from context
  const walletConnected = midnightWallet.isConnected;
  const walletAddress = midnightWallet.formattedAddress || '';

  // useCallback for event handlers (要件 10.4)
  const handleWalletConnectClick = React.useCallback(() => {
    setShowWalletModal(true);
  }, []);

  const handleWalletDisconnect = React.useCallback(() => {
    midnightWallet.disconnect();
  }, [midnightWallet]);

  const transactions = [
    {
      id: 1,
      amount: 10,
      purpose: 'Public Health Analysis',
      date: '2025-02-01',
      researcher: 'Researcher X',
      txHash:
        '00000000cedb75e9c6315a3fa646718dc64290399e92dcc7401f00d7a1ab1dfc',
      blockHeight: 2599043,
    },
    {
      id: 2,
      amount: 25,
      purpose: 'Hypertension Study',
      date: '2025-01-28',
      researcher: 'Researcher Y',
      txHash:
        '00000000f8a721bc5e4d903281a6f3c92b8e47d156c904ea23f701b8cd92ef41',
      blockHeight: 2598012,
    },
    {
      id: 3,
      amount: 15,
      purpose: 'Diabetes Research',
      date: '2025-01-25',
      researcher: 'Researcher Z',
      txHash:
        '00000000a3e8b2c94f1d6078e52a9b3c71d4e8f609a2b5c8d7e6f0123456789a',
      blockHeight: 2596847,
    },
    {
      id: 4,
      amount: 20,
      purpose: 'Cardiovascular Analysis',
      date: '2025-01-20',
      researcher: 'Researcher X',
      txHash:
        '000000007b2c4d5e6f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
      blockHeight: 2594521,
    },
  ];

  const auditLog = [
    {
      id: 1,
      researcher: 'Researcher X',
      purpose: 'Hypertension Study',
      date: '2025-02-01 14:30',
      txHash:
        '00000000d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7081920304050',
    },
    {
      id: 2,
      researcher: 'Researcher Y',
      purpose: 'Public Health Analysis',
      date: '2025-01-28 10:15',
      txHash:
        '00000000e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f70819203040506',
    },
    {
      id: 3,
      researcher: 'Researcher Z',
      purpose: 'Diabetes Research',
      date: '2025-01-25 16:45',
      txHash:
        '00000000f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7081920304050607',
    },
  ];

  // useMemo for computed values (要件 10.4)
  const totalEarnings = React.useMemo(
    () => transactions.reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const handleWithdraw = React.useCallback(() => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    alert(`Withdrawing ${totalEarnings} NEXT tokens to ${walletAddress}`);
  }, [walletConnected, walletAddress, totalEarnings]);

  const handleFileUpload = React.useCallback(
    async (_file: File) => {
      // Check wallet connection first
      if (!walletConnected) {
        alert('Please connect your wallet first to register health data.');
        setShowWalletModal(true);
        return;
      }

      clearError();
      setUploadStatus('uploading');
      setUploadProgress(0);
      setPotentialEarnings(15);
      setLastTxHash(null);

      // Simulate file processing progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Wait for progress to complete
      await new Promise((resolve) => setTimeout(resolve, 2200));
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('processing');

      try {
        // Call the real blockchain contract!
        // Using demo data: age 30, male, condition "Hypertension"
        const result = await registerPatient(30, 'male', 'Hypertension');

        if (result) {
          console.log('Registration successful! TX:', result.txId);
          setLastTxHash(result.txId);
          setUploadStatus('complete');
        } else {
          // Registration failed (error is set in the hook)
          setUploadStatus('error');
        }
      } catch (err) {
        console.error('Registration error:', err);
        setUploadStatus('error');
      }
    },
    [walletConnected, registerPatient, clearError],
  );

  const handleFileSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

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
        {
          start: startValue,
          end: totalEarnings,
          easing: easingFunctions.easeOutCubic,
        },
        progress,
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

  return (
    <div className="min-h-screen bg-white">
      {/* Wallet Selection Modal - uses proper Midnight wallets */}
      <WalletSelectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />

      {/* Header - Clean design */}
      <header className="relative z-10 border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden md:inline text-sm text-slate-500">
              Patient Portal
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
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-slate-900">
            My Data Wallet
          </h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
            Manage your medical data sharing and track your earnings
          </p>
        </div>

        {/* Responsive Grid: 1 column mobile, 2 columns tablet+ (要件 8.1, 8.2, 8.3) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-4 sm:mb-6">
          {/* Earnings Card with Card - Responsive (要件 3.1, 8.1) */}
          <Card
            variant="accent"
            glow
            className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform"
            style={smoothTransition(['all'], { duration: 300 })}
          >
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Total Earnings
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Your rewards for contributing to medical research
              </p>
            </div>
            <div className="space-y-4">
              {/* Count-up animation - Responsive (要件 3.3, 8.1) */}
              <div
                className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-2"
                style={smoothTransition(['opacity'], { duration: 500 })}
              >
                <span
                  className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 ${
                    isAnimating ? 'opacity-80' : 'opacity-100'
                  }`}
                >
                  {displayedEarnings}
                </span>
                <span className="text-lg sm:text-xl lg:text-2xl text-slate-500">
                  NEXT Tokens
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                <span>+{transactions[0].amount} tokens this week</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {!walletConnected ? (
                  <Button
                    onClick={handleWalletConnectClick}
                    className="w-full sm:flex-1 bg-transparent border-blue-300 hover:bg-blue-500/10 touch-manipulation"
                    variant="outline"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleWalletDisconnect}
                      className="w-full sm:flex-1 bg-transparent border-blue-300 hover:bg-blue-500/10 touch-manipulation"
                      variant="outline"
                      size="sm"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">
                        {walletAddress.substring(0, 6)}...
                        {walletAddress.substring(walletAddress.length - 4)}
                      </span>
                      <span className="sm:hidden">
                        {walletAddress.substring(0, 4)}...
                        {walletAddress.substring(walletAddress.length - 4)}
                      </span>
                    </Button>
                    <Button
                      onClick={handleWithdraw}
                      className="w-full sm:flex-1 bg-blue-500 hover:bg-blue-600 touch-manipulation"
                      variant="default"
                    >
                      Withdraw
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Data Consent Card with Card - Responsive (要件 3.1, 8.1) */}
          <Card
            variant="primary"
            glow
            className="p-4 sm:p-6 touch-manipulation active:scale-[0.98] transition-transform"
            style={smoothTransition(['all'], { duration: 300 })}
          >
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Data Consent
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Control how your data is used
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-1">
                  <p className="font-medium text-slate-900">
                    Allow anonymized data usage
                  </p>
                  <p className="text-sm text-slate-500">
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
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-slate-500">
                    Your name and address are never revealed
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-slate-500">
                    Protected by Midnight's ZK technology
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Upload Card with Card (要件 3.1: グラスモーフィズムカードレイアウト) */}
        <Card
          variant="secondary"
          glow
          className="p-6 mb-6"
          style={smoothTransition(['all'], { duration: 300 })}
        >
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Upload Your Medical Data
              </h3>
            </div>
            <p className="text-sm text-slate-500">
              Share your medical records and earn NEXT tokens
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-linear-to-br bg-emerald-50 rounded-lg border border-emerald-400/20">
              <div className="flex items-start gap-3 mb-3">
                <Coins className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-600 mb-1">
                    Earn Tokens by Uploading
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Upload your medical records, lab results, or health data.
                    Each upload is processed securely with ZK technology and you
                    earn NEXT tokens when researchers use your anonymized data.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-emerald-400/20">
                <div>
                  <p className="text-lg font-bold text-emerald-600">10-30</p>
                  <p className="text-xs text-slate-400">Tokens per upload</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">100%</p>
                  <p className="text-xs text-slate-400">Privacy protected</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">Instant</p>
                  <p className="text-xs text-slate-400">Processing</p>
                </div>
              </div>
            </div>

            <FileUploadDropzone
              onFileSelect={handleFileUpload}
              onFileRemove={() => {
                setSelectedFile(null);
                setUploadStatus('idle');
                setUploadProgress(0);
              }}
              accept=".pdf,.csv,.json,.dcm,.dicom"
              maxSize={100}
              disabled={!dataConsent}
              isUploading={
                uploadStatus === 'uploading' || uploadStatus === 'processing'
              }
              uploadProgress={uploadProgress}
              validateMagicBytes={true}
            />

            {/* Data update transitions (要件 3.5: データ更新時のトランジション) */}
            {uploadStatus !== 'idle' && (
              <div
                className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
                style={smoothTransition(['opacity', 'transform'], {
                  duration: 500,
                })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-900">
                      {selectedFile?.name || 'my_lab_results_2025.pdf'}
                    </span>
                  </div>
                  {uploadStatus === 'complete' && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-400/20"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>

                {uploadStatus === 'uploading' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Uploading...</span>
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
                )}

                {uploadStatus === 'processing' && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                    <span className="font-medium text-blue-600">
                      {isRegistering
                        ? 'Submitting to blockchain via Midnight ZK...'
                        : 'Preparing ZK proof...'}
                    </span>
                  </div>
                )}

                {uploadStatus === 'complete' && (
                  <div
                    className="space-y-3"
                    style={smoothTransition(['opacity'], { duration: 500 })}
                  >
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">
                        Registration complete! Your data is now on the
                        blockchain.
                      </span>
                    </div>
                    {lastTxHash && (
                      <div className="p-3 bg-emerald-500/5 border border-emerald-400/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            Transaction Hash:
                          </span>
                          <a
                            href={getTxUrl(lastTxHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 transition-colors"
                          >
                            <span className="font-mono text-xs">
                              {formatTxHash(lastTxHash)}
                            </span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">
                          Potential Earnings
                        </span>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-emerald-600" />
                          <span className="text-lg font-bold text-emerald-600">
                            +{potentialEarnings} NEXT
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        You'll earn tokens when researchers access your
                        anonymized data. Your personal information is protected
                        using Midnight's ZK technology.
                      </p>
                    </div>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div
                    className="space-y-3"
                    style={smoothTransition(['opacity'], { duration: 500 })}
                  >
                    <div className="flex items-center gap-2 text-sm text-red-400">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Registration failed</span>
                    </div>
                    <div className="p-3 bg-red-500/10 border border-red-400/20 rounded-lg">
                      <p className="text-sm text-red-400 mb-2">
                        {registrationError ||
                          'An error occurred during blockchain registration.'}
                      </p>
                      <p className="text-xs text-slate-400">
                        Make sure the proof server is running and you have
                        sufficient testnet funds.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setUploadStatus('idle');
                        clearError();
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full border-red-400/50 hover:bg-red-400/10"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Transaction History with Card (要件 3.1: グラスモーフィズムカードレイアウト) */}
        <Card
          variant="secondary"
          glow
          className="p-6 mb-6"
          style={smoothTransition(['all'], { duration: 300 })}
        >
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Transaction History
              </h3>
            </div>
            <p className="text-sm text-slate-500">
              Recent rewards from data usage
            </p>
          </div>
          <div>
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                  style={smoothTransition(['background-color', 'transform'], {
                    duration: 300,
                    delay: index * 50,
                  })}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900">
                      {transaction.purpose}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
                      <span>{transaction.researcher}</span>
                      <span>•</span>
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <a
                        href={getTxUrl(transaction.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                        title={`View transaction on Midnight Explorer`}
                      >
                        <span className="font-mono text-xs">
                          {formatTxHash(transaction.txHash)}
                        </span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-emerald-600 bg-emerald-500/10 border-emerald-400/20"
                  >
                    +{transaction.amount} NEXT
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Audit Log with Card (要件 3.1: グラスモーフィズムカードレイアウト) */}
        <Card
          variant="accent"
          glow
          className="p-6"
          style={smoothTransition(['all'], { duration: 300 })}
        >
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Consent & Audit Log
              </h3>
            </div>
            <p className="text-sm text-slate-500">
              Timeline of when your data was accessed
            </p>
          </div>
          <div>
            <div className="space-y-4">
              {auditLog.map((log, index) => (
                <div
                  key={log.id}
                  className="relative pl-6 pb-4 border-l-2 border-blue-200 last:pb-0"
                  style={smoothTransition(['opacity'], {
                    duration: 300,
                    delay: index * 100,
                  })}
                >
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500" />
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900">{log.purpose}</p>
                    <p className="text-sm text-slate-500">
                      Accessed by {log.researcher}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{log.date}</span>
                      <span>•</span>
                      <a
                        href={getTxUrl(log.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                        title="View access transaction on Midnight Explorer"
                      >
                        <span className="font-mono">
                          {formatTxHash(log.txHash)}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="mt-2 p-3 bg-blue-500/5 border border-blue-200 rounded-md">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        <Shield className="h-3 w-3 inline mr-1 text-blue-600" />
                        Your personal information (Name, Address) is protected
                        using Midnight's ZK technology.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
});
