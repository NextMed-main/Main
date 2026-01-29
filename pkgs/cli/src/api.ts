// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as fsAsync from 'node:fs/promises';
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { type ShieldedCoinInfo, nativeToken, Transaction, type TransactionId, type UnprovenTransaction } from '@midnight-ntwrk/ledger-v6';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { setNetworkId, getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import {
    type BalancedProvingRecipe,
    NOTHING_TO_PROVE,
    type MidnightProvider,
    type WalletProvider,
    type FinalizedTxData,
} from '@midnight-ntwrk/midnight-js-types';
import { assertIsContractAddress, toHex } from '@midnight-ntwrk/midnight-js-utils';
import { type Resource, WalletBuilder } from '@midnight-ntwrk/wallet';
import { type Wallet } from '@midnight-ntwrk/wallet-api';
import { Transaction as ZswapTransaction, NetworkId as ZswapNetworkId } from '@midnight-ntwrk/zswap';
import { webcrypto } from 'crypto';
import { type Logger } from 'pino';
import * as Rx from 'rxjs';
import { WebSocket } from 'ws';
import * as bip39 from 'bip39';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import {
    PatientRegistry,
    ConsentRegistry,
    IncentivePool,
    MedicalUploadVerifier,
    ZKDataMasking,
    ViewingKeyManager,
    witnesses as patientRegistryWitnesses,
    viewingKeyManagerWitnesses,
    zkDataMaskingWitnesses,
    createPrivateState,
    createZKMaskingPrivateState,
    createViewingKeyPrivateState,
} from '../../contract/dist/index.js';
import {
    type Config,
    patientRegistryConfig,
    consentRegistryConfig,
    incentivePoolConfig,
    medicalUploadVerifierConfig,
    zkDataMaskingConfig,
    viewingKeyManagerConfig,
} from './config';
import {
    type DeployedPatientRegistryContract,
    type PatientRegistryCircuits,
    type PatientRegistryContract,
    PatientRegistryPrivateStateId,
    type PatientRegistryProviders,
    type RegistrationStats,
    type DeployedConsentRegistryContract,
    type ConsentRegistryContract,
    ConsentRegistryPrivateStateId,
    type ConsentRegistryProviders,
    type ConsentRegistryCircuits,
    type DeployedIncentivePoolContract,
    type IncentivePoolContract,
    IncentivePoolPrivateStateId,
    type IncentivePoolProviders,
    type IncentivePoolCircuits,
    type DeployedMedicalUploadVerifierContract,
    type MedicalUploadVerifierContract,
    MedicalUploadVerifierPrivateStateId,
    type MedicalUploadVerifierProviders,
    type MedicalUploadVerifierCircuits,
    type DeployedZKDataMaskingContract,
    type ZKDataMaskingContract,
    ZKDataMaskingPrivateStateId,
    type ZKDataMaskingProviders,
    type ZKDataMaskingCircuits,
    type DeployedViewingKeyManagerContract,
    type ViewingKeyManagerContract,
    ViewingKeyManagerPrivateStateId,
    type ViewingKeyManagerProviders,
    type ViewingKeyManagerCircuits,
} from './utils/common-types';

let logger: Logger;
// Instead of setting globalThis.crypto which is read-only, we'll ensure crypto is available
// but won't try to overwrite the global property
// @ts-expect-error: It's needed to enable WebSocket usage through apollo
globalThis.WebSocket = WebSocket;

// ========================================
// Contract Instances
// ========================================

export const patientRegistryContractInstance: PatientRegistryContract = new PatientRegistry.Contract(
  patientRegistryWitnesses,
);

export const consentRegistryContractInstance: ConsentRegistryContract = new ConsentRegistry.Contract(
  patientRegistryWitnesses,
);

export const incentivePoolContractInstance: IncentivePoolContract = new IncentivePool.Contract(
  patientRegistryWitnesses,
);

export const medicalUploadVerifierContractInstance: MedicalUploadVerifierContract = new MedicalUploadVerifier.Contract(
  patientRegistryWitnesses as any, // Witness shapes are compatible, Ledger types differ
);

export const zkDataMaskingContractInstance: ZKDataMaskingContract = new ZKDataMasking.Contract(
  zkDataMaskingWitnesses,
);

export const viewingKeyManagerContractInstance: ViewingKeyManagerContract = new ViewingKeyManager.Contract(
  viewingKeyManagerWitnesses,
);

// ========================================
// Deployment Functions
// ========================================

/**
 * Patient Registryコントラクトをデプロイ
 */
export const deployPatientRegistry = async (
  providers: PatientRegistryProviders,
): Promise<DeployedPatientRegistryContract> => {
  logger.info('Deploying Patient Registry contract...');
  const secretKey = new Uint8Array(32);
  webcrypto.getRandomValues(secretKey);
  
  const patientRegistryContract = await deployContract(providers, {
    contract: patientRegistryContractInstance,
    privateStateId: PatientRegistryPrivateStateId,
    initialPrivateState: createPrivateState(secretKey),
  });
  logger.info(
    `Deployed Patient Registry contract at address: ${patientRegistryContract.deployTxData.public.contractAddress}`,
  );
  return patientRegistryContract;
};

/**
 * Consent Registryコントラクトをデプロイ
 */
export const deployConsentRegistry = async (
  providers: ConsentRegistryProviders,
): Promise<DeployedConsentRegistryContract> => {
  logger.info('Deploying Consent Registry contract...');
  const secretKey = new Uint8Array(32);
  webcrypto.getRandomValues(secretKey);
  
  const consentRegistryContract = await deployContract(providers, {
    contract: consentRegistryContractInstance,
    privateStateId: ConsentRegistryPrivateStateId,
    initialPrivateState: createPrivateState(secretKey),
  });
  logger.info(
    `Deployed Consent Registry contract at address: ${consentRegistryContract.deployTxData.public.contractAddress}`,
  );
  return consentRegistryContract;
};

/**
 * Incentive Poolコントラクトをデプロイ
 */
export const deployIncentivePool = async (
  providers: IncentivePoolProviders,
): Promise<DeployedIncentivePoolContract> => {
  logger.info('Deploying Incentive Pool contract...');
  const secretKey = new Uint8Array(32);
  webcrypto.getRandomValues(secretKey);
  
  const incentivePoolContract = await deployContract(providers, {
    contract: incentivePoolContractInstance,
    privateStateId: IncentivePoolPrivateStateId,
    initialPrivateState: createPrivateState(secretKey),
  });
  logger.info(
    `Deployed Incentive Pool contract at address: ${incentivePoolContract.deployTxData.public.contractAddress}`,
  );
  return incentivePoolContract;
};

/**
 * Medical Upload Verifierコントラクトをデプロイ
 */
export const deployMedicalUploadVerifier = async (
  providers: MedicalUploadVerifierProviders,
): Promise<DeployedMedicalUploadVerifierContract> => {
  logger.info('Deploying Medical Upload Verifier contract...');
  const secretKey = new Uint8Array(32);
  webcrypto.getRandomValues(secretKey);
  
  const medicalUploadVerifierContract = await deployContract(providers, {
    contract: medicalUploadVerifierContractInstance,
    privateStateId: MedicalUploadVerifierPrivateStateId,
    initialPrivateState: createPrivateState(secretKey),
  });
  logger.info(
    `Deployed Medical Upload Verifier contract at address: ${medicalUploadVerifierContract.deployTxData.public.contractAddress}`,
  );
  return medicalUploadVerifierContract;
};

/**
 * ZK Data Maskingコントラクトをデプロイ
 */
export const deployZKDataMasking = async (
  providers: ZKDataMaskingProviders,
): Promise<DeployedZKDataMaskingContract> => {
  logger.info('Deploying ZK Data Masking contract...');
  const secretKey = new Uint8Array(32);
  webcrypto.getRandomValues(secretKey);
  
  const zkDataMaskingContract = await deployContract(providers, {
    contract: zkDataMaskingContractInstance,
    privateStateId: ZKDataMaskingPrivateStateId,
    initialPrivateState: createZKMaskingPrivateState(secretKey),
  });
  logger.info(
    `Deployed ZK Data Masking contract at address: ${zkDataMaskingContract.deployTxData.public.contractAddress}`,
  );
  return zkDataMaskingContract;
};

/**
 * Viewing Key Managerコントラクトをデプロイ
 */
export const deployViewingKeyManager = async (
  providers: ViewingKeyManagerProviders,
): Promise<DeployedViewingKeyManagerContract> => {
  logger.info('Deploying Viewing Key Manager contract...');
  const secretKey = new Uint8Array(32);
  webcrypto.getRandomValues(secretKey);
  
  const viewingKeyManagerContract = await deployContract(providers, {
    contract: viewingKeyManagerContractInstance,
    privateStateId: ViewingKeyManagerPrivateStateId,
    initialPrivateState: createViewingKeyPrivateState(secretKey),
  });
  logger.info(
    `Deployed Viewing Key Manager contract at address: ${viewingKeyManagerContract.deployTxData.public.contractAddress}`,
  );
  return viewingKeyManagerContract;
};

/**
 * 症状データをハッシュ化
 *
 * @param condition - 症状を表す文字列（例: "Diabetes", "Hypertension"）
 * @returns ハッシュ化された症状データ（64ビット整数）
 *
 * プライバシー保護のため、症状データをSHA-256でハッシュ化します。
 * ハッシュの最初の64ビット（16文字）を取り出し、bigint型に変換します。
 * これにより、元の症状データを公開せずに、統計処理や検証が可能になります。
 */
const hashCondition = (condition: string): bigint => {
  const hash = createHash('sha256').update(condition).digest('hex');
  return BigInt('0x' + hash.substring(0, 16));
};

// Patient Registry functions
export const getPatientRegistryLedgerState = async (
  providers: PatientRegistryProviders,
  contractAddress: ContractAddress,
): Promise<PatientRegistry.Ledger | null> => {
  assertIsContractAddress(contractAddress);
  logger.info('Checking Patient Registry contract ledger state...');
  const state = await providers.publicDataProvider
    .queryContractState(contractAddress)
    .then((contractState) => (contractState != null ? PatientRegistry.ledger(contractState.data as any) : null));
  if (state !== null) {
    logger.info(
      `Ledger state: registrationCount=${state.registrationCount}, maleCount=${state.maleCount}, femaleCount=${state.femaleCount}, otherCount=${state.otherCount}`,
    );
  } else {
    logger.info('No ledger state found');
  }
  return state;
};

export const joinPatientRegistryContract = async (
  providers: PatientRegistryProviders,
  contractAddress: string,
): Promise<DeployedPatientRegistryContract> => {
  // Generate a deterministic secret key for the private state
  // In production, this should be derived from the user's wallet
  const secretKey = new Uint8Array(32);
  webcrypto.getRandomValues(secretKey);
  
  const patientRegistryContract = await findDeployedContract(providers, {
    contractAddress,
    contract: patientRegistryContractInstance,
    privateStateId: 'patientRegistryPrivateState',
    initialPrivateState: createPrivateState(secretKey),
  });
  logger.info(
    `Joined Patient Registry contract at address: ${patientRegistryContract.deployTxData.public.contractAddress}`,
  );
  return patientRegistryContract;
};

/**
 * 登録統計情報を取得
 *
 * @param contract - デプロイ済みのPatient Registryコントラクト
 * @returns 登録統計情報（総数、性別ごとの人数）
 *
 * コントラクトに登録されている患者データの統計情報を取得します。
 * - 総登録数
 * - 男性の登録数
 * - 女性の登録数
 * - その他の性別の登録数
 *
 * この情報は公開されており、誰でも閲覧可能です。
 * ただし、個人を特定できる情報は含まれません。
 */
export const getRegistrationStats = async (
  contract: DeployedPatientRegistryContract,
  providers: PatientRegistryProviders,
): Promise<RegistrationStats> => {
  logger.info('Fetching registration statistics...');

  // publicDataProviderを使用してコントラクトの状態を取得
  const contractAddress = contract.deployTxData.public.contractAddress;
  const state = await providers.publicDataProvider.queryContractState(contractAddress);
  if (!state) {
    throw new Error('Contract state not found');
  }
  
  const { ledger } = await import('../../contract/dist/managed/patient-registry/contract/index.js');
  const ledgerState = ledger(state.data as any);
  
  logger.debug('Ledger state accessed successfully');
  logger.debug(`registrationCount: ${ledgerState.registrationCount}`);
  logger.debug(`maleCount: ${ledgerState.maleCount}`);
  logger.debug(`femaleCount: ${ledgerState.femaleCount}`);
  logger.debug(`otherCount: ${ledgerState.otherCount}`);
  
  const result: RegistrationStats = [
    ledgerState.registrationCount,
    ledgerState.maleCount,
    ledgerState.femaleCount,
    ledgerState.otherCount,
  ];

  logger.info(
    {
      totalCount: result[0].toString(),
      maleCount: result[1].toString(),
      femaleCount: result[2].toString(),
      otherCount: result[3].toString(),
    },
    'Statistics retrieved successfully',
  );

  return result;
};

/**
 * 患者を登録
 *
 * @param contract - デプロイ済みのPatient Registryコントラクト
 * @param age - 患者の年齢（0-150の範囲）
 * @param genderCode - 性別コード（0=男性、1=女性、2=その他）
 * @param conditionHash - 症状データのハッシュ値（bigint）
 * @returns ファイナライズされたトランザクションデータ
 *
 * 新しい患者データをコントラクトに登録します。
 * - 年齢は0-150の範囲で検証されます
 * - 性別コードに応じて統計カウンターが更新されます
 * - 症状データはハッシュ化された状態で保存されます
 *
 * プライバシー保護のため、個人を特定できる情報は含まれません。
 * 統計情報のみが公開されます。
 */
export const registerPatient = async (
  contract: DeployedPatientRegistryContract,
  age: bigint,
  genderCode: bigint,
  conditionHash: bigint,
): Promise<FinalizedTxData> => {
  logger.info(
    {
      age: age.toString(),
      genderCode: genderCode.toString(),
      conditionHash: conditionHash.toString(),
    },
    'Registering patient...',
  );

  // registerPatient circuitを呼び出し
  const finalizedTx = await contract.callTx.registerPatient(age, genderCode, conditionHash);

  logger.info(
    {
      txId: finalizedTx.public.txId,
      blockHeight: finalizedTx.public.blockHeight,
    },
    'Patient registered successfully',
  );

  return finalizedTx.public;
};

/**
 * 年齢範囲を検証
 *
 * @param contract - デプロイ済みのPatient Registryコントラクト
 * @param age - 検証する年齢
 * @param minAge - 最小年齢
 * @param maxAge - 最大年齢
 * @returns 指定された年齢範囲に該当するかどうか
 *
 * コントラクトのverifyAgeRange circuitを使用して検証します。
 * これはpure circuit（状態変更なし）なので、ZK証明は生成われませんが、
 * Compact言語で定義されたロジックが使用されます。
 */
export const verifyAgeRange = async (
  contract: DeployedPatientRegistryContract,
  age: bigint,
  minAge: bigint,
  maxAge: bigint,
): Promise<boolean> => {
  logger.info(
    {
      age: age.toString(),
      minAge: minAge.toString(),
      maxAge: maxAge.toString(),
    },
    'Verifying age range using contract circuit...',
  );

  // Use the contract's pure circuit for verification
  // pureCircuits.verifyAgeRange is the Compact-compiled logic
  const { pureCircuits } = PatientRegistry;
  const isInRange = pureCircuits.verifyAgeRange(age, minAge, maxAge);
  
  logger.info(
    {
      age: age.toString(),
      minAge: minAge.toString(),
      maxAge: maxAge.toString(),
      isInRange,
    },
    'Age range verification completed via contract circuit',
  );

  return isInRange;
};
;

/**
 * ウォレットとMidnightプロバイダーを作成
 *
 * @param wallet - Midnightウォレットインスタンス
 * @returns ウォレットプロバイダーとMidnightプロバイダーの統合インターフェース
 *
 * ウォレットの状態を取得し、トランザクションのバランス調整、
 * 証明生成、送信を行うためのプロバイダーを作成します。
 *
 * 主な機能:
 * - coinPublicKey: コインの公開鍵
 * - encryptionPublicKey: 暗号化用の公開鍵
 * - balanceTx: トランザクションのバランス調整とゼロ知識証明の生成
 * - submitTx: トランザクションのブロックチェーンへの送信
 */
// Helper to convert string network ID to ZswapNetworkId enum
const getZswapNetworkId = (): ZswapNetworkId => {
  const networkId = getNetworkId();
  switch (networkId) {
    case 'preview':
    case 'testnet':
    case 'testnet-02':
      return ZswapNetworkId.TestNet;
    case 'devnet':
      return ZswapNetworkId.DevNet;
    case 'mainnet':
      return ZswapNetworkId.MainNet;
    default:
      return ZswapNetworkId.Undeployed;
  }
};

export const createWalletAndMidnightProvider = async (wallet: Wallet): Promise<WalletProvider & MidnightProvider> => {
  const state = await Rx.firstValueFrom(wallet.state());
  return {
    getCoinPublicKey: () => Promise.resolve(state.coinPublicKey),
    getEncryptionPublicKey: () => Promise.resolve(state.encryptionPublicKey),
    balanceTx(tx: UnprovenTransaction, newCoins: any[]): Promise<BalancedProvingRecipe> {
      return wallet
        .balanceTransaction(
          ZswapTransaction.deserialize(tx.serialize(), getZswapNetworkId()),
          newCoins,
        )
        .then((tx) => wallet.proveTransaction(tx))
        .then((zswapTx) => Transaction.deserialize('signature', 'proof', 'binding', zswapTx.serialize(getZswapNetworkId())))
        .then((finalizedTx) => ({
          type: NOTHING_TO_PROVE,
          transaction: finalizedTx,
        } as any));
    },
    submitTx(tx: Transaction<any, any, any>): Promise<TransactionId> {
      return wallet.submitTransaction(tx as any);
    },
  } as any;
};

/**
 * ウォレットの完全同期を待機
 *
 * @param wallet - Midnightウォレットインスタンス
 * @returns ウォレットが完全に同期された状態のPromise
 *
 * ウォレットがブロックチェーンと完全に同期されるまで待機します。
 * 5秒ごとに同期状態をチェックし、進捗をログに出力します。
 *
 * 同期状態の指標:
 * - applyGap: ウォレットの適用遅延
 * - sourceGap: バックエンドの遅延
 * - synced: 完全同期フラグ
 *
 * 完全に同期されるまで処理をブロックします。
 */
export const waitForSync = (wallet: Wallet) =>
  Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.throttleTime(5_000),
      Rx.tap((state) => {
        logger.info(
          `Waiting for funds. Transactions=${state.transactionHistory.length}`,
        );
      }),
      Rx.filter((state) => {
        // ウォレットが完全に同期された場合のみ進行を許可
        return state.syncProgress !== undefined && Boolean(state.syncProgress.synced);
      }),
    ),
  );

