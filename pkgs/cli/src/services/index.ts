// This file is part of NextMed Patient Registry
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

/**
 * Services Module Index
 *
 * Re-exports all service facades for easy import
 */

export { createConsentService, type ConsentService, type DeployedConsentRegistryContract } from "./consent-service.js";
export { createIncentiveService, type IncentiveService, type DeployedIncentivePoolContract, REWARD_AMOUNTS } from "./incentive-service.js";
export { logger, toHex, fromHex, createUserId } from "./common.js";
