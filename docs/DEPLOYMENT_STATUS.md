# NextMed Midnight DApp - Deployment Status

> **Last Updated:** 2026-01-20

## 🔴 Current Status: Migration Required

The codebase has a **version mismatch** that needs to be resolved before deployment.

## Problem Analysis

### Package Version Conflicts

| Package | CLI Version | Contract Version | Required for Preview |
|---------|-------------|------------------|---------------------|
| `@midnight-ntwrk/compact-runtime` | 0.11.0-rc.1 | ^0.9.0 | 0.11.0-rc.1 |
| `@midnight-ntwrk/midnight-js-network-id` | 3.0.0-alpha.14 | ^0.1.14 | 3.0.0-alpha.11+ |
| `@midnight-ntwrk/ledger` vs `ledger-v6` | Using ledger-v6 | Using ledger | Need ledger-v6 |
| `@midnight-ntwrk/wallet` | Missing | N/A | Version 5.0.0 |

### Code Pattern Mismatches

| File | Uses Pattern | Needs Pattern |
|------|--------------|---------------|
| `api.ts` | WalletBuilder (SDK v2) | Same, but with v5.0.0 wallet |
| `api.ts` | `@midnight-ntwrk/ledger` | `@midnight-ntwrk/ledger-v6` |
| `deploy-preview.ts` | createWalletFacade | WalletBuilder |

## Network Information

### Preview Network (Target)
- **RPC:** https://rpc.preview.midnight.network
- **Indexer:** https://indexer.preview.midnight.network/api/v3/graphql
- **Proof Server:** https://lace-proof-pub.preview.midnight.network (remote)
- **Faucet:** https://faucet.preview.midnight.network
- **Network ID:** `preview` (string literal)

### Testnet-02 (Legacy)
- **RPC:** https://rpc.testnet-02.midnight.network
- **Indexer:** https://indexer.testnet-02.midnight.network/api/v1/graphql
- **Network ID:** `testnet-02` (enum)

## Required Migrations

### Option A: Migrate to Preview (SDK v3) ⭐ Recommended
1. Update `contract/package.json` to use `compact-runtime: 0.11.0-rc.1`
2. Update `api.ts` imports from `@midnight-ntwrk/ledger` to `@midnight-ntwrk/ledger-v6`
3. Add `@midnight-ntwrk/wallet: 5.0.0` to CLI dependencies
4. Update network ID handling to use string literal `"preview"`
5. Recompile all contracts with new compiler

### Option B: Revert to Testnet-02 (SDK v2)
1. Downgrade CLI packages to v2.x
2. Keep existing code patterns
3. Use Testnet-02 network endpoints

## Wallet Information

- **Mnemonic:** `toast shrimp lumber shop keen obvious fit diary height olympic demise legend hazard reform horn two fish virus fiction bleak rent tortoise ancient fetch`
- **Seed (entropy):** `e318e613e3579b3155f1ea6ab348e93fc69f689b675d57be91570bcb65cb0222`
- **Expected Address Prefix:** `mn_addr_preview1...` / `mn_shield-addr_preview1...`
- **Your Lace Address:** `mn_addr_preview1dkkmky4lqa7aakzhq9eqlf383rkknlqfq8wm3ynay4mncqfz50cqz62d5l`

## Contracts Summary

| Contract | Circuits | Status |
|----------|----------|--------|
| patient-registry.compact | 3 | ✅ Compiled |
| consent-registry.compact | 3 | ✅ Compiled |
| incentive-pool.compact | 5 | ✅ Compiled |
| medical-upload-verifier.compact | 5 | ✅ Compiled |
| zk-data-masking.compact | 10 | ✅ Compiled |
| viewing-key-manager.compact | 8 | ✅ Compiled |

**Total: 6 contracts, ~34 circuits**

## Next Steps

1. Execute the SDK v3 migration script
2. Rebuild contracts with new runtime
3. Fix TypeScript type errors
4. Test deployment on Preview network