/**
 * ウォレットの同期進捗を待機
 *
 * @param wallet - Midnightウォレットインスタンス
 * @returns 同期進捗が定義された状態のPromise
 *
 * ウォレットの同期進捗情報が利用可能になるまで待機します。
 * waitForSyncとは異なり、完全同期を待たず、同期プロセスが
 * 開始されたことを確認するだけです。
 *
 * 5秒ごとに同期状態をチェックし、進捗をログに出力します。
 * syncProgressが定義されれば処理を続行します。
 */
export const waitForSyncProgress = async (wallet: Wallet) =>
  await Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.throttleTime(5_000),
      Rx.tap((state) => {
        logger.info(
          `Waiting for funds. Transactions=${state.transactionHistory.length}`,
        );
      }),
      Rx.filter((state) => {
        // syncProgressが定義されている場合のみ進行を許可
        return state.syncProgress !== undefined;
      }),
    ),
  );

/**
 * ウォレットに資金が入金されるまで待機
 *
 * @param wallet - Midnightウォレットインスタンス
 * @returns ネイティブトークンの残高（0より大きい値）
 *
 * ウォレットが同期され、かつネイティブトークン（tDUST）の
 * 残高が0より大きくなるまで待機します。
 *
 * 10秒ごとに状態をチェックし、進捗をログに出力します。
 *
 * 使用例:
 * - テストネットのFaucetから資金を受け取る際
 * - トランザクション実行前に十分な残高があることを確認する際
 */
