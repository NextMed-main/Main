// This file is part of NextMed Patient Registry CLI
// Copyright (C) 2025 NextMed Team
// SPDX-License-Identifier: Apache-2.0

import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import path from "node:path";

export const currentDir = path.resolve(new URL(import.meta.url).pathname, "..");

export const contractConfig = {
  privateStateStoreName: "patient-registry-private-state",
  zkConfigPath: path.resolve(
    currentDir,
    "..",
    "..",
    "contract",
    "src",
    "managed",
    "patient-registry",
  ),
};

export const patientRegistryConfig = {
  privateStateStoreName: "patient-registry-private-state",
  zkConfigPath: path.resolve(
    currentDir,
    "..",
    "..",
    "contract",
    "src",
    "managed",
    "patient-registry",
  ),
};

export const consentRegistryConfig = {
  privateStateStoreName: "consent-registry-private-state",
  zkConfigPath: path.resolve(
    currentDir,
    "..",
    "..",
    "contract",
    "src",
    "managed",
    "consent-registry",
  ),
};

export const incentivePoolConfig = {
  privateStateStoreName: "incentive-pool-private-state",
  zkConfigPath: path.resolve(
    currentDir,
    "..",
    "..",
    "contract",
    "src",
    "managed",
    "incentive-pool",
  ),
};

export const medicalUploadVerifierConfig = {
  privateStateStoreName: "medical-upload-verifier-private-state",
  zkConfigPath: path.resolve(
    currentDir,
    "..",
    "..",
    "contract",
    "src",
    "managed",
    "medical-upload-verifier",
  ),
};

export const zkDataMaskingConfig = {
  privateStateStoreName: "zk-data-masking-private-state",
  zkConfigPath: path.resolve(
    currentDir,
    "..",
    "..",
    "contract",
    "src",
    "managed",
    "zk-data-masking",
  ),
};

export const viewingKeyManagerConfig = {
  privateStateStoreName: "viewing-key-manager-private-state",
  zkConfigPath: path.resolve(
    currentDir,
    "..",
    "..",
    "contract",
    "src",
    "managed",
    "viewing-key-manager",
  ),
};

export interface Config {
  readonly logDir: string;
  readonly indexer: string;
  readonly indexerWS: string;
  readonly node: string;
  readonly proofServer: string;
  readonly networkId: string;
}

export class TestnetLocalConfig implements Config {
  logDir = path.resolve(
    currentDir,
    "..",
    "logs",
    "testnet-local",
    `${new Date().toISOString()}.log`,
  );
  indexer = "http://127.0.0.1:8088/api/v1/graphql";
  indexerWS = "ws://127.0.0.1:8088/api/v1/graphql/ws";
  node = "http://127.0.0.1:9944";
  proofServer = "http://127.0.0.1:6300";
  networkId = "testnet-02";
  constructor() {
    setNetworkId(this.networkId);
  }
}

export class StandaloneConfig implements Config {
  logDir = path.resolve(
    currentDir,
    "..",
    "logs",
    "standalone",
    `${new Date().toISOString()}.log`,
  );
  indexer = "http://127.0.0.1:8088/api/v1/graphql";
  indexerWS = "ws://127.0.0.1:8088/api/v1/graphql/ws";
  node = "http://127.0.0.1:9944";
  proofServer = "http://127.0.0.1:6300";
  networkId = "undeployed";
  constructor() {
    setNetworkId(this.networkId);
  }
}

export class TestnetRemoteConfig implements Config {
  logDir = path.resolve(
    currentDir,
    "..",
    "logs",
    "testnet-remote",
    `${new Date().toISOString()}.log`,
  );
  indexer = "https://indexer.testnet-02.midnight.network/api/v1/graphql";
  indexerWS = "wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws";
  node = "https://rpc.testnet-02.midnight.network";
  proofServer = "http://127.0.0.1:6300";
  networkId = "testnet-02";
  constructor() {
    setNetworkId(this.networkId);
  }
}

export class PreviewNetConfig implements Config {
  logDir = path.resolve(
    currentDir,
    "..",
    "logs",
    "preview",
    `${new Date().toISOString()}.log`,
  );
  // Preview network endpoints (v3.0.0 SDK)
  indexer = "https://indexer.preview.midnight.network/api/v3/graphql";
  indexerWS = "wss://indexer.preview.midnight.network/api/v3/graphql/ws";
  node = "https://rpc.preview.midnight.network";
  proofServer = process.env.PROOF_SERVER_URL || "https://lace-proof-pub.preview.midnight.network";
  networkId = "preview";
  constructor() {
    setNetworkId(this.networkId);
  }
}
