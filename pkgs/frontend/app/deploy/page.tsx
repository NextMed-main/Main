"use client";

import { useState, useCallback } from "react";
import { ContractType, type WalletAPIv4, deployContractFromBrowser } from "@/lib/midnight-deploy";

// Midnight DApp Connector API v4.0.0 types
interface UnshieldedAddressResult {
  unshieldedAddress: string;
}

interface DustBalanceResult {
  balance: string | bigint;
  cap: string | bigint;
}

interface ShieldedAddressesResult {
  shieldedAddress: string;
  shieldedCoinPublicKey: string;
  shieldedEncryptionPublicKey: string;
}

interface ConfigurationResult {
  networkId: string;
  indexerUri: string;
  indexerWsUri: string;
  proverServerUri: string;
  substrateNodeUri: string;
}

interface MidnightWalletAPI {
  getUnshieldedAddress(): Promise<UnshieldedAddressResult>;
  getShieldedAddresses(): Promise<ShieldedAddressesResult>;
  getDustBalance(): Promise<DustBalanceResult>;
  getConfiguration(): Promise<ConfigurationResult>;
  submitTransaction(tx: unknown): Promise<string>;
  balanceUnsealedTransaction(tx: unknown): Promise<unknown>;
  balanceSealedTransaction(tx: unknown): Promise<unknown>;
  makeTransfer?(params: unknown): Promise<unknown>;
}

interface MidnightLaceWallet {
  apiVersion: string;
  name: string;
  icon: string;
  connect(networkId: string): Promise<MidnightWalletAPI>;
}

declare global {
  interface Window {
    midnight?: {
      mnLace?: MidnightLaceWallet;
    };
  }
}

// Format balance from raw units (divide by 10^18)
function formatBalance(rawBalance: string | bigint): string {
  const balance = BigInt(rawBalance);
  const divisor = BigInt(10 ** 18);
  const whole = balance / divisor;
  const remainder = balance % divisor;
  const decimal = remainder.toString().padStart(18, "0").slice(0, 4);
  return `${whole}.${decimal}`;
}