export const waitForFunds = (wallet: Wallet) =>
  Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.throttleTime(10_000),
      Rx.tap((state) => {
        logger.info(
          `Waiting for funds. Transactions=${state.transactionHistory.length}`,
        );
      }),
      Rx.filter((state) => {
        // ウォレットが同期されている場合のみ進行を許可
        return Boolean(state.syncProgress?.synced);
      }),
      Rx.map((s) => s.balances[nativeToken() as any] ?? 0n),
      Rx.filter((balance) => balance > 0n),
    ),
  );

/**
 * Derive the default wallet seed from a 32-byte private key part of a seed.
 * Based on Midnight developer guide.
 */
function deriveDefaultWalletSeed(seed: Uint8Array): Uint8Array {
  const generatedWallet = HDWallet.fromSeed(seed);
  if (generatedWallet.type !== "seedOk") {
    throw new Error("Error initializing HD Wallet");
  }
  const zswapKey = generatedWallet.hdWallet
    .selectAccount(0)
    .selectRole(Roles.Zswap)
    .deriveKeyAt(0);
  
  if (zswapKey.type === "keyDerived") {
    return zswapKey.key;
  } else {
    throw new Error("Error deriving key");
  }
}

/**
 * ウォレットを構築し、資金が入金されるまで待機
 *
 * @param config - Midnight設定（indexer, node, proofServer等）
 * @param seedOrMnemonic - ウォレットのシード（秘密鍵の元）またはニーモニック
 * @param filename - ウォレット状態の保存ファイル名
 * @returns 資金が入金されたウォレットインスタンス
 */
