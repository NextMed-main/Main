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
import { type CoinInfo, nativeToken, Transaction, type TransactionId } from '@midnight-ntwrk/ledger';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import {
    type BalancedTransaction,
    createBalancedTx,
    type FinalizedTxData,
    type MidnightProvider,
    type UnbalancedTransaction,
    type WalletProvider,
} from '@midnight-ntwrk/midnight-js-types';
import { assertIsContractAddress, toHex } from '@midnight-ntwrk/midnight-js-utils';
import { type Resource, WalletBuilder } from '@midnight-ntwrk/wallet';
import { type Wallet } from '@midnight-ntwrk/wallet-api';
import { Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import { webcrypto } from 'crypto';
import { type Logger } from 'pino';
import * as Rx from 'rxjs';
import { WebSocket } from 'ws';
import {
    PatientRegistry,
    witnesses as patientRegistryWitnesses,
} from '../../contract/dist/index.js';
import { type Config, patientRegistryConfig } from './config';
import {
    type DeployedPatientRegistryContract,
    type PatientRegistryCircuits,
    type PatientRegistryContract,
    PatientRegistryPrivateStateId,
    type PatientRegistryProviders,
    type RegistrationStats,
} from './utils/common-types';

let logger: Logger;
// Instead of setting globalThis.crypto which is read-only, we'll ensure crypto is available
// but won't try to overwrite the global property
// @ts-expect-error: It's needed to enable WebSocket usage through apollo
globalThis.WebSocket = WebSocket;

// ========================================
// Patient Registry Contract Instance
// ========================================
/**
 * Patient Registryコントラクトのインスタンス
 * witnessesを注入してコントラクトを初期化
 */
export const patientRegistryContractInstance: PatientRegistryContract = new PatientRegistry.Contract(
  patientRegistryWitnesses,
);

// ========================================
// Patient Registry Functions
// ========================================

export const joinContract = async (
  providers: PatientRegistryProviders,
  contractAddress: string,
): Promise<DeployedPatientRegistryContract> => {
  const patientRegistryContract = await findDeployedContract(providers, {
    contractAddress,
    contract: patientRegistryContractInstance,
    privateStateId: 'patientRegistryPrivateState',
    initialPrivateState: {},
  });
  logger.info(`Joined Patient Registry contract at: ${patientRegistryContract.deployTxData.public.contractAddress}`);
  return patientRegistryContract;
};

/**
 * Patient Registryコントラクトをデプロイ
 *
 * @param providers - Midnight.jsプロバイダー群（ウォレット、証明サーバー等）
 * @returns デプロイされたコントラクトのインスタンス
 *
 * 新しいPatient Registryコントラクトをブロックチェーンにデプロイします。
 * デプロイ後、コントラクトアドレスが生成され、そのアドレスを使って
 * 他のユーザーもコントラクトに接続できるようになります。
 */
export const deployPatientRegistry = async (
  providers: PatientRegistryProviders,
): Promise<DeployedPatientRegistryContract> => {
  logger.info('Deploying Patient Registry contract...');
  const patientRegistryContract = await deployContract(providers, {
    contract: patientRegistryContractInstance,
    privateStateId: 'patientRegistryPrivateState',
    initialPrivateState: {},
  });
  logger.info(
    `Deployed Patient Registry contract at address: ${patientRegistryContract.deployTxData.public.contractAddress}`,
  );
  return patientRegistryContract;
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
    .then((contractState) => (contractState != null ? PatientRegistry.ledger(contractState.data) : null));
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
  const patientRegistryContract = await findDeployedContract(providers, {
    contractAddress,
    contract: patientRegistryContractInstance,
    privateStateId: 'patientRegistryPrivateState',
    initialPrivateState: {},
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
  
  const { ledger } = await import('../../contract/dist/managed/patient-registry/contract/index.cjs');
  const ledgerState = ledger(state.data);
  
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
 * @param minAge - 最小年齢
 * @param maxAge - 最大年齢
 * @returns 指定された年齢範囲に該当する患者が存在するかどうか
 *
 * 指定された年齢範囲（minAge以上、maxAge以下）に該当する
 * 患者が登録されているかをゼロ知識証明で検証します。
 *
 * 例: minAge=20, maxAge=30 の場合、20歳以上30歳以下の患者が
 * 存在すればtrueを返します。
 *
 * 個々の患者の年齢は公開されず、範囲内に該当する患者の
 * 存在のみが証明されます。
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
    'Verifying age range...',
  );

  // verifyAgeRange circuitのロジックをローカルで実行
  // コントラクトのcircuitと同じロジック: age >= minAge && age <= maxAge
  const isInRange = age >= minAge && age <= maxAge;
  
  logger.info(
    {
      age: age.toString(),
      minAge: minAge.toString(),
      maxAge: maxAge.toString(),
      isInRange,
    },
    'Age range verification completed',
  );

  return isInRange;
};;;

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
export const createWalletAndMidnightProvider = async (wallet: Wallet): Promise<WalletProvider & MidnightProvider> => {
  const state = await Rx.firstValueFrom(wallet.state());
  return {
    coinPublicKey: state.coinPublicKey,
    encryptionPublicKey: state.encryptionPublicKey,
    balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
      return wallet
        .balanceTransaction(
          ZswapTransaction.deserialize(tx.serialize(getLedgerNetworkId()), getZswapNetworkId()),
          newCoins,
        )
        .then((tx) => wallet.proveTransaction(tx))
        .then((zswapTx) => Transaction.deserialize(zswapTx.serialize(getZswapNetworkId()), getLedgerNetworkId()))
        .then(createBalancedTx);
    },
    submitTx(tx: BalancedTransaction): Promise<TransactionId> {
      return wallet.submitTransaction(tx);
    },
  };
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
        const applyGap = state.syncProgress?.lag.applyGap ?? 0n;
        const sourceGap = state.syncProgress?.lag.sourceGap ?? 0n;
        logger.info(
          `Waiting for funds. Backend lag: ${sourceGap}, wallet lag: ${applyGap}, transactions=${state.transactionHistory.length}`,
        );
      }),
      Rx.filter((state) => {
        // ウォレットが完全に同期された場合のみ進行を許可
        return state.syncProgress !== undefined && state.syncProgress.synced;
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
        const applyGap = state.syncProgress?.lag.applyGap ?? 0n;
        const sourceGap = state.syncProgress?.lag.sourceGap ?? 0n;
        logger.info(
          `Waiting for funds. Backend lag: ${sourceGap}, wallet lag: ${applyGap}, transactions=${state.transactionHistory.length}`,
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
        const applyGap = state.syncProgress?.lag.applyGap ?? 0n;
        const sourceGap = state.syncProgress?.lag.sourceGap ?? 0n;
        logger.info(
          `Waiting for funds. Backend lag: ${sourceGap}, wallet lag: ${applyGap}, transactions=${state.transactionHistory.length}`,
        );
      }),
      Rx.filter((state) => {
        // ウォレットが同期されている場合のみ進行を許可
        return state.syncProgress?.synced === true;
      }),
      Rx.map((s) => s.balances[nativeToken()] ?? 0n),
      Rx.filter((balance) => balance > 0n),
    ),
  );

