// This file is part of NextMed Patient Registry
// Copyright (C) 2026 NextMed Team
// SPDX-License-Identifier: Apache-2.0

/**
 * Common utilities for services
 */

import pino, { type Logger } from "pino";

/**
 * Shared logger instance for services
 */
export const logger: Logger = pino({
  name: "nextmed-services",
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

/**
 * Convert Uint8Array to hex string
 */
export const toHex = (bytes: Uint8Array): string => {
  return Buffer.from(bytes).toString("hex");
};

/**
 * Convert hex string to Uint8Array
 */
export const fromHex = (hex: string): Uint8Array => {
  return new Uint8Array(Buffer.from(hex, "hex"));
};

/**
 * Create a 32-byte user ID from a string
 */
export const createUserId = (input: string): Uint8Array => {
  const hash = Buffer.from(input).toString("hex").padStart(64, "0").slice(0, 64);
  return fromHex(hash);
};