export const buildWalletAndWaitForFunds = async (
  { indexer, indexerWS, node, proofServer }: Config,
  seedOrMnemonic: string,
  filename: string,
): Promise<Wallet & Resource> => {
  const directoryPath = process.env.SYNC_CACHE;
  let wallet: Wallet & Resource;

  // Resolve seed from mnemonic if necessary
  let seed = seedOrMnemonic;
  if (seedOrMnemonic.includes(' ')) {
    logger.info('Mnemonic detected, deriving wallet seed using BIP39 + HDWallet (Lace-compatible)...');
    // 1. Convert mnemonic to 64-byte BIP39 seed using PBKDF2
    const bip39Seed = bip39.mnemonicToSeedSync(seedOrMnemonic.trim());
    logger.info(`BIP39 seed length: ${bip39Seed.length} bytes`);
    // 2. Use the full 64-byte seed with HDWallet for proper derivation
    // HDWallet uses BIP-32 derivation path: m / 44' / 2400' / account' / role / index
    const derivedSeed = deriveDefaultWalletSeed(bip39Seed.subarray(0, 32));
    seed = toHex(derivedSeed);
    logger.info(`Derived Zswap key: ${seed.substring(0, 16)}...`);
  } else if (seed.length === 128) {
    logger.info('64-byte hex seed detected, deriving via HDWallet...');
    const bip39Seed = Buffer.from(seed, 'hex');
    const derivedSeed = deriveDefaultWalletSeed(bip39Seed.subarray(0, 32));
    seed = toHex(derivedSeed);
  }

  if (directoryPath !== undefined) {
    if (fs.existsSync(`${directoryPath}/${filename}`)) {
      logger.info(`Attempting to restore state from ${directoryPath}/${filename}`);
      try {
        // 保存されたウォレット状態を読み込み
        const serializedStream = fs.createReadStream(`${directoryPath}/${filename}`, 'utf-8');
        const serialized = await streamToString(serializedStream);
        serializedStream.on('finish', () => {
          serializedStream.close();
        });
        // ウォレットを復元
        wallet = await WalletBuilder.restore(indexer, indexerWS, proofServer, node, serialized, 'info' as any);
        wallet.start();
        const stateObject = JSON.parse(serialized);
        // チェーンがリセットされていないか確認
        if ((await isAnotherChain(wallet, Number(stateObject.offset))) === true) {
          logger.warn('The chain was reset, building wallet from scratch');
          wallet = await WalletBuilder.buildFromSeed(
            indexer,
            indexerWS,
            proofServer,
            node,
            seed,
            getZswapNetworkId(),
            'info' as any,
          );
          wallet.start();
        } else {
          const newState = await waitForSync(wallet);
          // 実行間に新しいインデックスがない場合を許容
          if (newState.syncProgress?.synced) {
            logger.info('Wallet was able to sync from restored state');
          } else {
            logger.info(`Offset: ${stateObject.offset}`);
            logger.info(`SyncProgress: ${newState.syncProgress}`);
            logger.warn('Wallet was not able to sync from restored state, building wallet from scratch');
            wallet = await WalletBuilder.buildFromSeed(
              indexer,
              indexerWS,
              proofServer,
              node,
              seed,
              getZswapNetworkId(),
              'info' as any,
            );
            wallet.start();
          }
        }
      } catch (error: unknown) {
        if (typeof error === 'string') {
          logger.error(error);
        } else if (error instanceof Error) {
          logger.error(error.message);
        } else {
          logger.error(error);
        }
        logger.warn('Wallet was not able to restore using the stored state, building wallet from scratch');
        wallet = await WalletBuilder.buildFromSeed(
          indexer,
          indexerWS,
          proofServer,
          node,
          seed,
          getZswapNetworkId(),
          'info' as any,
        );
        wallet.start();
      }
    } else {
      logger.info('Wallet save file not found, building wallet from scratch');
      wallet = await WalletBuilder.buildFromSeed(
        indexer,
        indexerWS,
        proofServer,
        node,
        seed,
        getZswapNetworkId(),
        'info' as any,
      );
      wallet.start();
    }
  } else {
  logger.info(`Building wallet with: indexer=${indexer}, node=${node}, proofServer=${proofServer}, networkId=${getZswapNetworkId()}`);
  const seedBytes = Buffer.from(seed, 'hex');
  logger.info(`Seed hex length: ${seed.length}, Byte length: ${seedBytes.length}`);
  wallet = await WalletBuilder.buildFromSeed(
    indexer,
    indexerWS,
    proofServer,
    node,
    seed,
    getZswapNetworkId(),
    'info' as any,
  );
    wallet.start();
  }

  const state = await Rx.firstValueFrom(wallet.state());
  logger.info(`Your wallet address is: ${state.address}`);
  let balance = state.balances[nativeToken() as unknown as string];
  if (balance === undefined || balance === 0n) {
    logger.info(`Your wallet balance is: 0`);
    logger.info(`Waiting to receive tokens...`);
    balance = await waitForFunds(wallet);
  }
  logger.info(`Your wallet balance is: ${balance}`);
  return wallet;
};