export default function DeployPage() {
  const [status, setStatus] = useState<string>("Not connected");
  const [shieldedAddress, setShieldedAddress] = useState<string>("");
  const [unshieldedAddress, setUnshieldedAddress] = useState<string>("");
  const [dustBalance, setDustBalance] = useState<string>("0");
  const [networkConfig, setNetworkConfig] = useState<ConfigurationResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [walletApi, setWalletApi] = useState<MidnightWalletAPI | null>(null);
  const [selectedContract, setSelectedContract] = useState<string>(ContractType.PATIENT_REGISTRY);
  const [deployedAddress, setDeployedAddress] = useState<string>("");

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const connectWallet = useCallback(async () => {
    try {
      addLog("Checking for Lace Midnight wallet...");

      const mnLace = window.midnight?.mnLace;
      if (!mnLace) {
        setStatus("Please install Lace Beta Wallet for Midnight Network");
        addLog("ERROR: Lace Midnight wallet not detected.");
        return;
      }

      addLog(`Lace wallet detected (API v${mnLace.apiVersion})`);

      const networkId = "preview";
      addLog(`Connecting to ${networkId} network...`);
      addLog("Please approve the connection in your Lace wallet popup...");

      const api = await mnLace.connect(networkId);
      setWalletApi(api);
      addLog("Wallet connected!");

      addLog("Fetching wallet data...");

      // Get shielded addresses
      try {
        const shieldedResult = await api.getShieldedAddresses();
        if (shieldedResult?.shieldedAddress) {
          setShieldedAddress(shieldedResult.shieldedAddress);
          addLog(`Shielded Address: ${shieldedResult.shieldedAddress.substring(0, 32)}...`);
        }
      } catch (e) {
        addLog(`Note: Could not get shielded addresses`);
      }

      // Get unshielded address
      try {
        const unshieldedResult = await api.getUnshieldedAddress();
        if (unshieldedResult?.unshieldedAddress) {
          setUnshieldedAddress(unshieldedResult.unshieldedAddress);
          addLog(`Unshielded: ${unshieldedResult.unshieldedAddress}`);
        }
      } catch (e) {
        addLog(`Note: Could not get unshielded address`);
      }

      // Get DUST balance
      try {
        const balanceResult = await api.getDustBalance();
        if (balanceResult?.balance) {
          const formatted = formatBalance(balanceResult.balance);
          setDustBalance(formatted);
          addLog(`DUST Balance: ${formatted} tDUST`);
        }
      } catch (e) {
        addLog(`Note: Could not get DUST balance`);
      }

      // Get configuration
      try {
        const config = await api.getConfiguration();
        setNetworkConfig(config);
        addLog(`Network: ${config.networkId}`);
        addLog(`Prover: ${config.proverServerUri}`);
      } catch (e) {
        addLog(`Note: Could not get configuration`);
      }

      setStatus(`Connected to Preview Network`);
      setIsConnected(true);
      addLog("");
      addLog("SUCCESS: Wallet connected!");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus(`Connection failed: ${message}`);
      addLog(`ERROR: ${message}`);
      console.error("Wallet connection error:", error);
    }
  }, []);

  const deployContract = useCallback(async () => {
    if (!isConnected || !walletApi) {
      addLog("Please connect wallet first");
      return;
    }

    setIsDeploying(true);
    addLog("");
    addLog("=".repeat(50));
    addLog(`DEPLOYING ${selectedContract.toUpperCase()}`);
    addLog("=".repeat(50));
    addLog("");

    try {
      // Cast to the expected type
      const result = await deployContractFromBrowser(
        walletApi as WalletAPIv4,
        selectedContract as "patient-registry" | "consent-registry",
        addLog
      );

      if (result.success && result.contractAddress) {
        setDeployedAddress(result.contractAddress);
        addLog("");
        addLog("Deployment complete! Contract address saved.");
      } else {
        addLog(`Deployment failed: ${result.error}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addLog(`ERROR: ${message}`);
    }

    setIsDeploying(false);
  }, [isConnected, walletApi, selectedContract]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          NextMed Contract Deployment
        </h1>
        <p className="text-gray-400 mb-8">Deploy to Midnight Preview Network</p>

        {/* Status Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Wallet Status</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isConnected ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <p className="text-gray-400 mb-4">{status}</p>

          {isConnected && (
            <div className="space-y-3 text-sm mb-4">
              {unshieldedAddress && (
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <span className="text-gray-500 text-xs block mb-1">Unshielded Address</span>
                  <code className="text-blue-400 break-all text-xs">{unshieldedAddress}</code>
                </div>
              )}
              {shieldedAddress && (
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <span className="text-gray-500 text-xs block mb-1">Shielded Address</span>
                  <code className="text-purple-400 break-all text-xs">{shieldedAddress}</code>
                </div>
              )}
              <div className="flex items-center justify-between bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-3 border border-green-700/30">
                <span className="text-gray-400">tDUST Balance</span>
                <span className="text-green-400 font-bold text-2xl">{dustBalance}</span>
              </div>
              {networkConfig && (
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <span className="text-gray-500 text-xs block mb-1">Network</span>
                  <span className="text-blue-400">{networkConfig.networkId}</span>
                  <span className="text-gray-600 mx-2">|</span>
                  <span className="text-gray-400 text-xs">Prover: {networkConfig.proverServerUri}</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={connectWallet}
            disabled={isConnected}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-green-700 disabled:cursor-default rounded-xl font-medium transition-all"
          >
            {isConnected ? "✓ Wallet Connected" : "Connect Lace Wallet"}
          </button>
        </div>

        {/* Deploy Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Deploy Contracts</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setSelectedContract(ContractType.PATIENT_REGISTRY)}
              className={`rounded-xl p-4 text-left transition-all ${
                selectedContract === ContractType.PATIENT_REGISTRY
                  ? "bg-purple-600/30 border-2 border-purple-500"
                  : "bg-gray-700/50 border border-gray-600 hover:border-gray-500"
              }`}
            >
              <h3 className="font-medium text-purple-400">PatientRegistry</h3>
              <p className="text-sm text-gray-400">Core patient data registry with ZK proofs</p>
            </button>
            <button
              onClick={() => setSelectedContract(ContractType.CONSENT_REGISTRY)}
              className={`rounded-xl p-4 text-left transition-all ${
                selectedContract === ContractType.CONSENT_REGISTRY
                  ? "bg-purple-600/30 border-2 border-purple-500"
                  : "bg-gray-700/50 border border-gray-600 hover:border-gray-500"
              }`}
            >
              <h3 className="font-medium text-purple-400">ConsentRegistry</h3>
              <p className="text-sm text-gray-400">Patient consent management</p>
            </button>
          </div>

          {deployedAddress && (
            <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 mb-4">
              <span className="text-green-400 text-sm block mb-1">Deployed Contract Address</span>
              <code className="text-green-300 text-xs break-all">{deployedAddress}</code>
            </div>
          )}

          <button
            onClick={deployContract}
            disabled={!isConnected || isDeploying}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl font-medium transition-all text-lg"
          >
            {isDeploying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deploying...
              </span>
            ) : (
              `Deploy ${selectedContract === ContractType.PATIENT_REGISTRY ? "Patient Registry" : "Consent Registry"}`
            )}
          </button>
        </div>

        {/* Logs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Logs</h2>
            <button onClick={() => setLogs([])} className="text-sm text-gray-400 hover:text-white">
              Clear
            </button>
          </div>
          <div className="bg-black/50 rounded-xl p-4 h-80 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click &quot;Connect Lace Wallet&quot; to start...</p>
            ) : (
              logs.map((log, i) => (
                <p
                  key={i}
                  className={
                    log.includes("ERROR")
                      ? "text-red-400"
                      : log.includes("SUCCESS") || log.includes("SUCCESSFUL")
                      ? "text-green-400"
                      : log.startsWith("=")
                      ? "text-yellow-400"
                      : log.startsWith("Step")
                      ? "text-cyan-400"
                      : log.includes("Please approve")
                      ? "text-orange-400"
                      : "text-gray-300"
                  }
                >
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
