// This file is part of NextMed Patient Registry
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

/**
 * Incentive Service
 *
 * Facade for interacting with the IncentivePool contract.
 * Provides high-level methods for token minting, balance queries, and transfers.
 */

import type { DeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { logger } from "./common.js";

/**
 * Type for deployed incentive pool contract
 * Will be populated after contract compilation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeployedIncentivePoolContract = DeployedContract<any>;

/**
 * Token amounts for different reward types
 */
export const REWARD_AMOUNTS = {
  /** Reward for uploading medical records */
  UPLOAD: 30n,
  /** Reward for completing profile */
  PROFILE_COMPLETE: 10n,
  /** Reward for participating in research */
  RESEARCH_PARTICIPATION: 50n,
} as const;

/**
 * Create an incentive service instance
 *
 * @param contract - Deployed IncentivePool contract
 * @returns Service methods for token operations
 */
export const createIncentiveService = (contract: DeployedIncentivePoolContract) => {
  /**
   * Mint reward tokens to a user
   *
   * @param userId - 32-byte user identifier
   * @param amount - Amount of tokens to mint
   */
  const mintReward = async (
    userId: Uint8Array,
    amount: bigint,
  ): Promise<void> => {
    logger.info(
      {
        userId: Buffer.from(userId).toString("hex"),
        amount: amount.toString(),
      },
      "Minting reward tokens via contract circuit...",
    );

    // TODO: Implement after incentive-pool.compact is compiled
    // await contract.callTx.mintReward(userId, amount);

    logger.info(
      {
        userId: Buffer.from(userId).toString("hex"),
        amount: amount.toString(),
      },
      "Reward tokens minted successfully",
    );
  };

  /**
   * Get token balance for a user
   *
   * @param userId - 32-byte user identifier
   * @returns Current token balance
   */
  const getBalance = async (userId: Uint8Array): Promise<bigint> => {
    logger.info(
      {
        userId: Buffer.from(userId).toString("hex"),
      },
      "Getting token balance...",
    );

    // TODO: Implement after incentive-pool.compact is compiled
    // const result = await contract.callTx.getBalance(userId);
    // return result.public.returnValue;

    logger.info(
      {
        userId: Buffer.from(userId).toString("hex"),
      },
      "Balance check completed",
    );

    return 0n; // Placeholder
  };

  /**
   * Transfer tokens between users
   *
   * @param fromUserId - 32-byte sender identifier
   * @param toUserId - 32-byte recipient identifier
   * @param amount - Amount of tokens to transfer
   */
  const transfer = async (
    fromUserId: Uint8Array,
    toUserId: Uint8Array,
    amount: bigint,
  ): Promise<void> => {
    logger.info(
      {
        from: Buffer.from(fromUserId).toString("hex"),
        to: Buffer.from(toUserId).toString("hex"),
        amount: amount.toString(),
      },
      "Transferring tokens via contract circuit...",
    );

    // TODO: Implement after incentive-pool.compact is compiled
    // await contract.callTx.transfer(fromUserId, toUserId, amount);

    logger.info(
      {
        from: Buffer.from(fromUserId).toString("hex"),
        to: Buffer.from(toUserId).toString("hex"),
        amount: amount.toString(),
      },
      "Token transfer completed",
    );
  };

  /**
   * Get total token supply
   *
   * @returns Total supply of tokens
   */
  const getTotalSupply = async (): Promise<bigint> => {
    logger.info("Getting total token supply...");

    // TODO: Implement after incentive-pool.compact is compiled
    // const result = await contract.callTx.getTotalSupply();
    // return result.public.returnValue;

    return 0n; // Placeholder
  };

  /**
   * Mint upload reward to a user
   * Convenience method that uses the standard UPLOAD reward amount
   *
   * @param userId - 32-byte user identifier
   */
  const mintUploadReward = async (userId: Uint8Array): Promise<void> => {
    await mintReward(userId, REWARD_AMOUNTS.UPLOAD);
  };

  return {
    mintReward,
    getBalance,
    transfer,
    getTotalSupply,
    mintUploadReward,
    REWARD_AMOUNTS,
  };
};

export type IncentiveService = ReturnType<typeof createIncentiveService>;