/**
 * ランダムなバイト列を生成
 *
 * @param length - 生成するバイト数
 * @returns ランダムなバイト列
 *
 * 暗号学的に安全な乱数生成器を使用してランダムなバイト列を生成します。
 * ウォレットのシード生成などに使用されます。
 */
export const randomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  webcrypto.getRandomValues(bytes);
  return bytes;
};

/**
 * 新しいウォレットを構築
 *
 * @param config - Midnight設定
 * @returns 新しく作成されたウォレットインスタンス
 *
 * ランダムなシードを生成して新しいウォレットを作成します。
 * 保存ファイルは使用せず、常に新規作成されます。
 *
 * 注意: このウォレットのシードは一度しか表示されないため、
 * 必ず記録してください。シードを失うとウォレットにアクセスできなくなります。
 */
export const buildFreshWallet = async (config: Config): Promise<Wallet & Resource> =>
  await buildWalletAndWaitForFunds(config, toHex(randomBytes(32)), '');

/**
 * Patient Registry用のプロバイダーを設定
 *
 * @param wallet - ウォレットインスタンス
 * @param config - Midnight設定
 * @returns Patient Registry用に設定されたプロバイダー群
 *
 * Patient Registryコントラクトとやり取りするために必要な
 * すべてのプロバイダーを設定します。
 *
 * プロバイダーの役割:
 * - privateStateProvider: プライベート状態の管理（LevelDB使用）
 * - publicDataProvider: Indexerから公開データを取得
 * - zkConfigProvider: ゼロ知識証明の設定（registerPatient, getRegistrationStats等）
 * - proofProvider: HTTPクライアント経由で証明を生成
 * - walletProvider: トランザクションの署名と送信
 * - midnightProvider: Midnightネットワークとの通信
 */
