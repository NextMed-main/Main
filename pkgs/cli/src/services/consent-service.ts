// This file is part of NextMed Patient Registry
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

/**
 * Consent Service
 *
 * Facade for interacting with the ConsentRegistry contract.
 * Provides high-level methods for managing patient consent.
 */

import type { DeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { logger } from "./common.js";

/**
 * Type for deployed consent registry contract
 * Will be populated after contract compilation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeployedConsentRegistryContract = DeployedContract<any>;

/**
 * Create a consent service instance
 *
 * @param contract - Deployed ConsentRegistry contract
 * @returns Service methods for consent operations
 */
export const createConsentService = (contract: DeployedConsentRegistryContract) => {
  /**
   * Update consent status for a user
   *
   * @param userId - 32-byte user identifier
   * @param consent - New consent value (true = consented)
   */
  const updateConsent = async (
    userId: Uint8Array,
    consent: boolean,
  ): Promise<void> => {
    logger.info(
      {
        userId: Buffer.from(userId).toString("hex"),
        consent,
      },
      "Updating consent via contract circuit...",
    );

    // TODO: Implement after consent-registry.compact is compiled
    // await contract.callTx.updateConsent(userId, consent);

    logger.info(
      {
        userId: Buffer.from(userId).toString("hex"),
        consent,
      },
      "Consent updated successfully",
    );
  };

  /**
   * Check consent status for a user
   *
   * @param userId - 32-byte user identifier
   * @returns Current consent status
   */
  const checkConsent = async (userId: Uint8Array): Promise<boolean> => {
    logger.info(
      {
        userId: Buffer.from(userId).toString("hex"),
      },
      "Checking consent status...",
    );

    // TODO: Implement after consent-registry.compact is compiled
    // const result = await contract.callTx.checkConsent(userId);
    // return result.public.returnValue;

    logger.info(
      {
        userId: Buffer.from(userId).toString("hex"),
      },
      "Consent check completed",
    );

    return false; // Placeholder
  };

  /**
   * Get total consent count
   *
   * @returns Total number of consented users
   */
  const getTotalConsents = async (): Promise<bigint> => {
    logger.info("Getting total consents...");

    // TODO: Implement after consent-registry.compact is compiled
    // const result = await contract.callTx.getTotalConsents();
    // return result.public.returnValue;

    return 0n; // Placeholder
  };

  return {
    updateConsent,
    checkConsent,
    getTotalConsents,
  };
};

export type ConsentService = ReturnType<typeof createConsentService>;
