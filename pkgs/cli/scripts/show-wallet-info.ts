/**
 * Show Wallet Info
 * 
 * Displays the wallet address derived from the WALLET_SEED in .env
 */

import "dotenv/config";
import { createHash } from "crypto";

const WALLET_SEED = process.env.WALLET_SEED;

if (!WALLET_SEED) {
  console.error("❌ WALLET_SEED not found in .env file");
  console.log("\nPlease add WALLET_SEED to pkgs/cli/.env");
  process.exit(1);
}

console.log("═══════════════════════════════════════════════════════");
console.log("                    WALLET INFO");
console.log("═══════════════════════════════════════════════════════\n");

// Display seed (partially hidden for security)
const maskedSeed = `${WALLET_SEED.slice(0, 8)}...${WALLET_SEED.slice(-8)}`;
console.log(`📋 Seed (masked):    ${maskedSeed}`);
console.log(`📏 Seed length:      ${WALLET_SEED.length} characters`);

// Derive a simple address hash (for display purposes)
// Note: Actual Midnight address derivation is more complex
const seedBuffer = Buffer.from(WALLET_SEED, "hex");
const publicKeyHash = createHash("sha256").update(seedBuffer).digest("hex");
const displayAddress = `0x${publicKeyHash.slice(0, 40)}`;

console.log(`\n💳 Derived Address (preview): ${displayAddress}`);

console.log("\n═══════════════════════════════════════════════════════");
console.log("⚠️  Note: The actual Midnight address will be shown");
console.log("    when you connect to the testnet using the wallet API.");
console.log("");
console.log("💡 To get tDUST tokens:");
console.log("   1. Run: pnpm run deploy:patient-registry");
console.log("   2. The actual address will be logged");
console.log("   3. Visit: https://faucet.testnet.midnight.network");
console.log("═══════════════════════════════════════════════════════\n");