export const configurePatientRegistryProviders = async (
  wallet: Wallet & Resource,
  config: Config,
): Promise<PatientRegistryProviders> => {
  const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);
  const zkConfigProvider = new NodeZkConfigProvider<PatientRegistryCircuits>(patientRegistryConfig.zkConfigPath);
  
  return {
    privateStateProvider: levelPrivateStateProvider<typeof PatientRegistryPrivateStateId>({
      privateStateStoreName: patientRegistryConfig.privateStateStoreName,
      privateStoragePasswordProvider: async () => process.env.STORAGE_PASSWORD || "password123",
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};

export const configureConsentRegistryProviders = async (
  wallet: Wallet & Resource,
  config: Config,
): Promise<ConsentRegistryProviders> => {
  const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);
  const zkConfigProvider = new NodeZkConfigProvider<ConsentRegistryCircuits>(consentRegistryConfig.zkConfigPath);
  
  return {
    privateStateProvider: levelPrivateStateProvider<typeof ConsentRegistryPrivateStateId>({
      privateStateStoreName: consentRegistryConfig.privateStateStoreName,
      privateStoragePasswordProvider: async () => process.env.STORAGE_PASSWORD || "password123",
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};

export const configureIncentivePoolProviders = async (
  wallet: Wallet & Resource,
  config: Config,
): Promise<IncentivePoolProviders> => {
  const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);
  const zkConfigProvider = new NodeZkConfigProvider<IncentivePoolCircuits>(incentivePoolConfig.zkConfigPath);
  
  return {
    privateStateProvider: levelPrivateStateProvider<typeof IncentivePoolPrivateStateId>({
      privateStateStoreName: incentivePoolConfig.privateStateStoreName,
      privateStoragePasswordProvider: async () => process.env.STORAGE_PASSWORD || "password123",
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};

export const configureMedicalUploadVerifierProviders = async (
  wallet: Wallet & Resource,
  config: Config,
): Promise<MedicalUploadVerifierProviders> => {
  const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);
  const zkConfigProvider = new NodeZkConfigProvider<MedicalUploadVerifierCircuits>(medicalUploadVerifierConfig.zkConfigPath);
  
  return {
    privateStateProvider: levelPrivateStateProvider<typeof MedicalUploadVerifierPrivateStateId>({
      privateStateStoreName: medicalUploadVerifierConfig.privateStateStoreName,
      privateStoragePasswordProvider: async () => process.env.STORAGE_PASSWORD || "password123",
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};

export const configureZKDataMaskingProviders = async (
  wallet: Wallet & Resource,
  config: Config,
): Promise<ZKDataMaskingProviders> => {
  const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);
  const zkConfigProvider = new NodeZkConfigProvider<ZKDataMaskingCircuits>(zkDataMaskingConfig.zkConfigPath);
  
  return {
    privateStateProvider: levelPrivateStateProvider<typeof ZKDataMaskingPrivateStateId>({
      privateStateStoreName: zkDataMaskingConfig.privateStateStoreName,
      privateStoragePasswordProvider: async () => process.env.STORAGE_PASSWORD || "password123",
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};

export const configureViewingKeyManagerProviders = async (
  wallet: Wallet & Resource,
  config: Config,
): Promise<ViewingKeyManagerProviders> => {
  const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);
  const zkConfigProvider = new NodeZkConfigProvider<ViewingKeyManagerCircuits>(viewingKeyManagerConfig.zkConfigPath);
  
  return {
    privateStateProvider: levelPrivateStateProvider<typeof ViewingKeyManagerPrivateStateId>({
      privateStateStoreName: viewingKeyManagerConfig.privateStateStoreName,
      privateStoragePasswordProvider: async () => process.env.STORAGE_PASSWORD || "password123",
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};

export function setLogger(_logger: Logger) {
  logger = _logger;
}

/**
 * ストリームを文字列に変換
 *
 * @param stream - 読み込みストリーム
 * @returns ストリームの内容を文字列として返すPromise
 *
 * ファイルストリームから文字列を読み取ります。
 * ウォレット状態の復元時に使用されます。
 *
 * エラーが発生した場合はPromiseがrejectされます。
 */
export const streamToString = async (stream: fs.ReadStream): Promise<string> => {
  const chunks: Buffer[] = [];
  return await new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(typeof chunk === 'string' ? Buffer.from(chunk, 'utf8') : chunk));
    stream.on('error', (err) => {
      reject(err);
    });
    stream.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
  });
};

/**
 * チェーンがリセットされたかを確認
 *
 * @param wallet - ウォレットインスタンス
 * @param offset - 復元されたウォレットのオフセット
 * @returns チェーンがリセットされた場合true
 *
 * ウォレットを復元した際に、ブロックチェーンがリセットされていないか確認します。
 *
 * チェックロジック:
 * - 現在のウォレットオフセットが復元時のオフセットより2以上小さい場合、
 *   チェーンがリセットされたと判断します
 *
 * チェーンがリセットされている場合、ウォレットを新規作成する必要があります。
 *
 * 注意: ウォレットAPIはオフセットを直接公開していないため、
 * シリアライズされた状態から取得する回避策を使用しています。
 */
export const isAnotherChain = async (wallet: Wallet, offset: number) => {
  await waitForSyncProgress(wallet);
  // ウォレットは同期先のオフセットブロックを公開していないため、この回避策を使用
  const walletOffset = Number(JSON.parse(await wallet.serializeState()).offset);
  if (walletOffset < offset - 1) {
    logger.info(`Your offset offset is: ${walletOffset} restored offset: ${offset} so it is another chain`);
    return true;
  } else {
    logger.info(`Your offset offset is: ${walletOffset} restored offset: ${offset} ok`);
    return false;
  }
};

/**
 * ウォレット状態を保存
 *
 * @param wallet - ウォレットインスタンス
 * @param filename - 保存ファイル名
 *
 * ウォレットの現在の状態をファイルに保存します。
 * 次回起動時にこの状態から復元することで、同期時間を大幅に短縮できます。
 *
 * 保存先:
 * - SYNC_CACHE環境変数で指定されたディレクトリ
 * - 未指定の場合は保存されません
 *
 * 保存される情報:
 * - ウォレットの同期オフセット
 * - トランザクション履歴
 * - 残高情報
 * - その他の状態データ
 *
 * 注意: シード（秘密鍵）は保存されません。
 * 復元時には同じシードを提供する必要があります。
 */
export const saveState = async (wallet: Wallet, filename: string) => {
  const directoryPath = process.env.SYNC_CACHE;
  if (directoryPath !== undefined) {
    logger.info(`Saving state in ${directoryPath}/${filename}`);
    try {
      // ディレクトリが存在しない場合は作成
      await fsAsync.mkdir(directoryPath, { recursive: true });
      const serializedState = await wallet.serializeState();
      const writer = fs.createWriteStream(`${directoryPath}/${filename}`);
      writer.write(serializedState);

      writer.on('finish', function () {
        logger.info(`File '${directoryPath}/${filename}' written successfully.`);
      });

      writer.on('error', function (err) {
        logger.error(err);
      });
      writer.end();
    } catch (e) {
      if (typeof e === 'string') {
        logger.warn(e);
      } else if (e instanceof Error) {
        logger.warn(e.message);
      }
    }
  } else {
    logger.info('Not saving cache as sync cache was not defined');
  }
};