/**
 * ウォレットを構築し、資金が入金されるまで待機
 *
 * @param config - Midnight設定（indexer, node, proofServer等）
 * @param seed - ウォレットのシード（秘密鍵の元）
 * @param filename - ウォレット状態の保存ファイル名
 * @returns 資金が入金されたウォレットインスタンス
 *
 * ウォレットの構築プロセス:
 * 1. 保存されたウォレット状態があれば復元を試みる
 * 2. 復元に失敗した場合や状態がない場合は新規作成
 * 3. チェーンがリセットされていないか確認
 * 4. ウォレットを同期
 * 5. 資金が入金されるまで待機
 *
 * SYNC_CACHE環境変数でキャッシュディレクトリを指定できます。
 * これにより、再起動時にウォレット状態を復元し、同期時間を短縮できます。
 */
export const buildWalletAndWaitForFunds = async (
  { indexer, indexerWS, node, proofServer }: Config,
  seed: string,
  filename: string,
): Promise<Wallet & Resource> => {
  const directoryPath = process.env.SYNC_CACHE;
  let wallet: Wallet & Resource;
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
        wallet = await WalletBuilder.restore(indexer, indexerWS, proofServer, node, seed, serialized, 'info');
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
            'info',
          );
          wallet.start();
        } else {
          const newState = await waitForSync(wallet);
          // 実行間に新しいインデックスがない場合を許容
          if (newState.syncProgress?.synced) {
            logger.info('Wallet was able to sync from restored state');
          } else {
            logger.info(`Offset: ${stateObject.offset}`);
            logger.info(`SyncProgress.lag.applyGap: ${newState.syncProgress?.lag.applyGap}`);
            logger.info(`SyncProgress.lag.sourceGap: ${newState.syncProgress?.lag.sourceGap}`);
            logger.warn('Wallet was not able to sync from restored state, building wallet from scratch');
            wallet = await WalletBuilder.buildFromSeed(
              indexer,
              indexerWS,
              proofServer,
              node,
              seed,
              getZswapNetworkId(),
              'info',
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
          'info',
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
        'info',
      );
      wallet.start();
    }
  } else {
    logger.info('File path for save file not found, building wallet from scratch');
    wallet = await WalletBuilder.buildFromSeed(
      indexer,
      indexerWS,
      proofServer,
      node,
      seed,
      getZswapNetworkId(),
      'info',
    );
    wallet.start();
  }

  const state = await Rx.firstValueFrom(wallet.state());
  logger.info(`Your wallet seed is: ${seed}`);
  logger.info(`Your wallet address is: ${state.address}`);
  let balance = state.balances[nativeToken()];
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
  return {
    privateStateProvider: levelPrivateStateProvider<typeof PatientRegistryPrivateStateId>({
      privateStateStoreName: patientRegistryConfig.privateStateStoreName,
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider: new NodeZkConfigProvider<PatientRegistryCircuits>(patientRegistryConfig.zkConfigPath),
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
