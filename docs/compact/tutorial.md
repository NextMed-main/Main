---
title: Installation
description: Get your Midnight development environment running to set up tools, configure wallets, and deploy your first zero-knowledge application.
sidebar_position: 1
sidebar_label: Installation
tags: [getting-started, setup, development, builder, ZK]
slug: /getting-started/installation
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Step, { StepsProvider } from '@site/src/components/Step/Step';

Get started with Midnight, whether you are here to use privacy-preserving applications or to build them. The installation process includes setting up the Lace wallet, obtaining test tokens, and configuring the development environment.

## Prerequisites

Before you begin, ensure you have:

- Google Chrome browser installed
- Basic familiarity with command-line operations
- Administrative privileges on your computer (for installing Docker and Compact)

## Install the Lace Midnight Preview wallet

### 1. Download and install the Lace wallet extension

Lace Midnight Preview wallet is a browser extension wallet for the Midnight network. It is currently only compatible with Google Chrome.

<StepsProvider>
    <Step>Open the Google Chrome browser.</Step>
    <Step>Install the Lace wallet extension from the Chrome Web Store: [https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg).</Step>
    <Step>Click **Add to Chrome** and confirm by clicking **Add extension**.</Step>
    <Step>Pin the extension to your toolbar for easy access (recommended).</Step>
</StepsProvider>

**Verification**: The Lace wallet icon appears in your Chrome toolbar.

### 2. Create your wallet

Your wallet is protected by a seed phrase, which acts as your master key. Keep it secret and safe.

<StepsProvider>
    <Step>Click the Lace wallet icon in your toolbar.</Step>
    <Step>Select **Create a new wallet**.</Step>
    <Step>Choose a strong password.</Step>
    <Step>**Crucially**: Write down your seed phrase on paper and store it in a secure, offline location. Never store it digitally or share it.</Step>
    <Step>Confirm your seed phrase to complete the setup.</Step>
</StepsProvider>

**Verification**: Your wallet dashboard opens, showing a `0` tDUST balance.

### 3. Get test tokens (tDUST)

tDUST is the token used on the Midnight Testnet. It has no real-world value and is used for testing transactions and interacting with applications.

<StepsProvider>
    <Step>In your Lace wallet, click **Receive** and copy your wallet address.</Step>
    <Step>Go to the Testnet Faucet: [https://midnight.network/test-faucet/](https://midnight.network/test-faucet/).</Step>
    <Step>Paste your address into the form and click **Request tDUST**.</Step>
    <Step>Wait a few minutes for the tokens to arrive.</Step>
</StepsProvider>

**Verification**: Your Lace wallet shows a new balance of tDUST tokens.

You are now ready to interact with DApps. To start building on Midnight, continue with these additional setup steps for the development environment.

## Install Compact

### 4. Install Compact using the installer script

[Compact](https://github.com/midnightntwrk/compact) is Midnight's dedicated smart contract language for creating applications (DApps) that allow developers to express the amount of data protection that works for them.

Use the following command to install the pre-built binaries:

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/download/compact-v0.2.0/compact-installer.sh | sh
```

### 5. Update your shell PATH

Make sure the Compact binary is in your shell's `PATH` to run it from any directory. Your shell needs to be updated after installation.

### 6. Verify the Compact installation

<StepsProvider>
    <Step>Run `compact --version` to print version of Compact.</Step>
    <Step>Run `which compact` to print installation path.</Step>
</StepsProvider>

```bash
compact --version # print version of Compact
which compact     # print installation path
```

**Verification**: These commands return the Compact version number and installation path.

## Set up the proof server

### 7. Install Docker Desktop

The proof server is required to generate zero-knowledge proofs for transactions locally. It runs as a background service using Docker.

If you don't have Docker, download and install Docker for your operating system (macOS, Windows, or Linux):

- Get Docker here: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

### 8. Run the proof server

Use the following command to start the proof-server in your terminal:

```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

This command occupies the terminal window while running.

**Verification**: The terminal displays logs indicating the server is running and listening at http://localhost:6300.

:::note
To use a local proof-server with Lace Midnight Preview wallet, go to **Settings** > **Midnight** and select `Local (http://localhost:6300)`.
:::

## Install Compact VS Code extension

### 9. Download the Compact VS Code extension

The Compact VS Code extension provides helpful syntax highlighting and code snippets.

<StepsProvider>
    <Step>Download the VSIX package from the [Compact VS Code extension release page](/relnotes/vs-code-extension).</Step>
    <Step>In VS Code go to **Extensions**, then **Install from VSIX** and select the extension file.</Step>
</StepsProvider>

**Verification**: You now see Compact Language Support extension in your installed VS Code extensions.

Your development environment is now configured. You are ready to start building privacy-preserving applications on Midnight.

---

title: Create an MN app
description: Get started using Midnight applications. Set up your wallet, get tokens, and start using privacy-preserving DApps.
sidebar_position: 2
sidebar_label: Create an MN App
tags: [getting-started, setup, user, wallet, ZK]
slug: /getting-started/create-mn-app
toc_max_heading_level: 2

---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Step, { StepsProvider } from "@site/src/components/Step/Step";

# Create a Midnight Network app

A Midnight Network (MN) app is a privacy-preserving DApp that uses zero-knowledge proofs (ZKPs) to maintain data confidentiality. The core value proposition is selective disclosure, which allows users to prove specific information while keeping other sensitive data private.

## Prerequisites

The following software and tools are required:

- **Node.js**: Version 20.x or higher. Install Node.js using [NVM](https://github.com/nvm-sh/nvm).
  ```bash
  nvm install 20
  ```
- **Command-line knowledge**: Basic familiarity with terminal operations.
- **Code editor**: An IDE such as [Visual Studio Code](https://code.visualstudio.com).

## Create a project

<StepsProvider>
<Step>

**Initialize the project.** Create a project folder, navigate to the folder, and initialize an npm project. The `-y` flag accepts all default settings.

```bash
mkdir my-mn-app
cd my-mn-app
npm init -y
```

</Step>
<Step>

**Create the required directories.** The project requires separate folders for smart contracts and application source code.

```bash
mkdir src contracts
```

The project structure now appears as follows:

```bash
my-mn-app/
├── contracts/
├── src/
└── package.json
```

</Step>
<Step>

**Create the contract file.** Create a file named `hello-world.compact` in the contracts directory.

```bash
touch contracts/hello-world.compact
```

</Step>
</StepsProvider>

## Add the pragma version directive

Every Compact smart contract begins with a `pragma` directive. This directive declares the compiler version with which the contract is compatible, ensuring predictable behavior and preventing issues with future compiler updates. A fixed version (`pragma language_version = 0.16;`) or a compatible range can be specified. A range provides flexibility by allowing minor updates and bug fixes.

<StepsProvider start={4}>
<Step>

**Add the pragma directive.** Add the following line to the top of `contracts/hello-world.compact`. This directive allows versions from `0.16` through `0.17`.

```compact
pragma language_version >= 0.16 && <= 0.17;
```

</Step>
</StepsProvider>

## Import the Compact Standard Library

An `import` statement for the Compact Standard Library is required to access built-in types and functions that are essential for contract development.

<StepsProvider start={5}>
<Step>

**Add the import statement.** Add the import statement on the next line of the contract.

```compact
pragma language_version >= 0.16 && <= 0.17;

import CompactStandardLibrary;
```

</Step>
</StepsProvider>

## Define the ledger declaration

The `ledger` section defines the on-chain state variables for a contract. This section functions as a schema for data stored permanently on the blockchain. Variables can be marked with `export` to make them accessible from a dApp.

**Syntax:**

```compact
ledger <identifier>: <type>;
export ledger <identifier>: <type>;
```

This contract uses the `Opaque<"string">` type, which stores variable-length strings while preserving privacy.

<StepsProvider start={6}>
<Step>

**Create the ledger declaration.** This line reserves on-chain storage for a string variable named `message`.

```compact
pragma language_version >= 0.16 && <= 0.17;

import CompactStandardLibrary;

export ledger message: Opaque<"string">;
```

</Step>
</StepsProvider>

## Define the circuit

Circuits are the functions of a Compact smart contract and are compiled directly into a zero-knowledge circuit. Circuits can accept parameters, perform computations, and modify the contract state. Circuits marked with `export` can be called from external applications.

**Syntax:**

```compact
circuit <function>([parameters]): [return_type] { logic }
export circuit <function>([parameters]): [return_type] { logic }
```

<StepsProvider start={7}>
<Step>

**Define the storeMessage circuit.** This circuit accepts a custom message as input and stores the message in the `message` state variable.

```compact
export circuit storeMessage(customMessage: Opaque<"string">): [] {
    message = disclose(customMessage);
}
```

:::info Why disclose() is required
Compact enforces privacy by default. All user input is considered private unless explicitly made public. The `disclose()` function indicates that the message is intentionally visible on the public ledger.
:::

</Step>
</StepsProvider>

The complete `hello-world.compact` contract appears as follows:

```compact
pragma language_version >= 0.16 && <= 0.17;

import CompactStandardLibrary;

export ledger message: Opaque<"string">;

export circuit storeMessage(customMessage: Opaque<"string">): [] {
    message = disclose(customMessage);
}
```

## Compile the smart contract

Compiling a Compact contract transforms the high-level logic into zero-knowledge circuits, generates cryptographic keys, and creates TypeScript APIs for the dApp frontend. This process enforces Midnight's privacy and security guarantees.

<StepsProvider start={8}>
<Step>

**Compile the contract.** Run the following command from the project root directory.

```bash
compact compile contracts/hello-world.compact contracts/managed/hello-world
```

This command generates the necessary artifacts in the `contracts/managed/hello-world` directory. The generated structure appears as follows:

```
contracts/
└── managed
    └── hello-world
        ├── compiler
        ├── contract
        ├── keys
        └── zkir
```

- `contract/`: Contains the compiled contract artifacts, including JSON files required for deployment and frontend integration.
- `keys/`: Stores the cryptographic proving and verifying keys for the zero-knowledge proofs.
- `zkir/`: Contains the Zero-Knowledge Intermediate Representation of the circuit, which bridges the Compact code to the ZK backend.
- `compiler/`: Holds intermediate files used by the compiler during the build process.

</Step>
</StepsProvider>

---

title: Deploy Hello World contract
description: Deploy a compiled Hello World smart contract to Midnight Testnet.
sidebar_position: 3
sidebar_label: Deploy an MN app
tags: [deployment, testnet, smart-contract, tutorial]
slug: /getting-started/deploy-hello-world
toc_max_heading_level: 2

---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Step, { StepsProvider } from "@site/src/components/Step/Step";

# Deploy a Hello World contract

Continue from the Hello World contract creation, deploy the contract to Midnight Testnet, and establish your MN app on-chain.

## Prerequisites

The following is required:

- A [`contracts/hello-world.compact`](create-mn-app) file
- Compiled contract artifacts in `contracts/managed/hello-world/`
- A basic `package.json` and project structure

## Update project for deployment

Replace existing `package.json` with this complete version that includes all deployment dependencies and scripts:

```json
{
  "name": "my-mn-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "compile": "compact compile contracts/hello-world.compact contracts/managed/hello-world",
    "build": "tsc",
    "deploy": "node dist/deploy.js"
  },
  "dependencies": {
    "@midnight-ntwrk/compact-runtime": "^0.8.1",
    "@midnight-ntwrk/ledger": "^4.0.0",
    "@midnight-ntwrk/midnight-js-contracts": "2.0.2",
    "@midnight-ntwrk/midnight-js-http-client-proof-provider": "2.0.2",
    "@midnight-ntwrk/midnight-js-indexer-public-data-provider": "2.0.2",
    "@midnight-ntwrk/midnight-js-level-private-state-provider": "2.0.2",
    "@midnight-ntwrk/midnight-js-node-zk-config-provider": "2.0.2",
    "@midnight-ntwrk/midnight-js-network-id": "2.0.2",
    "@midnight-ntwrk/midnight-js-types": "2.0.2",
    "@midnight-ntwrk/wallet": "5.0.0",
    "@midnight-ntwrk/wallet-api": "5.0.0",
    "@midnight-ntwrk/zswap": "^4.0.0",
    "ws": "^8.18.3"
  },
  "devDependencies": {
    "@types/node": "^24.4.0",
    "@types/ws": "^8.5.10",
    "typescript": "^5.9.2"
  }
}
```

Install dependencies:

```bash
npm install
```

## Build deployment script

<StepsProvider>
<Step>

**Create a TypeScript configuration file to define compilation settings.** This file tells TypeScript how to compile the project into JavaScript.

```bash
touch tsconfig.json
```

Add configuration to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

</Step>
<Step>

**Create a source directory and deployment script file.** These form the foundation for the deployment code.

```bash
mkdir src
touch src/deploy.ts
```

</Step>
<Step>

**Add import statements to access required libraries.** These modules provide wallet management, contract deployment, and network connectivity functions.

Add to `src/deploy.ts`:

```typescript
import { WalletBuilder } from "@midnight-ntwrk/wallet";
import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import {
  NetworkId,
  setNetworkId,
  getZswapNetworkId,
  getLedgerNetworkId,
} from "@midnight-ntwrk/midnight-js-network-id";
import { createBalancedTx } from "@midnight-ntwrk/midnight-js-types";
import { nativeToken, Transaction } from "@midnight-ntwrk/ledger";
import { Transaction as ZswapTransaction } from "@midnight-ntwrk/zswap";
import { WebSocket } from "ws";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline/promises";
import * as Rx from "rxjs";
import { type Wallet } from "@midnight-ntwrk/wallet-api";
```

</Step>
<Step>

**Configure network settings and define helper functions.** This establishes connection to Midnight Testnet and creates a function to monitor wallet funding.

```typescript
// Fix WebSocket for Node.js environment
// @ts-ignore
globalThis.WebSocket = WebSocket;

// Configure for Midnight Testnet
setNetworkId(NetworkId.TestNet);

// Testnet connection endpoints
const TESTNET_CONFIG = {
  indexer: "https://indexer.testnet-02.midnight.network/api/v1/graphql",
  indexerWS: "wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws",
  node: "https://rpc.testnet-02.midnight.network",
  proofServer: "http://127.0.0.1:6300",
};

const waitForFunds = (wallet: Wallet) =>
  Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.tap((state) => {
        if (state.syncProgress) {
          console.log(
            `Sync progress: synced=${state.syncProgress.synced}, sourceGap=${state.syncProgress.lag.sourceGap}, applyGap=${state.syncProgress.lag.applyGap}`
          );
        }
      }),
      Rx.filter((state) => state.syncProgress?.synced === true),
      Rx.map((s) => s.balances[nativeToken()] ?? 0n),
      Rx.filter((balance) => balance > 0n),
      Rx.tap((balance) => console.log(`Wallet funded with balance: ${balance}`))
    )
  );
```

</Step>
<Step>

**Create a main function to orchestrate the deployment process.** This function handles user input for wallet seed generation or recovery.

```typescript
async function main() {
  console.log("Midnight Hello World Deployment\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // Ask user if they have an existing wallet seed
    const choice = await rl.question("Do you have a wallet seed? (y/n): ");

    let walletSeed: string;
    if (choice.toLowerCase() === "y" || choice.toLowerCase() === "yes") {
      // Use existing seed
      walletSeed = await rl.question("Enter your 64-character seed: ");
    } else {
      // Generate new wallet seed
      const bytes = new Uint8Array(32);
      // @ts-ignore
      crypto.getRandomValues(bytes);
      walletSeed = Array.from(bytes, (b) =>
        b.toString(16).padStart(2, "0")
      ).join("");
      console.log(`\nSAVE THIS SEED: ${walletSeed}\n`);
    }

    // Rest of deployment logic follows...
  } catch (error) {
    console.error("Failed:", error);
  } finally {
    rl.close();
  }
}
```

</Step>
<Step>

**Build a wallet from the seed and check funding status.** This step creates a wallet instance and waits for funds if necessary.

Add inside `try` block after seed generation:

```typescript
// Build wallet from seed
console.log("Building wallet...");
const wallet = await WalletBuilder.buildFromSeed(
  TESTNET_CONFIG.indexer,
  TESTNET_CONFIG.indexerWS,
  TESTNET_CONFIG.proofServer,
  TESTNET_CONFIG.node,
  walletSeed,
  getZswapNetworkId(),
  "info"
);

wallet.start();
const state = await Rx.firstValueFrom(wallet.state());

console.log(`Your wallet address is: ${state.address}`);

let balance = state.balances[nativeToken()] || 0n;

if (balance === 0n) {
  console.log(`Your wallet balance is: 0`);
  console.log("Visit: https://midnight.network/test-faucet to get some funds.");
  console.log(`Waiting to receive tokens...`);
  balance = await waitForFunds(wallet);
}

console.log(`Balance: ${balance}`);
```

</Step>
<Step>

**Load the compiled contract module from disk.** This imports the compiled contract artifacts needed for deployment.

```typescript
// Load compiled contract files
console.log("Loading contract...");
const contractPath = path.join(process.cwd(), "contracts");
const contractModulePath = path.join(
  contractPath,
  "managed",
  "hello-world",
  "contract",
  "index.cjs"
);

if (!fs.existsSync(contractModulePath)) {
  console.error("Contract not found! Run: npm run compile");
  process.exit(1);
}

const HelloWorldModule = await import(contractModulePath);
const contractInstance = new HelloWorldModule.Contract({});
```

</Step>
<Step>

**Create a wallet provider for transaction management.** This provider handles transaction signing and submission to the network.

```typescript
// Create wallet provider for transactions
const walletState = await Rx.firstValueFrom(wallet.state());

const walletProvider = {
  coinPublicKey: walletState.coinPublicKey,
  encryptionPublicKey: walletState.encryptionPublicKey,
  balanceTx(tx: any, newCoins: any) {
    return wallet
      .balanceTransaction(
        ZswapTransaction.deserialize(
          tx.serialize(getLedgerNetworkId()),
          getZswapNetworkId()
        ),
        newCoins
      )
      .then((tx) => wallet.proveTransaction(tx))
      .then((zswapTx) =>
        Transaction.deserialize(
          zswapTx.serialize(getZswapNetworkId()),
          getLedgerNetworkId()
        )
      )
      .then(createBalancedTx);
  },
  submitTx(tx: any) {
    return wallet.submitTransaction(tx);
  },
};
```

</Step>
<Step>

**Configure all required providers for contract deployment.** These providers handle state management, data fetching, proof generation, and wallet interaction.

```typescript
// Configure all required providers
console.log("Setting up providers...");
const zkConfigPath = path.join(contractPath, "managed", "hello-world");
const providers = {
  privateStateProvider: levelPrivateStateProvider({
    privateStateStoreName: "hello-world-state",
  }),
  publicDataProvider: indexerPublicDataProvider(
    TESTNET_CONFIG.indexer,
    TESTNET_CONFIG.indexerWS
  ),
  zkConfigProvider: new NodeZkConfigProvider(zkConfigPath),
  proofProvider: httpClientProofProvider(TESTNET_CONFIG.proofServer),
  walletProvider: walletProvider,
  midnightProvider: walletProvider,
};
```

</Step>
<Step>

**Deploy the contract to the blockchain and save deployment information.** This executes the deployment transaction and stores the contract address for future use.

```typescript
// Deploy contract to blockchain
console.log("Deploying contract (30-60 seconds)...");

const deployed = await deployContract(providers, {
  contract: contractInstance,
  privateStateId: "helloWorldState",
  initialPrivateState: {},
});

const contractAddress = deployed.deployTxData.public.contractAddress;

// Save deployment information
console.log("\nDEPLOYED!");
console.log(`Contract: ${contractAddress}\n`);

const info = {
  contractAddress,
  deployedAt: new Date().toISOString(),
};

fs.writeFileSync("deployment.json", JSON.stringify(info, null, 2));
console.log("Saved to deployment.json");

// Close wallet connection
await wallet.close();
```

</Step>
<Step>

**Add the main function call to initialize the script.** This line at the end of the file starts the deployment process when the script runs.

```typescript
main().catch(console.error);
```

</Step>
<Step>

**Start the proof server in a new terminal window.** This Docker container generates zero-knowledge proofs required for deployment.

Open a new terminal and run:

```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

Keep this terminal open throughout the deployment process.

</Step>
<Step>

**Compile TypeScript code to JavaScript.** This converts the TypeScript deployment script into executable JavaScript.

In the original terminal:

```bash
npm run build
```

</Step>
<Step>

**Execute the deployment script to deploy the contract.** This runs the compiled script which handles wallet creation and contract deployment.

```bash
npm run deploy
```

The script prompts for an existing wallet seed or generates a new one. If balance is zero, it displays the wallet address and waits for funding from the [faucet](https://midnight.network/test-faucet).

</Step>
</StepsProvider>

## Created artifacts

After successful deployment, project contains:

- **`deployment.json`**: File containing contract address and deployment timestamp
- **`dist/`**: Folder containing compiled JavaScript output
- **Wallet seed**: 64-character seed phrase displayed in console for new wallets

Final project structure:

```
my-mn-app/
├── contracts/
│   ├── managed/
│   │   └── hello-world/
│   │       ├── compiler/
│   │       ├── contract/     # Contains index.cjs
│   │       ├── keys/
│   │       └── zkir/
│   └── hello-world.compact
├── src/
│   └── deploy.ts
├── dist/                     # Generated by TypeScript
├── node_modules/
├── deployment.json           # Generated after deployment
├── package-lock.json
├── package.json
└── tsconfig.json
```

:::info Important to save

- **Wallet seed**: 64-character hex string. Keep private and secure. Losing it means losing wallet access.
- **Contract address**: Found in `deployment.json`. Required for contract interaction.
  :::

## Next steps

## The Hello World contract is now live on Midnight Testnet. You can [interact with the deployed contract](interact-with-mn-app).

title: Interact with deployed contract
description: Build a command-line interface to interact with a deployed Hello World contract on Midnight Testnet.
sidebar_position: 4
sidebar_label: Interact with an MN app
tags: [interaction, smart-contract, tutorial, testnet]
slug: /getting-started/interact-with-mn-app
toc_max_heading_level: 2

---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Step, { StepsProvider } from "@site/src/components/Step/Step";

# Interact with a deployed contract

After deployment, you can use the CLI to interact with the Hello World contract on Midnight Testnet.

## Prerequisites

The following is required:

- A `deployment.json` file containing contract address
- A 64-character hexadecimal wallet seed
- Project with all dependencies installed using `npm install`

## Create an interactive CLI script

Add a script to your project that provides an interactive menu for calling contract functions.

### Update `package.json`

To start, add the CLI script to the `scripts` section in `package.json`:

```json
"scripts": {
  "compile": "cd contracts && compact compile hello-world.compact .",
  "build": "tsc",
  "deploy": "node dist/deploy.js",
  "cli": "node dist/cli.js"
}
```

## Create the CLI script

<StepsProvider>
<Step>

**Create a new TypeScript file for the CLI.** This file contains all the logic for interacting with the deployed contract.

```bash
touch src/cli.ts
```

</Step>
<Step>

**Import required libraries for contract interaction.** These modules provide wallet management, contract connectivity, and command-line interface functionality.

Add to `src/cli.ts`:

```typescript
import * as readline from "readline/promises";
import { WalletBuilder } from "@midnight-ntwrk/wallet";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import {
  NetworkId,
  setNetworkId,
  getZswapNetworkId,
  getLedgerNetworkId,
} from "@midnight-ntwrk/midnight-js-network-id";
import { createBalancedTx } from "@midnight-ntwrk/midnight-js-types";
import { Transaction } from "@midnight-ntwrk/ledger";
import { Transaction as ZswapTransaction } from "@midnight-ntwrk/zswap";
import { WebSocket } from "ws";
import * as path from "path";
import * as fs from "fs";
import * as Rx from "rxjs";
```

</Step>
<Step>

**Configure network settings for Midnight Testnet connection.** This establishes the endpoints needed to communicate with the blockchain network.

```typescript
// Fix WebSocket for Node.js environment
// @ts-ignore
globalThis.WebSocket = WebSocket;

// Configure for Midnight Testnet
setNetworkId(NetworkId.TestNet);

// Testnet connection endpoints
const TESTNET_CONFIG = {
  indexer: "https://indexer.testnet-02.midnight.network/api/v1/graphql",
  indexerWS: "wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws",
  node: "https://rpc.testnet-02.midnight.network",
  proofServer: "http://127.0.0.1:6300",
};
```

</Step>
<Step>

**Create the main function that initializes the CLI interface.** This function checks for deployment files and prompts for wallet credentials.

```typescript
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Hello World Contract CLI\n");

  try {
    // Check for deployment file
    if (!fs.existsSync("deployment.json")) {
      console.error("No deployment.json found! Run npm run deploy first.");
      process.exit(1);
    }

    const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf-8"));
    console.log(`Contract: ${deployment.contractAddress}\n`);

    // Get wallet seed
    const walletSeed = await rl.question("Enter your wallet seed: ");

    console.log("\nConnecting to Midnight network...");

    // Additional logic follows...
  } catch (error) {
    console.error("\nError:", error);
  } finally {
    rl.close();
  }
}
```

</Step>
<Step>

**Build and synchronize the wallet with the network.** This creates a wallet instance from the seed and waits for it to sync with the blockchain state.

Add inside `try` block:

```typescript
// Build wallet
const wallet = await WalletBuilder.buildFromSeed(
  TESTNET_CONFIG.indexer,
  TESTNET_CONFIG.indexerWS,
  TESTNET_CONFIG.proofServer,
  TESTNET_CONFIG.node,
  walletSeed,
  getZswapNetworkId(),
  "info"
);

wallet.start();

// Wait for sync
await Rx.firstValueFrom(
  wallet.state().pipe(Rx.filter((s) => s.syncProgress?.synced === true))
);
```

</Step>
<Step>

**Load the compiled contract module from the file system.** This imports the contract code that was compiled in the previous steps.

```typescript
// Load contract
const contractPath = path.join(process.cwd(), "contracts");
const contractModulePath = path.join(
  contractPath,
  "managed",
  "hello-world",
  "contract",
  "index.cjs"
);
const HelloWorldModule = await import(contractModulePath);
const contractInstance = new HelloWorldModule.Contract({});
```

</Step>
<Step>

**Create a wallet provider to handle transaction operations.** This provider manages the cryptographic signing and submission of transactions to the network.

```typescript
// Create wallet provider
const walletState = await Rx.firstValueFrom(wallet.state());

const walletProvider = {
  coinPublicKey: walletState.coinPublicKey,
  encryptionPublicKey: walletState.encryptionPublicKey,
  balanceTx(tx: any, newCoins: any) {
    return wallet
      .balanceTransaction(
        ZswapTransaction.deserialize(
          tx.serialize(getLedgerNetworkId()),
          getZswapNetworkId()
        ),
        newCoins
      )
      .then((tx) => wallet.proveTransaction(tx))
      .then((zswapTx) =>
        Transaction.deserialize(
          zswapTx.serialize(getZswapNetworkId()),
          getLedgerNetworkId()
        )
      )
      .then(createBalancedTx);
  },
  submitTx(tx: any) {
    return wallet.submitTransaction(tx);
  },
};
```

</Step>
<Step>

**Configure providers and establish connection to the deployed contract.** These providers handle state management, data queries, and proof generation for contract interactions.

```typescript
// Configure providers
const zkConfigPath = path.join(contractPath, "managed", "hello-world");
const providers = {
  privateStateProvider: levelPrivateStateProvider({
    privateStateStoreName: "hello-world-state",
  }),
  publicDataProvider: indexerPublicDataProvider(
    TESTNET_CONFIG.indexer,
    TESTNET_CONFIG.indexerWS
  ),
  zkConfigProvider: new NodeZkConfigProvider(zkConfigPath),
  proofProvider: httpClientProofProvider(TESTNET_CONFIG.proofServer),
  walletProvider: walletProvider,
  midnightProvider: walletProvider,
};

// Connect to contract
const deployed: any = await findDeployedContract(providers, {
  contractAddress: deployment.contractAddress,
  contract: contractInstance,
  privateStateId: "helloWorldState",
  initialPrivateState: {},
});

console.log("Connected to contract\n");
```

</Step>
<Step>

**Implement the interactive menu loop for user operations.** This creates a command-line menu that allows users to store messages, read messages, or exit the application.

```typescript
// Main menu loop
let running = true;
while (running) {
  console.log("--- Menu ---");
  console.log("1. Store message");
  console.log("2. Read current message");
  console.log("3. Exit");

  const choice = await rl.question("\nYour choice: ");

  switch (choice) {
    case "1":
      console.log("\nStoring custom message...");
      const customMessage = await rl.question("Enter your message: ");
      try {
        const tx = await deployed.callTx.storeMessage(customMessage);
        console.log("Success!");
        console.log(`Message: "${customMessage}"`);
        console.log(`Transaction ID: ${tx.public.txId}`);
        console.log(`Block height: ${tx.public.blockHeight}\n`);
      } catch (error) {
        console.error("Failed to store message:", error);
      }
      break;

    case "2":
      console.log("\nReading message from blockchain...");
      try {
        const state = await providers.publicDataProvider.queryContractState(
          deployment.contractAddress
        );
        if (state) {
          const ledger = HelloWorldModule.ledger(state.data);
          const message = Buffer.from(ledger.message).toString();
          console.log(`Current message: "${message}"\n`);
        } else {
          console.log("No message found\n");
        }
      } catch (error) {
        console.error("Failed to read message:", error);
      }
      break;

    case "3":
      running = false;
      console.log("\nGoodbye!");
      break;

    default:
      console.log("Invalid choice. Please enter 1, 2, or 3.\n");
  }
}

// Clean up
await wallet.close();
```

</Step>
<Step>

**Add the main function call to start the CLI application.** This line at the end of the file initiates the script execution.

```typescript
main().catch(console.error);
```

</Step>
<Step>

**Start the proof server in a new terminal window.** This Docker container generates the zero-knowledge proofs required for contract interactions.

Open a new terminal and run:

```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

Keep this terminal open while running the CLI.

</Step>
<Step>

**Compile the TypeScript CLI application to JavaScript.** This converts the TypeScript code into executable JavaScript that Node.js can run.

In the original terminal:

```bash
npm run build
```

</Step>
<Step>

**Run the CLI application to interact with the contract.** This starts the interactive menu system for reading and writing messages to the blockchain.

```bash
npm run cli
```

Follow the prompts to:

- Enter wallet seed when prompted
- Wait for script to connect to network and sync wallet
- Use menu to interact with contract

</Step>
</StepsProvider>

## Understand CLI options

The CLI presents an interactive menu with various options for interacting with the deployed contract. Each option performs a specific blockchain operation, from writing data to the contract to reading its current state.

<br />

<Tabs>
<TabItem value="store" label="Store messages">

**Store a new message on the blockchain**

Calls `storeMessage` function in smart contract to write a new message:

- Prompts for custom message input
- Creates transaction and generates zero-knowledge proof
- Submits transaction to blockchain
- Costs gas fees and takes 10-30 seconds to complete

**Example output**:

```
Storing custom message...
Enter your message: Privacy is powerful!
Success!
Message: "Privacy is powerful!"
Transaction ID: 0x5678...efgh
Block height: 123457
```

</TabItem>
<TabItem value="read" label="Read messages">

**Read the current message from the blockchain**

Queries public state of contract to retrieve the stored message:

- Queries indexer for contract data
- No transaction created, no proof generated
- Free and instant operation
- Returns immediately with current message

**Example output**:

```
Reading message from blockchain...
Current message: "Privacy is powerful!"
```

</TabItem>
<TabItem value="exit" label="Exit">

**Exit the CLI application**

Safely terminates the program:

- Closes wallet connection
- Releases network resources
- Exits the application cleanly

**Example output**:

```
Goodbye!
```

</TabItem>
</Tabs>

:::tip Multiple interactions
You can call `storeMessage()` multiple times. Each call creates a new transaction that updates contract state with the latest message.
:::

## Next steps

The CLI successfully interacts with a privacy-preserving smart contract that accepts user input. You can explore advanced features:

### Enhanced contract features

- **Message validation**: Add logic to contract to enforce length limits or filter content
- **Message history**: Modify contract to store an array of past messages
- **Private messaging**: Use private state and witnesses to store confidential data

### UI improvements

- **Web interface**: Build frontend using React or Next.js
- **Real-time updates**: Use WebSocket connection to listen for blockchain events
- **Transaction status**: Display status of pending and confirmed transactions

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

---

# FAQ

## General questions

### Is there a Midnight white paper?

There is no Midnight white paper, but the research paper 'Kachina –
Foundations of Private Smart Contracts', written by researchers Thomas
Kerber et al. at the University of Edinburgh, describes the underlying
cryptography and Universal Composition model powering the Midnight
network. Read more about the architecture and concepts in the
'Learn' section.

### What tokens are available for use on Testnet? Are there gas fees?

Testnet uses only one token: test DUST (**tDUST**), which is a test token used for Midnight Testnet testing purposes only.
Visit the [token acquisition page](/docs/develop/tutorial/1-using/faucet.mdx) to find out more.
This may change in future
versions of Midnight, and may include the calibration of the gas fees against
the amount work performed by a computation.

## Developer questions

### Where do I go if I need help troubleshooting my code?

The [Getting help](./getting-help.mdx) section of this site describes
multiple ways to communicate with the Midnight team and your fellow
developers. Your questions, including those about troubleshooting
your code, are welcome.

### What types of DApps can I build on the Midnight Testnet?

Theoretically, any DApp that does not require one contract to call
another from within its circuits. This includes private payment
DApps, private auction DApps, and DApps that enable shielded identity
verification.

### What types of DApps can _not_ yet be built on Testnet?

DApps that require an oracle (for pricing data info or other external
data), such as a DeFi lending DApp requiring Bitcoin pricing data.

### Can I reuse Solidity code on Midnight?

No, Midnight DApps are created in TypeScript and Compact, a custom
programming language, to build zero-knowledge circuits that generate
privacy proofs.

### What are the key unique concepts or coding patterns I need to know to create DApps on Midnight?

One of the key ideas in Midnight is the distinction between
information that you want to place in the public record and
information that you want to keep private. For example, the assertion
that someone is over 25 might be useful to place in the public space
of a contract, while the details of the person's birthday and precise
age might be kept private. This kind of thinking about what is truly
needed in the public sphere is a core aspect of Midnight programming.

After writing the contract in Midnight’s contract language, the DApp
is written in standard TypeScript. This implies that the coding
experience of existing JavaScript and TypeScript programmers can be
applied to creating Midnight DApps.

### How does Midnight work at a high level?

See the tutorial's [introductory material](./tutorial/high-level-arch.mdx)
and the section of this site about [How Midnight works](./how-midnight-works/).
You can also read more about Midnight's architecture and concepts in
the 'Learn' section.

### What is the current Testnet block time (time to finality)?

Testnet block time is 6 seconds. This time is governed by network
parameters that are subject to adjustment. Finality will occur typically one or
two blocks after block creation (so within 18 seconds).

### I'm getting `ERR_UNSUPPORTED_DIR_IMPORT`. What should I do?

This error typically occurs when Node.js tries to import a directory instead of a specific file, which can happen if your terminal environment is stale after updating `~/.zshrc`, changing Node versions, or setting environment variables.

To fix this:

- Open a new terminal window (don’t just run `source ~/.zshrc`) after changing your shell config or switching Node versions.
- Ensure you're using the correct Node version (Midnight recommends Node 18+). Run:
  ```bash
  nvm use
  ```
- Clear any module cache:
  ```bash
  rm -rf node_modules/.cache
  ```

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

---

# Midnight architecture

Midnight's architecture allows decentralized applications to be
deployed on any device, from a massive server to a mobile phone. If
the device can run a web browser, it can run a Midnight DApp. Some of
Midnight's privacy-preserving capabilities, however, can be
computationally intensive. Therefore, the Midnight platform has made
it possible to separate the lightweight DApp code from the
cryptographic heavy lifting, leading to the architecture shown in the
following diagram.

![Midnight Devnet](/img/devnet1-simple-arch-light.jpeg)

Notice, first of all, that Midnight's contracts are described in a
domain-specific language: _Compact_, as in making a _compact_ with
someone.

One of the outputs of the Compact compiler is collection of
JavaScript/TypeScript definitions that provide a custom API for a
smart contract. The compiler also produces the cryptographic
materials and 'circuit' descriptions needed by the _proof server_ to
create zero-knowledge proofs, which enforce the terms of a smart
contract while shielding your private data.

The compiler runs only on the DApp developer's system, not in the
deployed Midnight DApp.

Midnight DApps rely on the services provided by a browser extension
integrated into a special
[Midnight alpha version](/docs/develop/tutorial/1-using/chrome-ext.mdx) of
the Lace wallet. In addition to
providing a faster implementation of certain functions than
would be possible in JavaScript, the extension serves as the wallet
to which Midnight's tokens are assigned.

:::note ⚠️ Wallet SDK v4.0.0 Notice

As of SDK v4.0.0, Midnight wallets and DApp connector APIs now use the Bech32m address format by default. If you're developing a DApp or working with the Lace browser extension, ensure that:

You're using @midnight-ntwrk/wallet@4.0.0 or later.

Your DApp connector is updated to @midnight-ntwrk/dapp-connector-api@2.0.0.

You handle Bech32m and legacy address formats correctly (see the wallet-sdk-address-format package for utilities).

Failure to update your tooling may result in incompatibilities or unreadable addresses during testing or integration.
:::

In this version of the Midnight testnet, there is one token: _test
DUST_, abbreviated _tDUST_. In the testnet, the primary function of
tDUST is to pay for transactions. tDUST is used for testnet testing purposes only. It has no monetary value or price
and is not yet calibrated to the computational expense of
transactions.

The details of a user's transaction, possibly including private data,
must be communicated between the DApp and the proof server to
generate a proof of the transaction's correctness, but private data
is never sent to any of the other services.

Keeping in mind the desirability of shielding private information, the
Midnight architecture supports a variety of deployment options. For
example:

- A DApp user could run the browser-hosted DApps, the proof server,
  and the client service elements on their laptop so that
  nothing other than Midnight inter-node traffic leaves that machine.
- Another user could run both the proof server and the client services on
  their own server in an office or lab and access it over an
  encrypted channel from a mobile device.
- Another user could host the proof server and the client services in the cloud
  (or pay a trusted third party to do it) and access them from a
  mobile device.
- A user could even run the proof server on their local machine
  (to keep private data entirely local) while relying on always-on
  instances of a Midnight Indexer and a Midnight node in the cloud.

This tutorial will begin by exercising that last option, giving you
instructions to run only the proof server on your system, while
connecting to a Midnight Indexer and Midnight network node that
Midnight has provisioned in the cloud. Later in the tutorial,
instructions are provided for the first option, in which you will
deploy all the client services on your system, with your own Midnight node connecting to the Midnight devnet.

## Tutorial overview

In this tutorial, you will begin by learning to _use_ Midnight DApps,
then learn to _compile and run_ them, and then have an
opportunity to _write_ a contract and parts of the code yourself. At
the end of the tutorial, you should have a deeper appreciation for
what Midnight has to offer and enough knowledge to be able to
experiment with your own Midnight contracts and DApps.

The Compact compiler, the Docker images for the proof server and other
client services, and all the TypeScript libraries you need are
available at:

| Artifact            | Location                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| Compact compiler    | [Compact Release](../../relnotes/compact)                                                          |
| Proof server        | [Proof Server Release](../../relnotes/proof-server)                                                |
| Lace wallet         | [Lace Wallet](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg) |
| Midnight Wallet SDK | [Midnight Wallet Release](../../relnotes/wallet)                                                   |
| VSCode extension    | [VSCode Extension Release](../../relnotes/vs-code-extension)                                       |
| Docker images       | [https://hub.docker.com/u/midnightnetwork](https://hub.docker.com/u/midnightnetwork)               |
| Node libraries      | [https://www.npmjs.com/search?q=midnight-ntwrk](https://www.npmjs.com/search?q=midnight-ntwrk)     |

The tutorial will guide you through the process of accessing them at
appropriate points in the lessons.

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "Lace wallet"

---

# Lace wallet

The Lace wallet is a Chrome extension.

:::important Chrome browser

You must use the Chrome web browser or its derivatives to complete
web-based transactions on the Midnight testnet.

Only the Chrome browser itself is fully supported. The Lace
wallet may not be able to connect to your local proof server from
Chrome derivatives. If you choose to use Brave, for example, it will
be necessary to disable Brave shields when running this tutorial's
welcome DApp, so that the DApp (hosted at one address) can contact
your local proof server (hosted on your system, at a different
address) through the Lace extension.

Supported Chromium version: 119 or later.

:::

## Install Lace wallet

1. Go to the [Lace wallet](https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg).
2. Install the extension.

You may want to go to the Lace wallet extension's detailed settings
and enable the toggle-switch labeled **Pin to toolbar**, so that the
wallet is easily accessible.

## Set up Lace wallet

1. Start the extension, either by clicking its icon on the web
   browser's toolbar (if you pinned it there after the preceding
   steps) or by clicking on it in the list of extensions under the
   extensions icon in your browser's toolbar.
2. The first page you see presents the options of creating a new
   wallet or restoring an existing one.
   ![new Lace wallet](/img/midnight-lace/lace-create-restore.png)
   At this point, create a new wallet.
3. Read and accept the 'Lace Terms of Use'.
   ![Lace Terms of Use](/img/midnight-lace/lace-terms.png)
4. Give your wallet a name to help you identify it later, maybe a name
   like _Midnight testnet_.
   ![Lace wallet name](/img/midnight-lace/lace-wallet-name.png)
5. Choose and save a strong password for your wallet. Please make sure to keep your password in a safe place. No one will have
   access to or the ability to retrieve or recover your password.
   If you lose your password, you will need to restore your wallet with your secret passphrase.
6. In the next step, the wallet asks for the network addresses and
   ports of the three client service components it needs:
   - the Midnight network you are going to connect to. If you're connecting to our testnet, choose the "Testnet" option. If you're running a local version of midnight testnet, choose the "Undeployed" option.
   - the Midnight network node through which transactions are to be
     submitted
   - the Midnight Indexer of the blockchain, which
     transmits ledger updates to the wallet
   - the proof server, which generates zero-knowledge proofs of the
     validity of your Midnight transactions

   ![Lace server configuration](/img/midnight-lace/lace-server-config.png)

:::important
Notice that the default proof server address points to a local instance
that you have installed. This is because the proof server requires
private data as inputs, and using a remote instance could compromise
users' private data.
:::

7. Finally, fill in all the words for a secret passphrase, which may
   be needed to restore your wallet in the future.
   _Do not lose this passphrase! Please write down and keep your passphrase in a safe place. No one will have access to or the ability to retrieve or recover your passphrase. If you lose your passphrase, you will not be able to restore your wallet._
   ![Lace secret passphrase](/img/midnight-lace/lace-passphrase.png)

8. After you have verified your passphrase, a page confirming that you
   have completed the setup is displayed.
   ![Lace setup complete](/img/midnight-lace/lace-done.png)

Then the main page for your new wallet appears, with 0.00 tDUST as its
initial balance. You can access this view at any time by clicking on the Lace wallet extension icon again.

Before your wallet has received any tDUST, the main page displays the
wallet address, so that you can copy it into some place that will
transfer funds to the wallet.
Visit the [token acquisition page](/docs/develop/tutorial/1-using/faucet.mdx) to find out more.
Later, you can access the wallet address
at any time by clicking on the **Receive** button at the top of the
page.
![Lace receive](/img/midnight-lace/lace-receive.png)

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "Token acquisition"

---

# Token acquisition

In the production Midnight network, anyone running a DApp would need
to hold some DUST in a persistent wallet and spend some of it on each
transaction. On the testnet, however, a supply of free tDUST is
available for developers who want to experiment with Midnight DApps.

## Get tDUST

1. Copy your receiving address from your Lace wallet.

:::note Bech32m Address Format
All wallet addresses are shown in Bech32m format by default. The faucet supports both formats, however the legacy (HEX) format will be dropped in future versions.
:::

2. Visit the [Midnight testnet faucet 🚰](https://midnight.network/test-faucet/) and enter your wallet address.
3. Select **Request tokens**. This may take a few seconds to process and will return something like:

`Transaction submitted. Its ID is 1644b988ac71dc6bd6...`

4. You should have received 1000.0 tDUST from the faucet.

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

---

# Using Midnight

In this first part of the Midnight developer tutorial, you will:

1. Learn to install and configure the components needed to connect to the
   Midnight network
2. Acquire some tDUST to pay for transactions on the network
3. Run a DApp that connects to the network and performs a transaction.

When you are done with part 1, you will have connected to the Midnight
network and made real changes to the Testnet blockchain ledger.

Remember, if you run into any problems, ask for help using the
pathways described in the [getting help](/docs/develop/getting-help.mdx) section.

# Prerequisites

## Supported platforms

These instructions have been tested on recent versions of macOS and
various Linux distributions. Development on Windows has been tested
using the Windows Subsystem for Linux (WSL), specifically
`Ubuntu 22.04.2 LTS (GNU/Linux 5.15.90.1-microsoft-standard-WSL2 x86_64)`.

## Docker

A working Docker installation is needed to continue with this tutorial.
The easiest and recommended installation is [Docker Desktop](https://docs.docker.com/desktop/).

Check that you can invoke Docker. If you type the following at a
shell prompt, you should see a recent version number, such as 24.0.5.

```shell
docker --version
```

List available images from Midnight docker repository.

```shell
docker search midnightnetwork
```

You can also manually add our images through Docker Desktop.

![](./img/docker_manual_add.png)

If you cannot complete this step, contact the Midnight DevRel team, as
described in the [getting help](/docs/develop/getting-help.mdx) section.

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "Proof server"

---

# Proof server

Midnight uses zero-knowledge (ZK) cryptography to enable shielded
transactions and data protection. An essential element of this
architecture is ZK functionality provided by a Midnight _proof
server_, which generates proofs locally that will be verified on-chain. The information that a DApp sends to the proof server includes
private data, such as details of token ownership or a DApp's
private state. To protect your data, you should access only a local
proof server, or perhaps one on a remote machine that you control,
over an encrypted channel.

In this section of the tutorial, you will install and run a Midnight
proof server on your system in a Docker container. The [Lace wallet](/docs/develop/tutorial/1-using/chrome-ext.mdx)
Chrome extension (including the wallet) communicates with the proof
server to invoke ZK functionality and generate ZK proofs for your
transactions.

## Install the proof server

1. In the [prerequisites](./index.mdx) for this part of the tutorial, you
   installed Docker and verified your access to the [Midnight Testnet docker repo](https://hub.docker.com/u/midnightnetwork).
   - Via the terminal:

     ```shell
     docker search midnightnetwork
     ```

   - Or by searching `midnightnetwork` in the Docker Desktop search bar.

2. To download the Docker image for the Midnight proof server:
   - Via the terminal:

     ```shell
     docker pull midnightnetwork/proof-server:latest
     ```

     If you need to run an older version of the proof-server, Replace `latest` with the required version of the proof server according to the [release compatibility matrix](../../../relnotes/support-matrix).

   - Or by clicking **pull** in the search results of the Docker Desktop.

:::tip

By the way, you may not have noticed, but if you hover your mouse
pointer over any of the shell commands or code example boxes in this
tutorial, a _copy_ icon (it looks like two overlapping sheets of paper)
appears at the right-hand side of the box. Click that to copy the
contents of the box.

:::

3. You can verify the download's success by checking that the following
   command lists a proof server image.
   - Via the terminal:

     ```shell
     docker images | grep proof-server
     ```

   - Or by clicking **>\_ Terminal**, clicking **Enable Docker terminal** and running the same command as above.

## Start the proof server

In the terminal, run the proof server with the following command:

```shell
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

You should see some output indicating that the server has started.

## Stop the proof server

To stop the proof server, simply exit the process you launched with
`docker run`. For example, on most systems, you can type `Ctrl-C` to
stop the process.

**For the next step in this tutorial, the proof server must be
running**, so if you have stopped it, start it again now.

## Your privacy

The proof server exists to protect your privacy. It does not open any
network connections; it simply listens on its assigned port for
requests from your Chrome extension. One of the lines of output you
may see from the proof server includes this text:

```
Targeting network: TestNet
```

This indicates that the instance you are running is configured
appropriately to generate proofs that are valid on the Midnight
Testnet. It does not indicate a network connection from the proof
server to Testnet.

Please let the DevRel support team know if you have any privacy
concerns regarding the proof server.

## Optionally for Linux users: Setup proof-server as a systemd service

For added convenience, you may consider running the proof-server as an automatic background process anytime you boot your machine.

1. Create a new file for your systemd service, typically in the `/etc/systemd/system/` directory. For example:

```shell
sudo nano /etc/systemd/system/midnight-proof-server.service
```

2. Add the following contents.

```
[Unit]
Description=Midnight Network Proof Server
After=docker.service
Requires=docker.service

[Service]
ExecStart=/usr/bin/docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

Adjust the `Description`, `ExecStart`, and other parameters as needed.

3. Reload systemd manager to apply changes.

```shell
sudo systemctl daemon-reload
```

4. **Start** service.

```
sudo systemctl start midnight-proof-server # start service
```

5. How to **stop** and get **status** of service.

```shell
sudo systemctl enable midnight-proof-server # stop service

sudo systemctl status midnight-proof-server # get status of service
```

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

---

# Build a DApp

Build and deploy decentralized applications (DApps) on the Midnight network. This guide covers toolchain installation, contract compilation, DApp deployment, and node operation. The following example implementation demonstrates a counter contract.

## Prerequisites

- **Operating System:** Linux, macOS, or Windows (via WSL)
- **Node.js:** v18 LTS or higher (NVM recommended)
- **Yarn**
- **Git**
- **Terminal:** Bash, Zsh, or compatible shell
- **Disk Space:** ≥ 2 GB
- **Network:** Internet connection

## Objectives

This guide enables developers to:

1. Install the tools necessary to compile a Midnight contract and DApp from source code
2. Download the example code needed for development
3. Build a simple example from source
4. Run the example and deploy a smart contract
5. Install and run a Midnight network node and its associated Indexer

:::important
Use compatible versions of example code and the Compact compiler, as shown in the [release compatibility matrix](../../../relnotes/support-matrix).
:::

The final sections examine the Compact code for the example contract and the TypeScript code for the example DApp in detail.

Upon completion, developers have built a DApp from source, deployed a contract, and run a non-voting Midnight node connected to the Midnight network.

The example contract creates a counter on the ledger and provides a circuit to increment it. The contract enforces only constraints implied by the `Counter` type. While this example doesn't demonstrate Midnight's full privacy capabilities, it provides the foundation for building and deploying contracts on the Midnight network.

## Node

Many Midnight Testnet features are provided as TypeScript packages, including example applications and APIs. These packages require Node.js as their runtime environment and use npm (Node Package Manager) for dependency management. Node Version Manager (NVM) provides the best way to install and manage Node.js versions because it enables switching between different Node versions for different projects and ensures compatibility with Midnight's requirements.

Find installation and troubleshooting instructions on [the NVM GitHub site](https://github.com/nvm-sh/nvm#installing-and-updating). For macOS users installing via Homebrew, the installation process differs slightly from the standard script installation. Homebrew places NVM in a different directory and requires specific additions to shell profile files for proper initialization.

After following NVM installation instructions, verify installation:

```shell
nvm --version
```

The command displays a version number such as `0.39.5`. If the command isn't found, the shell profile modifications weren't applied correctly. Ensure the NVM initialization script is added to the appropriate shell configuration file (`~/.bashrc` for Bash, `~/.zshrc` for Zsh).

Install LTS version of Node 18x or greater:

```shell
nvm install 18 --lts
```

This command downloads and installs the latest Long Term Support version of Node 18. LTS versions receive critical bug fixes and security updates for an extended period, ensuring stability for production applications. The installation includes both Node.js and npm.

Set Node 18 as the default version for new terminal sessions:

```shell
nvm alias default 18
```

Verify the Node installation:

```shell
node --version
npm --version
```

> **Caution**: After modifying `~/.zshrc`, `~/.bashrc`, or installing a new Node version using `nvm`, open a new terminal window. Running `source ~/.zshrc` might not fully reload the environment and could lead to issues such as `ERR_UNSUPPORTED_DIR_IMPORT`. This error occurs when Node.js attempts to import ES modules but the environment variables aren't properly configured.

## Install the Compact developer tools

The Compact developer tools manage the installation and updates of the Compact toolchain, including the compiler. These tools solve the complexity of managing multiple compiler versions, platform-specific binaries, and toolchain dependencies. Before these tools existed, developers manually downloaded platform-specific ZIP files, extracted binaries, managed PATH configurations, and repeated this process for each update.

Install the developer tools with a single command:

```shell
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
```

This command performs several operations:

- Downloads the installation script using secure HTTPS with TLS 1.2 minimum
- Detects the system architecture (x86_64, ARM64) and operating system
- Downloads the appropriate binary for the platform
- Creates the `~/.compact` directory structure for toolchain management
- Installs the `compact` command-line tool to `~/.cargo/bin` or another appropriate location

The installation script outputs instructions for adding the binary directory to your `PATH` environment variable. This step is crucial—without it, the shell cannot find the `compact` command. The exact instructions depend on your shell and existing PATH configuration. Typically, add a line like this to your shell configuration file:

```shell
export PATH="$HOME/.cargo/bin:$PATH"
```

After adding the directory to your `PATH`, open a new terminal window or reload your shell configuration. Then update to the latest toolchain:

```shell
compact update
```

This command downloads the latest stable version of the Compact compiler and associated tools. The download includes:

- The Compact compiler binary
- Zero-knowledge proving key generator (`zkir`)
- Platform-specific runtime dependencies
- Standard library definitions

The output shows the installed version:

```
compact: aarch64-darwin -- 0.24.0 -- installed
compact: aarch64-darwin -- 0.24.0 -- default.
```

The first line confirms successful installation. The second line indicates this version is now the default for all compilation operations. The tools maintain multiple versions simultaneously, enabling testing with different compiler versions without conflicts.

### Verify the installation

Test the compiler installation to ensure all components are properly configured:

```shell
compact compile --version
```

This command displays the compiler version number, such as `0.24.0`. The version check confirms:

- The `compact` binary is accessible via PATH
- The default toolchain is properly linked
- The compiler binary has appropriate execution permissions
- All required dependencies are present

If the command fails, common issues include:

- **PATH not updated**: The shell cannot find the `compact` command. Verify the installation directory is in your PATH and reload your shell configuration
- **No default toolchain**: Run `compact update` to install and set a default compiler version
- **Permission issues**: On Unix systems, the binaries might lack execution permissions. The installer should handle this automatically, but manual installation might require `chmod +x` on the binaries

The version number corresponds to the Compact compiler release, not the developer tools version. These versions are independent—developer tools version 0.1.0 might manage compiler version 0.24.0. Refer to the [release compatibility matrix](../../../relnotes/support-matrix) for version compatibility between compiler versions and example code.

### Check for updates

Regular update checks ensure access to the latest features, performance improvements, and bug fixes:

```shell
compact check
```

This command performs a network request to determine available updates. The output varies based on your current state:

When updates are available:

```
compact: aarch64-darwin -- Update Available -- 0.24.0
compact: Latest version available: 0.25.0.
```

This indicates version 0.25.0 is available for download. The update might include:

- New language features for Compact contracts
- Performance optimizations for proof generation
- Bug fixes for edge cases in compilation
- Enhanced error messages for better debugging

When current:

```
compact: aarch64-darwin -- Up to date -- 0.24.0
```

This confirms you're using the latest stable release. Check the Midnight developer announcements for information about upcoming releases and their expected features.

The check command only queries for updates without downloading them. This design enables checking for updates in bandwidth-constrained environments or when you need to coordinate updates across a development team.

## Use the Compact compiler

The Compact developer tools provide the standard method to invoke the compiler. Understanding the compilation process helps debug issues and optimize build workflows.

### Basic compilation

The standard compilation command:

```shell
compact compile <contract file> <output directory>
```

For example:

```shell
compact compile src/counter.compact src/managed/counter
```

This command triggers several processes:

1. **Parsing**: The compiler reads and validates the Compact contract syntax
2. **Type checking**: Ensures type safety across circuits, witnesses, and ledger operations
3. **Circuit generation**: Converts high-level Compact code into zero-knowledge circuits
4. **Proving key generation**: Creates cryptographic keys for generating and verifying proofs
5. **TypeScript API generation**: Produces type-safe interfaces for DApp integration

The compilation creates multiple output files in the specified directory:

- `contract/index.d.cts` - TypeScript type definitions for the contract API
- `contract/index.cjs` - JavaScript implementation of the contract
- `zkir/` - Directory containing the zero-knowledge circuit representations
- `proving-keys/` - Cryptographic keys for proof generation
- `verifying-keys/` - Public keys for proof verification

The compiler reports circuit complexity metrics:

```
Circuit 'increment' has complexity: 1234 constraints
```

These metrics indicate the computational cost of generating proofs. Higher constraint counts mean longer proof generation times and higher resource requirements. Optimize circuits to minimize constraints while maintaining security properties.

### Version-specific compilation

Override the default compiler version for testing or compatibility:

```shell
compact compile +0.23.0 <contract file> <output directory>
```

This feature enables:

- Testing contracts against different compiler versions
- Maintaining compatibility with deployed contracts compiled with older versions
- Gradual migration when new compiler versions introduce breaking changes

The version specifier (`+0.23.0`) must reference an already-installed version. Use `compact list --installed` to see available versions.

### Environment variables

The Midnight example DApps historically used environment variables for configuration and toolchain location. Understanding these variables helps when working with existing code or debugging build issues.

**Legacy COMPACT_HOME variable**: Previous versions of Midnight examples required setting `COMPACT_HOME` to point to the compiler directory. The new developer tools eliminate this requirement by managing compiler locations internally. The `compact` command automatically resolves the correct compiler path based on the selected version.

If working with older example code that references `COMPACT_HOME`, you have two options:

1. **Update the build scripts**: Replace `$COMPACT_HOME/compactc` references with `compact compile` commands
2. **Set COMPACT_HOME for compatibility**: Export the variable pointing to `~/.compact/bin` for temporary backward compatibility

**Direct compiler access**: While not recommended, the installed toolchain binaries reside in `~/.compact/bin/`. This directory contains symbolic links to the current default version's binaries:

- `compactc` - The main compiler executable
- `zkir` - Zero-knowledge intermediate representation tool
- Supporting libraries and runtime files

Direct invocation bypasses version management benefits. Always prefer using `compact compile` for:

- Automatic version selection
- Consistent behavior across platforms
- Compatibility with future toolchain updates
- Integrated error handling and diagnostics

**Project-specific configuration**: Modern Midnight projects should document their compiler version requirements in configuration files rather than relying on environment variables. Consider using:

- `package.json` scripts that invoke `compact compile` with specific versions
- Build configuration files that specify the required compiler version
- CI/CD pipelines that install and use specific toolchain versions via `compact update`

This approach ensures reproducible builds across different development environments and team members.

## Optional: Visual Studio Code extension for Compact

Use any editor to create Midnight DApps. Midnight provides a VSCode extension specifically for creating and editing Midnight contracts written in the Compact DSL. The extension transforms VSCode into a specialized Compact development environment with language-aware features that significantly improve productivity and reduce errors.

### Extension features

**Syntax highlighting**: Color-codes different language elements (keywords, types, functions, comments) for improved readability. The highlighting rules understand Compact-specific constructs like `circuit`, `witness`, and `ledger` declarations.

**Live, dynamic contract checking**: Performs real-time semantic analysis as you type, identifying errors before compilation. This includes:

- Type checking across circuit boundaries
- Privacy flow analysis to prevent unintended data disclosure
- Witness function signature validation
- Ledger state access verification

**Debugging assistance**: Provides enhanced error messages with suggested fixes. When compilation fails, the extension highlights problematic code sections and offers context-aware solutions.

**Code completion and IntelliSense**: Offers intelligent suggestions for:

- Standard library functions and types
- Ledger field access
- Circuit and witness declarations
- Import statements for standard modules

**Templates and snippets**: Accelerates development with pre-built patterns for:

- New contract scaffolding with standard structure
- Common circuit patterns (authentication, state transitions)
- Witness function declarations
- Standard library imports

### Installation process

Download the VSCode extension for Compact from [the Midnight Testnet releases repository](../../../relnotes/overview). The file name follows the pattern `compact-x.y.z.vsix` for version `x.y.z`. The VSIX file is a packaged extension format that includes all necessary dependencies.

Install the plugin in VSCode:

1. **Open the Extensions pane**: Click the Extensions icon in the Activity Bar or press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
2. **Access installation options**: Click the `...` symbol at the top of the Extensions pane to reveal additional actions
3. **Select manual installation**: Choose "Install from VSIX..." from the dropdown menu
4. **Locate the downloaded file**: Navigate to your Downloads folder or wherever you saved the VSIX file
5. **Confirm installation**: VSCode installs the extension and may prompt for additional permissions

VSCode typically activates newly installed extensions immediately. The extension activates automatically when opening files with the `.compact` extension. Sometimes VSCode prompts for a restart to ensure all language server components initialize properly.

### Configuration

The extension works with default settings but supports customization through VSCode's settings:

- **Compiler path**: If not using the standard `compact` command, specify a custom compiler location
- **Validation level**: Adjust the strictness of real-time checking (errors only, include warnings, include suggestions)
- **Format on save**: Enable automatic code formatting when saving files

Access extension settings through `File > Preferences > Settings` and search for "Compact" to find all available options.

Even if VSCode isn't your primary editor, consider using the VSCode Compact extension for editing Midnight contracts while learning the language. The immediate feedback and intelligent assistance accelerate the learning process and help avoid common mistakes.

## Manage toolchain versions

The Compact developer tools support multiple toolchain versions simultaneously. This capability is essential for maintaining existing contracts while developing new ones, testing compatibility across versions, and gradually migrating to newer compiler releases.

### List available versions

View all versions available for download:

```shell
compact list
```

Output shows versions and supported platforms:

```
compact: available versions

→ 0.24.0 - x86_macos, aarch64_macos, x86_linux
  0.23.0 - aarch64_macos, x86_linux
  0.22.0 - x86_macos, x86_linux
```

The arrow (`→`) indicates the current default version used when running `compact compile` without a version override. Platform indicators show which architectures support each version:

- `x86_macos` - Intel-based Mac computers
- `aarch64_macos` - Apple Silicon Macs (M1, M2, M3)
- `x86_linux` - Standard Linux on Intel/AMD processors

Not all versions support all platforms. Early releases might lack Apple Silicon support, while some versions might skip certain platforms due to build issues.

### Check installed versions

List versions downloaded to your system:

```shell
compact list --installed
```

Output shows only locally available versions:

```
compact: installed versions

→ 0.24.0
  0.23.0
```

Installed versions consume disk space (approximately 100-200MB each) but enable offline compilation and instant version switching. Remove unused versions by deleting their directories from `~/.compact/versions/`.

### Switch between versions

Change the default toolchain version:

```shell
compact update 0.23.0
```

This command:

1. Downloads the specified version if not already installed
2. Verifies the download integrity using checksums
3. Updates the symbolic link at `~/.compact/bin` to point to the new version
4. Confirms the switch with output showing the new default

The switch affects all subsequent `compact compile` commands unless overridden with the `+version` syntax. Projects can document their required compiler version in README files or build scripts to ensure consistency across team members.

## Developer tools maintenance

The developer tools update themselves independently from the toolchain. This separation ensures that improvements to the version management system don't require compiler updates, and compiler releases don't force tool updates. The architecture enables the tools to manage multiple compiler versions while maintaining a consistent interface.

### Check for tool updates

Verify if newer developer tools are available:

```shell
compact self check
```

This command queries the GitHub releases API to identify the latest stable version. The check compares your installed version against the latest release and reports:

- Current installed version of the developer tools
- Latest available version
- Whether an update is recommended

The tools check for updates automatically once per day when running any `compact` command. This passive check doesn't interrupt workflow but notifies about available updates through a brief message after command completion.

### Update the developer tools

Install the latest developer tools version:

```shell
compact self update
```

The self-update process:

1. Downloads the latest version to a temporary location
2. Verifies the download using cryptographic signatures
3. Replaces the current binary with the new version
4. Preserves all installed toolchains and configuration

Self-updates are backward compatible—new tool versions continue to work with existing installed toolchains. This design principle ensures that updating tools never breaks existing projects.

### When to update

Update the developer tools when:

- **New features become available**: Future releases include features like `compact format` for code formatting, `compact doc` for documentation generation, and `compact test` for contract testing
- **Bug fixes are released**: Tool updates may resolve issues with version management, platform compatibility, or command execution
- **Security updates**: Although rare, security updates to the tools themselves should be applied promptly

The release notes for each tool version (distinct from compiler release notes) describe new features and important changes. Monitor the Midnight developer announcements for significant tool updates that enhance the development experience.

## Get help

The `compact` tool provides comprehensive built-in documentation accessible directly from the command line. This integrated help system eliminates the need to search online documentation for basic command syntax and options.

### General help

Access the main help overview:

```shell
compact help
compact --help
```

Both commands display identical output—a complete list of available subcommands with brief descriptions. The help text includes:

- **Subcommand list**: All available operations like `compile`, `update`, `list`, `check`
- **Global options**: Flags that apply to all subcommands, such as `--directory` for specifying the toolchain location
- **Usage examples**: Basic command patterns showing typical invocations

The help system uses a hierarchical structure. The top-level help provides an overview, while subcommand-specific help offers detailed information about individual operations.

### Subcommand help

Get detailed help for specific operations:

```shell
compact help update
compact update --help
```

Subcommand help includes:

- **Detailed description**: Explains what the command does and when to use it
- **Argument specifications**: Required and optional parameters with their types
- **Flag descriptions**: All available options with their effects
- **Examples**: Real-world usage scenarios
- **Related commands**: References to similar or complementary operations

For compiler-specific help:

```shell
compact compile --help
```

This displays compiler options including:

- **Input specifications**: Supported file formats and contract structures
- **Output options**: Directory structure and generated file descriptions
- **Optimization flags**: Options for controlling compilation behavior
- **Debug options**: Flags for generating additional diagnostic information

### Version information

The tools provide multiple version queries for different components:

**Developer tools version**:

```shell
compact --version
```

Returns the version of the `compact` command itself (e.g., `0.1.0`). This version indicates the capabilities of the version management system.

**Compiler/toolchain version**:

```shell
compact compile --version
```

Returns the version of the currently selected Compact compiler (e.g., `0.24.0`). This version determines available language features and compilation behavior.

**Compact language version**:

```shell
compact compile --language-version
```

Returns the version of the Compact language specification supported by the current compiler. Language versions change less frequently than compiler versions, as they represent the stable language syntax and semantics.

Understanding version relationships helps diagnose compatibility issues:

- **Language version**: Defines contract syntax and available features
- **Compiler version**: Implements a specific language version with particular optimizations
- **Developer tools version**: Manages compiler installations and provides development utilities

When reporting issues or seeking support, provide all three version numbers for complete context.

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "The counter contract"

---

# The counter contract

The remainder of this part of the tutorial examines first the
Compact contract and then the TypeScript code for the counter DApp.

The contract behind the counter DApp can be found within the
Counter Dapp examples directory at:

```
example-counter/contract/
```

The counter contract itself is very simple. Here are the entire
contents of `counter.compact`:

import CodeFromGithub from '@site/src/components/CodeFromGithub';

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/contract/src/counter.compact"
  language="compact"
/>

To make sense of this Compact code, start in the middle, with the `ledger` field
declaration. It says that the public state of the contract, visible on the
Midnight blockchain, includes a field `round`. The Midnight ledger supports
`Counter` as one of its [state
types](../../reference/compact/lang-ref#ledger-state-types), and the field is
declared to be of that type.

In addition to declaring ledger fields, a contract can declare the functions
that provide the interface to its private state, each marked with the `witness`
keyword. The counter contract has no support for such hidden, off-chain state,
so no witnesses are mentioned.

This contract provides a single public operation (_circuit_) that its users can
call: `increment`. The `increment` operation simply increments the value of the
`round` counter by `1`.

There are two other lines of code in this contract, at the top of the file. The
first line is a `pragma` that specifies a constraint on the Compact language
version. If the Compact compiler does not support the language versions
specified, it will signal a compile-time error. The second is the `import` that
makes Compact's standard library (`CompactStandardLibrary`) available in this
file. The standard library includes the ledger type `Counter` and so it has to
be imported to make that type available.

More interesting contracts can declare enumerations and structured types to be
used in the ledger, multiple circuits (including unexported ones called only by
other circuits in the contract), and the functions that manipulate private,
off-chain state. You will learn much more about Midnight contracts in the next
major section of this tutorial: the bulletin board example.

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "Build the counter DApp"

---

# Build the counter DApp

The focus of part 2 of this tutorial is on using the tools that a
developer needs to create Midnight DApps. To that end, the example uses
an extremely simple contract, which simply defines a counter and a
circuit to implement it. To keep the code short enough to
read easily, the counter DApp uses a text-based user interface,
omitting the additional complexities of a web interface. Later parts
of the tutorial will guide you through the creation of web-based
DApps.

At the root level of the `example-counter` repository, notice two sub-directories, each of which is a
separately buildable project.

- `contract` - contains the Compact source for the counter contract,
  plus a tiny amount of associated TypeScript
- `counter-cli` - contains the command-line interface of the DApp and
  depends on the `contract` code.

## Compile the code

1. In the `contract` folder, compile the Compact contract and build:

```shell
npm run compile && npm run build
```

The `compile` script calls `compact compile` with the correct paths configured in `package.json`. The `build` script compiles the TypeScript wrapper code.

2. Switch to the `counter-cli` folder and run the application:

```shell
npm run start-testnet-remote
```

This starts the DApp and connects to a remote Midnight testnet node.

:::note
The npm scripts use the new `compact compile` command internally. The deprecated `compactc` executable should not be used directly. Always use either `compact compile` or the provided npm scripts.
:::

You should see the following output from npm and the Compact compiler:

```
Compact version: 0.25.0
Compiling 1 circuits:
  circuit "increment" (k=10, rows=29)
Overall progress [====================] 1/1
```

:::note
The compiler completes very quickly because you've instructed it to skip ZK key generation with the option `--skip-zk`. The compiler's output files are placed in the directory `contract/src/managed/counter`.
:::

## Build the TypeScript source files

1. In the `contract` folder, run this command:

```shell
npm run build
```

This creates the `contract/dist` directory.

2. Start unit tests by running:

```shell
npm run test
```

3. In the `counter-cli` folder, run this command:

```shell
npm run build
```

You are now ready to run the Dapp!

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "Run the counter DApp"

---

# Run the counter DApp

Now you are ready to run the counter DApp, deploying a new instance of
its contract to the Midnight Testnet and submitting transactions
to the network.

## A command-line wallet

Because this DApp has no web-based user interface and runs outside of
your web browser, it cannot access the Lace wallet that you
installed in part 1 of the tutorial. Instead, the DApp initializes
a Midnight wallet that shares its core libraries with Lace wallet, but
which can be invoked through library calls in command-line
applications. (Many programmers refer to the software without a graphical
user interface as 'headless', so you may find text elsewhere that
refers to this wallet as the 'headless wallet'.)

When you run the DApp, the first thing it will do is instantiate its
wallet, either by creating a completely fresh one or by rebuilding the
wallet from a previously generated seed. On the first run, you must
create a fresh one and transfer some tDUST to it from your Midnight
Lace wallet. The instructions below guide you through the process.

## Run the counter CLI

1. Be sure the proof server that you installed in part 1 of the
   tutorial is started.

2. In the `counter-cli` directory, launch the DApp with:

   ```shell
   yarn testnet-remote
   ```

   This starts the DApp in a configuration that uses your local proof
   server, but connects to cloud-deployed instances of a Midnight node
   and a Midnight Indexer, just as in part 1 of this tutorial.

3. Choose to build a fresh wallet. The DApp will display the wallet's
   address and a balance of 0 tokens.

   The seed for the freshly created wallet will also be printed. Save
   this information so that you can reuse this wallet on a later run
   of the counter DApp.

   Additionally, your interactions with the DApp, including the wallet
   address and seed, are stored in a `log` subdirectory of
   `counter-cli`.

4. Transfer tokens from your Lace wallet to your CLI wallet:
   - Copy your new wallet's address and open the Lace wallet
     in your web browser by clicking its icon on the Chrome toolbar.
   - Select **Send** and paste the CLI wallet address into the 'recipient's address' field.
   - Enter an amount to transfer. The value of 10 tDUST will be more than enough.
   - Review and click **Send**.
   - Enter your wallet password and click **Confirm**.

5. Return to the counter DApp's window and wait for the tokens to be
   received. The DApp detects the funds that were transferred to
   your CLI wallet and reports your new wallet balance, followed
   by a new prompt.

6. The next prompt asks whether you want to deploy a new counter
   contract on Testnet or join an existing one. Choose to deploy
   your newly-compiled contract.

   The DApp prints the deployed contract's address. Save this
   information, so that you can run the DApp again later and rejoin
   the contract.

7. Interact with the contract. You are prompted with three options: increment, display, or exit.
   - First, display the current value by selecting option 2. This
     retrieves the current state of the contract from the blockchain
     ledger. It should report a value of `0`.
   - Next, increment the counter by selecting option 1. This submits a
     new transaction and awaits confirmation.

     If you watch your proof server's output in another window at the
     same time, you will see that it generates a proof for the
     transaction, which is submitted to Testnet.

     Generating the proof, submitting it to Testnet, and waiting
     for the transaction to be processed by the network takes some
     time. Eventually, the DApp should report the successful
     completion of the transaction, with output like:

     ```
     Transaction <transaction hash> added in block <block number>
     ```

   - Now verify that the counter's value has been incremented by
     selecting option 2. It should report a new value of `1`.

   - Repeat as you like, and then select (3) to exit. There is a problem in one of the underlying libraries
     that can cause error messages upon exit. You may safely ignore
     these.

8. Try running the DApp again, rebuilding the wallet from the saved
   seed, and rejoining the existing contract. Have fun playing and
   experimenting.

🎉 **Congratulations,** you are now building and deploying DApps on the Midnight Testnet.

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "The counter DApp"

---

# The counter DApp

The counter DApp is written in TypeScript. This page of the tutorial
is intended to serve as a guide to help you find your way around the
code, not reviewing every line, but looking at the 'big pieces' and
the most interesting parts. You can follow along in your own copy of
the code.

## Project structure

You may find it useful to split DApps into several
sub-projects. This is especially true for larger, more complex DApps
with web-based user interfaces, where it is desirable to test the core
logic independently from the user experience. Even for a DApp as
simple as the counter, however, you will see that the code is split
into two sub-projects:

- `contract` - This sub-project contains the contract itself, plus
  supporting code to define the implementation of the local private
  state and code to test the contract's logic.
- `counter-cli` - This sub-project defines the command-line interface
  of the DApp. It depends on the outputs of the `contract`
  sub-project.

You will find project definition and configuration files in each
sub-project's top level directory, while the source code is in its
`src` subdirectory.

## The `contract` sub-project

The preceding page already gave you a tour of the contract itself.
Because the contract is so simple, there is very little additional
code to be written.

### Witness implementation

Look in the file `contract/src/witnesses.ts`. As the preceding page
discussed, the counter contract defines no private state and therefore
requires no witness functions to be defined. In the TypeScript
representation of contracts, however, every contract is parameterized
over its private state, so there remains a need to define _some_
private state object for the contract. In this case, we use the type
`Record<string, never>` to represent the type of an empty object.
The definitions in counter's `witnesses.ts` therefore provide the minimal (empty)
implementations of witnesses possible.

import CodeFromGithub from '@site/src/components/CodeFromGithub';

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/contract/src/witnesses.ts"
  language="typescript"
/>

Part 3 of the Midnight tutorial introduces an example that follows the
same structure, but with more interesting contents in its
`witnesses.ts`.

### Generated source

The file `contract/src/index.ts` merely re-exports the definitions
from the other files in the contract sub-project. Which definitions?
The empty definitions of the witnesses, of course, _but also the
definitions generated by the Compact compiler_.

If you are following the steps of this tutorial in order, then you
have already built the counter project. That means you have already
run the Compact compiler on `counter.compact`.

Look in the `managed/counter` subdirectory of the contract
sub-project. In it, you see four directories:

- `contract` - contains files defining the TypeScript/JavaScript API for the contract
- `zkir` - contains the intermediate representations for the circuits
  defined in the contract
- `keys` - contains the prover and verifier keys for each circuit
  defined in the contract
- `compiler` - contains metadata about the contract, including the names of
  exported circuits and their argument and return types in JSON format

The counter contract defines only one circuit, `increment`, so there is
a single pair of prover and verifier key for `increment` in `keys`. The `zkir`
directory contains two files, `increment.bzkir` and `increment.zkir`. Respectively,
these files are the binary and JSON representations of the ZKIR of the `increment`
circuit.

Most of this generated content is not useful to examine, but you might
want to look at `managed/counter/contract/index.d.ts`. You will see
that it defines various types and functions that correspond directly
to the code in `counter.compact`. For example:

- The `Circuits` type for this contract includes an `increment`
  function.
- The `Ledger` type for this contract includes a `round` field,
  declared to be a JavaScript `bigint`.
- The `Witnesses` type for this contract is empty, because the
  contract declares no witnesses.

Notice that many of the types are parameterized over some type `T`,
representing the DApp's private state implementation, which is opaque
to the circuits and ledger types emitted by the compiler.

### Tests

Part 3 of the Midnight tutorial explores unit testing, so it will not
be discussed here, but you are free to examine the code in the
`contract/src/test` subdirectory. It defines just a few Jest tests to
exercise the contract in a simulation environment.

## The `counter-cli` subproject

All the interactive logic for the counter DApp's command-line
interface is exposed through `counter-cli/src/index.ts`. Before examining
that file, though, it may be useful to see how the whole DApp is
launched.

### Different configurations

There are four 'entry-point' files in the directory:

- `testnet-remote.ts` - the first way you ran the counter DApp, so that
  it uses a local proof server, but a remote Midnight node and a
  remote Midnight Indexer, both connected to TestNet
- `testnet-local.ts` - the second way you ran the counter DApp, if you
  tried the optional step of running your own TestNet node and indexer
- `testnet-remote-start-proof-server.ts` - the same configuration as
  `testnet-remote.ts`, but not assuming you already have a proof server
  running and instead starting one as part of the script
- `standalone.ts` - invokes a `DockerComposeEnvironment` that launches
  a proof server, Midnight node, and the Midnight Indexer, all disconnected
  from TestNet and running entirely locally, for unit testing.

If you look in `testnet-remote.ts`, you will see that it is very short:

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/testnet-remote.ts"
  language="typescript"
/>

and the other entry points are similar, because they rely on the
configurations defined in `config.ts`. Each of those configurations
is quite similar. For example, here is the one that says to connect
to the Midnight-hosted instances of a Midnight node and an indexer:

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/config.ts#L55-L64"
  language="typescript"
/>

The various subsystems are all configured for operation on Midnight TestNet.

Notice the `setNetworkId` call in the `TestnetRemoteConfig` constructor.
Many Midnight APIs and packages require the API consumer to explicitly specify
the network they are targeting via a network ID parameter. Providing such a parameter to
each API would be tedious and error-prone. Midnight.js provides the `setNetworkId` function
so that the user can specify the network they are targeting once and have the correct network
ID used everywhere.

### Generated types, instantiated

Recall that many of the types, such as `Contract`, in the source files
generated by the Compact compiler, are parameterized. Writing out the
instantiated forms of these types can become unwieldy, especially when
the type arguments will be the same, over and over. Thus, the
Midnight team often creates a short file defining instantiated versions
of some of these generated types and uses those instantiated versions
in the rest of the code.

You can see an example of this pattern in the file `common-types.ts`,
which defines types such as `CounterContract`, like this:

```tsx
export type CounterContract = Contract<
  CounterPrivateState,
  Witnesses<CounterPrivateState>
>;
```

### The Dapp

The two main files implementing our application are `counter-cli/src/cli.ts` and
`counter-cli/src/api.ts`. The former contains the main run loop of the application.
The latter contains convenience functions for interacting with the Midnight network.

To understand `counter-cli/src/cli.ts`, start at the end, looking at the `run` function. Ignoring the
startup and error-handling code, the core actions of the DApp are to

1. instantiate a wallet,
2. instantiate a collection of 'providers' for working with the contract, and
3. start the main user interaction loop.

#### Creating a wallet

If this DApp were running in a web browser, it would begin by
connecting to the browser's Lace wallet extension. Instead,
the counter DApp is running outside any web browser, so it
initializes a 'headless' wallet to be used for funding transactions.

Depending on the user's input in the interactive `buildWallet`
function, the DApp either prompts for a wallet seed or generates some
random bytes to serve as the seed. Either way, the flow eventually
reaches `buildWalletAndWaitForFunds` in `counter-cli/src/api.ts`.
Omitting the logging code, this function is as follows:

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/api.ts#L200-L311"
  language="typescript"
/>

The `WalletBuilder` class provides the main entry point into creating
a wallet: `buildFromSeed`. The wallet needs to know about the
indexer, the node, and the proof server, because it watches the ledger
for information about funds and transaction results (using the
indexer), submits transactions through the node, and calls on the
proof server to generate proofs that transactions are valid.

:::note Wallet SDK v4.0.0 Compatibility
The counter DApp uses `@midnight-ntwrk/wallet@4.0.0`, which introduces the following breaking changes:

- `WalletBuilder.buildFromSeed()` is **deprecated**. It still works, but will be removed in a future version. Use `WalletBuilder.build()` with a seed parameter instead.
- Wallet addresses and keys are returned in the new **Bech32m format** by default.
- The seed is no longer embedded in the serialized wallet state. You must explicitly pass the seed again when restoring a wallet.
  :::

Notice the `getZswapNetworkId` argument to `WalletBuilder.buildFromSeed`.
The `getZswapNetworkId` function is provided by Midnight.js. It retrieves
the current network ID (set by the `setNetworkId` call we have already seen)
and converts it to a format the wallet can understand.

After the wallet is started, the DApp pauses to wait for funds to
appear. You may find it instructive to look at the definition of
`waitForFunds` just above `buildWalletAndWaitForFunds` in the file.
The wallet's state appears in TypeScript as an observable stream, so
`waitForFunds` uses RxJS functions to watch for the wallet's balance
to be non-zero.

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/api.ts#L180-L198"
  language="typescript"
/>

Notice that the wallet's state includes information about the degree
to which it is synchronized with the total state of the blockchain.

Hypothetically, the wallet could track the balances of many different
tokens, so the code in `waitForFunds` asks specifically for the
`nativeToken` balance, meaning tDUST. Once the tDUST balance is
non-zero, the `waitForFunds` function returns, and the
`buildWalletAndWaitForFunds` function returns the wallet itself.

#### Providers

The Midnight programmatic interface to a smart contract is extremely
flexible and thus highly parameterized. For example, a DApp developer
might implement a new kind of private state storage or interpose some
kind of balance-checking functionality between the contract and a
wallet. The way that the Midnight libraries handle all this
functional parameterization is through a JavaScript object with fields
for different types of _providers_.

Of course, most of the time, a standard implementation for each type
of provider is what you want, and the Midnight libraries define these
for you. All you have to specify is some information about where to
find the indexer, the proof server, and so on.

The `counter-cli/src/api.ts` file defines a function `configureProviders` that
returns an object containing the providers our application will need to interact
with the network.

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/api.ts#L322-L334"
  language="typescript"
/>

Back in the `run` function, you can see where the counter DApp creates
the providers.

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/cli.ts#L152"
  language="typescript"
/>

The exception to the pattern of using standard implementations for the
providers is seen in the value provided for the `walletProvider` and
`midnightProvider` fields.

- The wallet provider specifies the wallet's public key and defines a
  function for balancing transactions (that is, attaching to the
  transaction an appropriate amount of 'fuel' to run the transaction): `balanceTx`.
- The Midnight provider defines a function for submitting transactions
  to the Midnight network: `submitTx`.

The counter DApp defines a single object to satisfy both provider
interfaces:

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/api.ts#L123-L142"
  language="typescript"
/>

You can read more about what happens when a transaction is
balanced and submitted to the network in the portion of the Midnight
developer documentation that describes [how Midnight works](/docs/develop/how-midnight-works/index.mdx).

### Working with a contract

The bulk of the counter DApp uses input from the user to direct its
actions, which include:

- deploying a new counter contract
- joining an existing counter contract
- calling the `increment` circuit on the contract
- examining the ledger state associated with the contract.

With the wallet and providers objects in hand, these actions
are performed by calling Midnight library functions. For example, the
call to find and join an existing contract can be seen in the `join`
function, near the top of `counter-cli/src/api.ts. The relevant call is:

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/api.ts#L78-L83"
  language="typescript"
/>

where `counterContractInstance` is simply a `Contract` object defined in the `index.ts` file
in the generated code.

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/api.ts#L72"
  language="typescript"
/>

### Submitting a Transaction

Using the generated code and the Midnight.js library, creating and submitting an
`increment` transaction becomes a simple function call:

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/api.ts#L104"
  language="typescript"
/>

The `callTx` access on the `counterContract` object indicates that we want to create a call
transaction for the counter contract. The `increment()` call creates and submits a call transaction for the `increment`
circuit. After the transaction is submitted and included in the blockchain, the result is stored in `finalizedTxData`.public, which contains additional public information about the transaction.

### Viewing Contract State

The `publicDataProvider` in the `providers` object can be used to query for information about the blockchain.
To view the current value of `round` defined in the counter contract, we can query the `publicDataProvider`
and convert the result to a JavaScript object using the `ledger` function generated for the counter contract
by the compiler.

<CodeFromGithub
  url="https://github.com/midnightntwrk/example-counter/blob/main/counter-cli/src/api.ts#L59-L70"
  language="typescript"
/>

At this point, you have seen enough to be able to read and understand the gist of the
`counter-cli/src/api.ts` and `counter-cli/src/cli.ts` files.

## Summary

This ends part 2 of the Midnight developer tutorial.

1. You have installed the tools needed to be a Midnight developer.
2. You have learned how to build a Midnight DApp from source and run it.
3. You have learned how to run your own Midnight node and the Midnight Indexer.
4. You have seen the Compact and TypeScript code for a simple DApp.

Part 3 of the tutorial invites you to engage more deeply with
the process of creating a Midnight DApp, writing some of the code
yourself. It also introduces you to Midnight's ability to shield
private data.

---

## sidebar_label: "Midnight examples repository"

# Midnight examples repository

1. Clone the [Counter Dapp repository](https://github.com/midnightntwrk/example-counter).
2. Go to the root level of the repository.

```shell
cd example-counter
```

3. Run `npm install` in the root folder to install all the necessary packages.

## Configure Yarn to download Midnight libraries

You will be using Yarn to build Midnight example DApps. An easy way
to install Yarn, now that you have dependencies configured, is with the
`corepack` command:

```shell
corepack enable
```

This succeeds silently, but you should see version information now if
you type:

```shell
yarn --version
```

You should see a version number printed, such as `4.1.0`.

The best way to verify this step is to use Yarn to pull the Midnight examples dependencies. In the top level of your `example-counter` repository, simply invoke Yarn with no parameters:

```shell
yarn
```

You should see a lot of output, but no errors, although there may be some warnings. For example, the last line of output may say `Done with warnings`.

## Configure the Compact compiler path

If you did not add `COMPACT_HOME` to your shell profile after
installing the compiler, or if you have not restarted your shell since
then, execute the following command:

```shell
export COMPACT_HOME='<absolute path to compact directory>'
```

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

---

# Creating a new DApp

In the third part of the Midnight developer tutorial, you will:

1. Write a contract that works with both public and private data
2. Fill in the missing parts of the DApp code, to create a complete and working DApp
3. Run a Midnight node that is _disconnected_ from the Midnight Testnet, for testing purposes
4. Switch from a test configuration to a production configuration and
   use your new DApp on Testnet.

The example throughout part 3 is still simple, but more realistic in
its scope than the counter DApp of part 2. Most importantly, it
relies on Midnight's ability to use private data in public contracts,
while shielding the private data by keeping it entirely local.

Finally, we discuss some additional steps that developers should take in a
serious deployment to ensure the longevity of their DApp.

# Prerequisites for part 3

There are no additional prerequisite components to be installed for
part 3 of the tutorial. Instead, you will learn to reconfigure the
'headless' wallet and local Midnight node, which you installed in part
2, so that they operate in a disconnected mode for offline testing.

---

## sidebar_label: "Bulletin board contract"

# Bulletin board contract

The [`example-bboard`](https://github.com/midnightntwrk/example-bboard) repository contains separate subdirectories for the contract and user interaction code, similar to the counter DApp. The bulletin board DApp demonstrates an additional separation between user interface code and the underlying application logic. This separation enables both command-line and web-based versions of the application.

Directory structure:

- `contract` - Contains the Compact source for the bulletin board contract and associated TypeScript
- `api` - Contains TypeScript source implementing core DApp behavior (posting messages, taking them down), depends on `contract` code
- `bboard-cli` - Contains the command-line interface for the text-based DApp, depends on both `contract` and `api` code

:::tip
View and edit the contract using the [Visual Studio Code extension for Compact](/docs/develop/tutorial/2-building/index.mdx#optional-visual-studio-code-vscode-extension-for-compact) for syntax highlighting and auto-completion.
:::

## Contract design components

Creating a Midnight contract for the bulletin board requires identifying:

- The components of the contract's public state
- The visible operations that can be performed on the contract
- The private data and operations, used by visible operations in provably valid ways but not shared publicly

The public state and transaction history appear on the Midnight blockchain ledger for anyone to verify. Private data remains on the DApp user's computer.

## Public ledger state on the blockchain

The bulletin board's public ledger state consists of the following values:

- A state: vacant or occupied
- A message
- A counter identifying the current post
- A public token produced by the post author, from which their private identity cannot be derived

The counter corresponds to the "that message" constraint mentioned previously. When its value is 15, it indicates "The current message is the 15th post." The counter increments when the board becomes vacant (not when occupied), marking the point when the board no longer holds the previous numbered post.

The public token is a non-reversible hash of the owner's identity and posting sequence number. While no one can determine the poster's identity from the token, the post author can reliably derive that token again for identity verification.

The ledger state specification in Midnight's Compact contract language:

```compact
import CompactStandardLibrary as std;

export enum STATE {
  VACANT,
  OCCUPIED,
}

export ledger bboard {
  // Board's current vacant or occupied state
  state: STATE;
  // Counter tracking the message's sequence number on the board
  counter: std.Counter<Unsigned>;
  // The message currently displayed on board
  message: Opaque;
  // Who owns the current message on the board
  owner: std.Maybe<Bytes<32>>;

  constructor() {
    state = STATE.VACANT;
  }
}
```

Type system notes:

- Compact supports declaring new types, such as the enumeration type encoding the board's vacant or occupied state. The `export` modifier enables the Compact compiler to generate TypeScript representations for the enumeration type and its values.
- Ledger fields with Compact types (`STATE`, `Maybe`, and `Bytes`) represent mutable cells in the ledger, updatable by circuits.
- The ledger's `Counter` type (automatically initialized to zero) can be incremented by circuits.
- The builtin `Opaque` type describes values whose internal structure is irrelevant to the contract.
- The standard library's `Maybe` type describes values that may be absent, created using `some` or `none` constructors.
- Owner identity tokens are 256-bit hashes occupying 32 bytes.
- The standard library `CompactStandardLibrary` contains `Maybe`, `some`, `none`, and `Counter` (`Opaque` and `Bytes` are builtin types).

The contract doesn't explicitly initialize the `owner` field during ledger construction because its value isn't meaningful yet. Uninitialized ledger fields receive the default value of their type if one exists.

## Enforce the contract with circuits

Users must prove they satisfied contract rules when making bulletin board changes. They submit proofs of rule compliance that observers can quickly verify. These proofs, verifiable without access to the enabling data, are called zero-knowledge proofs and are implemented using mathematical circuits.

Zero-knowledge proof concepts date to the 1980s. Recent developments advance automatic proof generation and verification without human intervention, combined with public blockchains.

Midnight's unique contribution makes zero-knowledge-based smart contracts and supporting circuits accessible to general programmers.

The `post` operation as a Compact `circuit` definition enforces the bulletin board's first rule: posting occurs only when the board is vacant.

```compact
export circuit post(message: Opaque): Void {
  assert(ledger.state == STATE.VACANT, "can post only to a vacant board");
  ledger.state = STATE.OCCUPIED;
  ledger.message = message;
  ledger.owner = std.some(disclose(publicKey(ledger.counter.value, localSecretKey())));
}
```

A `circuit` definition resembles a function definition with input parameters and a return value. The current ledger state is implicitly available. The `export` modifier enables calling the `post` circuit from TypeScript.

The `assert` statement establishes enforced contractual obligations by checking Boolean expressions. False expressions abort the transaction with the specified failure message. This `assert` checks for a vacant board before posting (rule 1).

The generated "public key" written to the ledger's `owner` field derives from hashing a string containing the post sequence number and the user's secret key (not transmitted over the network). The code calls a helper circuit `publicKey`:

```compact
export circuit publicKey(counter: Unsigned, secretKey: Bytes<32>): Bytes<32> {
  return std.persistentHash("" + counter, secretKey);
}
```

Implementation notes:

- The `persistentHash` function comes from Compact's standard library.
- Helper circuits typically aren't exported since TypeScript doesn't need to call them. Here, `publicKey` is exported for debugging value logging in the DApp.
- Despite the name `publicKey`, the return value isn't truly one side of a public key cryptography key pair. Zero-knowledge circuits generalize public key cryptography concepts. The result serves the same role as a public key, hence the evocative naming.

## Access private state

Retrieving the secret key needed by the `post` circuit requires a special function type. The function `localSecretKey` cannot be another circuit because circuit return values are publicly verifiable, and this value must never appear in the ledger.

This function type is called a _witness_. Witness functions provide the API to the contract's private state maintained by individual DApps. The contract declares the witness's existence; the DApp implements it.

Declaration in the contract:

```compact
witness localSecretKey(): Bytes<32>;
```

Witness return values are presumed private. The Compact compiler tracks them through the program and prevents public ledger state leakage. In the `post` circuit, `localSecretKey()` results are presumed private. This value passed to `publicKey` makes that result also presumed private. The compiler signals errors if written to public ledger state. However, hashing the owner's identity with the sequence counter won't leak identity. Wrapping the public key value in `disclose` indicates intended disclosure.

The `takeDown` circuit enforces the rule that only the current post owner can remove it. The circuit also checks that the board isn't already vacant:

```compact
export circuit takeDown(): Opaque {
  assert(ledger.state == STATE.OCCUPIED, "can take down only from an occupied board");
  ledger.state = STATE.VACANT;
  ledger.counter.increment();
  let thisOwner = ledger.owner.unwrap();
  assert(publicKey(ledger.counter.value - 1u, localSecretKey()) == thisOwner,
    "only the owner can take down the current post");
  ledger.owner = std.none();
  return ledger.message;
}
```

This circuit returns the removed message, demonstrating that public circuits can return values.

DApp `takeDown` transaction submissions to Midnight don't include private data for other participants to check the second `assert`. The Compact compiler doesn't require explicit `disclose` for `publicKey` here. The transaction includes verifiable proof of each `assert` check. The compiler generates all necessary material behind the scenes without requiring explicit proof generation and transmission code.

## Compile the contract

Complete contract:

```compact
import CompactStandardLibrary as std;

export enum STATE {
  VACANT,
  OCCUPIED,
}

export ledger bboard {
  state: STATE;
  counter: std.Counter<Unsigned>;
  message: Opaque;
  owner: std.Maybe<Bytes<32>>;

  constructor() {
    state = STATE.VACANT;
  }
}

witness localSecretKey(): Bytes<32>;

export circuit post(message: Opaque): Void {
  assert(ledger.state == STATE.VACANT, "can post only to a vacant board");
  ledger.state = STATE.OCCUPIED;
  ledger.message = message;
  ledger.owner = std.some(disclose(publicKey(ledger.counter.value, localSecretKey())));
}

export circuit takeDown(): Opaque {
  assert(ledger.state == STATE.OCCUPIED, "can take down only from an occupied board");
  ledger.state = STATE.VACANT;
  ledger.counter.increment();
  let thisOwner = ledger.owner.unwrap();
  assert(publicKey(ledger.counter.value - 1u, localSecretKey()) == thisOwner,
    "only the owner can take down the current post");
  ledger.owner = std.none();
  return ledger.message;
}

export circuit publicKey(counter: Unsigned, secretKey: Bytes<32>): Bytes<32> {
  return std.persistentHash("" + counter, secretKey);
}
```

### Install and use the Compact compiler

Install the Compact developer tools:

```shell
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
```

This command downloads and runs an installation script. Follow the instructions to add the binary directory to your `PATH` environment variable.

After adding to `PATH`, update to the latest toolchain:

```shell
compact update
```

### Compile the contract

The `contract` subdirectory contains a build script for compilation, but manual compilation provides instructional value.

Navigate to the `contract` directory and compile `bboard.compact`:

```shell
compact compile src/bboard.compact src/managed/bboard
```

The compiler displays circuit complexity messages for each public circuit (`post`, `takeDown`, and `publicKey`). Error messages indicate code mistakes requiring correction. Contact the Midnight Developer Relations team or fellow developers on Discord for assistance.

The generated TypeScript API appears in `src/managed/bboard/contract/index.d.cts`. The DApp uses this API for contract deployment and circuit calls.

---

## sidebar_label: "Bulletin board DApp"

Explore the TypeScript code for a working bulletin board DApp. The complete codebase is available for examination, including the contract interaction logic and private state management.

## Prerequisites

The contract must exist in the `contract/src` subdirectory. Compile the contract to generate the TypeScript API and related files in the `managed` subdirectory.

:::note
The Compact compiler generates the TypeScript API from your Compact contract code. This compilation step produces type-safe interfaces for contract interaction.
:::

The TypeScript code spans three directories:

- `contract/src` - Contract definitions and witness functions
- `api/src` - Application abstractions
- `bboard-cli/src` - Main application run loop

Key files for review:

- `contract/src/witnesses.ts` - Private state and witness function definitions
- `api/src/index.ts` - Application interface implementation

## Define the private state

The blockchain stores public contract state visible to all users. Private state remains local to each DApp instance and varies per user. Contracts declare types for private state access functions but don't define the functions or specify the private state structure. The generated contract API parameterizes certain components by the private state type.

Define an interface or type alias for the private state as a best practice.

The bulletin board's private state contains the user's secret key, which remains constant throughout the application lifecycle. The `localSecretKey()` witness retrieves this value.

The bulletin board contract declares the secret key as a byte array, corresponding to TypeScript's `Uint8Array`. Define `BBoardPrivateState` with a `secretKey` property:

```typescript
// Generated by the Compact compiler, this type definition enables type-safe private state handling
export type BBoardPrivateState = {
  secretKey: Uint8Array;
};
```

The following helper function creates `BBoardPrivateState` objects:

```typescript
export function createBBoardPrivateState(
  secretKey: Uint8Array
): BBoardPrivateState {
  return { secretKey };
}
```

## Initialize the private oracle

Zero-knowledge proof systems use the term _oracle_ for components that access private state. This terminology appears throughout the Midnight API and documentation.

The `witnesses` object requires a property or method for each declared witness function. The `bboard.compact` contract declares one witness function: `localSecretKey`.

### Function structure

The function signature contains:

- **Parameter**: `WitnessContext` - Contains ledger state, private state, and contract address
- **Returns**: Tuple containing:
  - New private oracle state
  - Value matching the witness function's declared return type

The `WitnessContext<L, PS>` type includes:

- `ledger: L`
- `privateState: PS`
- `contractAddress: string`

This implementation uses:

- `Ledger` type from the Compact compiler-generated API
- `BBoardPrivateState` from Exercise 1

### Implementation

The `localSecretKey` function returns the unchanged private state (since it doesn't modify state) and the secret key value for contract hash generation and verification:

```typescript
// This witness function integrates with the Compact compiler-generated contract API
export const witnesses = createBBoardWitnesses<BBoardPrivateState>({
  localSecretKey: ({ privateState }) => {
    return [privateState, privateState.secretKey];
  },
});
```

:::important
Never mutate private state in place. Return new state values from witness functions.
:::

:::caution
Avoid global variables for private state. Always use the value passed to witness functions.
:::

## Invoke the post circuit

The `api/src/index.ts` file defines `BBoardAPI`, the application interface for deployed bulletin board contracts.

### Post method implementation

The `post` method submits new messages to the bulletin board. This asynchronous method belongs to the `BBoardAPI` class, initialized with a `DeployedBBoardContract`.

`DeployedBBoardContract` aliases [`FoundContract`](../../reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/FoundContract), Midnight.js's abstraction for deployed smart contracts. The application uses `FoundContract` rather than `DeployedContract` because it doesn't require private deployment metadata.

`FoundContract` exposes `callTx`, providing functions for each contract circuit. These functions create and submit transactions.

The bulletin board's `post` method invokes the circuit:

```typescript
// The Compact compiler-generated API provides type-safe circuit invocation
await this.deployedContract.callTx.post([message]);
```

Posting to non-empty boards causes transaction failure and throws an exception. The current implementation propagates exceptions to the main `run` function, causing the DApp to exit. Consider adding try/catch blocks for improved error handling after testing.

## Invoke the take-down circuit

The `takeDown` function follows the `post` method in `api/src/index.ts`.

This method invokes the contract's `takeDown` circuit using the deployed contract's `callTx` property:

```typescript
// The Compact compiler ensures type safety for circuit parameters
await this.deployedContract.callTx.takeDown([]);
```

## Deploy a new bulletin board contract

Contract circuit invocation and transaction submission require minimal code. Contract deployment requires more setup but remains concise.

### Deployment function

The `deploy` function in `api/src/index.ts` contains the `deployContract` call with all required arguments.

`deployContract` requires two arguments:

- **MidnightProviders object**: Contains all necessary provider implementations
- **DeployContractOptions object**: Contains deployment configuration parameters

For bulletin board contracts, `DeployContractOptions` requires:

- `privateStateKey`: Key for storing private state in the `PrivateStateProvider`
- `contract`: `Contract` object containing executable JavaScript (generated by the Compact compiler)
- `initialPrivateState`: Initial private state matching the type stored under `privateStateKey`

### Configuration

#### Private state key

```typescript
privateStateKey: "bboard-private-state";
```

Unique identifier for retrieving user private state from the configured provider. The system generates and stores new state under this key if none exists.

#### Contract instance

```typescript
contract: bboardContractInstance;
```

Defined as:

```typescript
// The Compact compiler generates the Contract class with witness function integration
export const bboardContractInstance = new Contract(witnesses);
```

Creates a `Contract` instance (generated by the Compact compiler) with the witness functions defined earlier.

#### Initial private state

```typescript
initialPrivateState: await getPrivateState(providers.privateStateProvider);
```

The `getPrivateState` method retrieves existing private state or generates new state using 32 random bytes, ensuring consistent and valid private state access.

### Complete deployment call

```typescript
// The Compact compiler-generated Contract class enables type-safe deployment
const deployedContract = await deployContract(providers, {
  privateStateKey: "bboard-private-state",
  contract: bboardContractInstance,
  initialPrivateState: await getPrivateState(providers.privateStateProvider),
});
```

This minimal code deploys a complete contract to the Midnight blockchain.

### Join existing contracts

The `join` function (below `deploy`) contains similar code for joining existing contracts. Compare both implementations to understand the differences.

### Reference documentation

Explore the Midnight.js reference documentation for library functions:

- [`deployContract`](../../reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/functions/deployContract)
- [`findDeployedContract`](../../reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/functions/findDeployedContract)

## Compile and run the DApp

Navigate to the `example-bboard` directory (containing `contract`, `api`, and `bboard-cli`) and run:

```shell
npx turbo build
```

:::note
The build process uses the Compact compiler output from the `managed` directory to ensure type safety throughout the application.
:::

### Troubleshooting: ERR_UNSUPPORTED_DIR_IMPORT

This Node.js error occurs due to environment caching after modifying `.zshrc`, `.bashrc`, or changing Node versions with NVM.

**Resolution steps:**

1. Open a new terminal window (don't rely on `source ~/.zshrc`)
2. Verify Node version: `nvm use 18`
3. Clear cached modules:
   ```bash
   rm -rf node_modules/.cache
   ```

This environment-related issue affects certain ESM-style imports when the Node.js setup becomes stale.

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "Midnight test environment"

---

# Midnight test environment

In the preceding parts of the tutorial, you ran DApps that were
already complete and tested. In this part, however, you have been
writing portions of the DApp yourself, and you probably want to try
out your work _before_ deploying the DApp to the Midnight network.

The Midnight team has already created a compose file for Docker that
runs a proof server, Midnight node, and Midnight Indexer locally,
configured so that they run disconnected from the Midnight network.
In effect, the Midnight node acts as if it is its own isolated
Midnight network. This allows you to test contracts and DApps
entirely on your own system, before deploying them to the real
network.

If you want to review the details, you can see the Docker compose
definition in this file:

```
example-bboard/bboard-cli/standalone.yml
```

The important part is the environment variable `CFG_PRESET` set to
`dev` in `node` definition. That tells the node to run standalone
without connecting to any other nodes.

Before running this test configuration, you must stop any existing
proof server, indexer, and node. Then, if you want, you can start and
stop the test configuration to verify that it works.

Do not leave the test configuration running in Docker for the next
steps, though, because you will test the bulletin board DApp by
launching it with a command that starts and stops the whole
`standalone.yml` configuration automatically as part of running the
DApp.

## Run the DApp in standalone mode

In the `example-bboard/bboard-cli` directory, launch the DApp with:

```shell
yarn standalone
```

After verifying that the latest images of the proof server, indexer,
and Midnight node are pulled from the Midnight image server, the DApp
will launch the Docker configuration in `standalone.yml` and wait
for it to be ready.

Then, the DApp will start in standalone mode, not prompting to create
or restore a wallet, but instead, creating a new wallet with tDUST
that is valid only for such offline testing.

:::note Wallet SDK v4.0.0+ Behavior in Standalone Mode
In standalone mode, the DApp uses `@midnight-ntwrk/wallet@4.0.0` to create a disposable wallet. This SDK version introduces important changes:

- Wallets are **always created from a seed**.
- Wallet addresses are shown in **Bech32m format** by default. If you need compatibility with legacy tools, convert them using [`@midnight-ntwrk/wallet-sdk-address-format`](https://www.npmjs.com/package/@midnight-ntwrk/wallet-sdk-address-format).
- Wallet state is no longer sufficient for restoration — the **seed must be preserved** even in offline tests if you want reproducibility.
  :::

When the wallet is ready, DApp asks whether it should join an existing
contract or deploy a new one. There is no existing contract to join,
so deploy one. Then, explore the possibilities with the DApp, posting
a message and examining the public and private state.

When you exit the DApp, the Docker containers should stop be and be
cleaned up automatically.

## Run the DApp connected to the Testnet

When you are ready to try out your DApp on the Midnight Testnet, be
sure you have not left it running and that your standalone Docker
configuration has exited. Then,
[start your proof server](../using/proof-server) again. When it is
ready, start the DApp with this command:

```shell
yarn testnet-remote
```

This time, you will need real tDUST, so either create a new wallet and
transfer some tDUST to it from your [Lace wallet](/docs/develop/tutorial/1-using/chrome-ext.mdx),
or look back
at the logs from your experiments with the counter DApp in part 2 to
find the seed for your headless wallet:

```
counter/counter-cli/logs/testnet
```

Once the DApp has found some tDUST in your wallet, it will proceed and
allow you to deploy your bulletin board to Testnet.

## Summary

Have fun playing with the bulletin board DApp. If you are ambitious,
you could create a separate DApp to watch a bulletin board, showing
the messages that are posted and saying when they are taken down. The
code in the `displayLedgerState` function in `bboard-cli/src/index.ts`
will help you get started. You could also share the address of your
bulletin board contract with a friend and see each other's posted
messages.

Congratulations! You have created a working DApp around a non-trivial
Midnight contract, with real rules that are enforced automatically.
You have written parts of the DApp yourself, and you have learned to
test it offline.

At this point, with the help of the reference documentation, you know
enough to begin creating your own command-line contracts and DApps.
Later parts of this developer tutorial will show you how to add a web
UI for your DApps and connect them to the Lace wallet.

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "Bulletin board scenario"

---

# Bulletin board scenario

Imagine an old-fashioned cork bulletin board on the wall in an office
hallway. This is a small bulletin board, with room for just a single
piece of paper to be tacked up on it. Here are the office rules for
this bulletin board:

1. Anyone can post a message on the board when it is vacant.
2. Once someone has posted a message, no one else can take it down.
   Only the person who posted that message may remove it.

Be sure you understand these rules. The following pages will refer
back to them as 'rule 1' and 'rule 2'. You can probably imagine
extending them to include content restrictions or time limits on
posts, but they are kept intentionally simple for this tutorial.

What does it look like to implement an online version of this bulletin
board? A globally shared space where anyone can update a message is
easy to create, but how to enforce the rules?

Rule 1 can be enforced using only the public state of the bulletin
board: if it's empty, allow a new message to be posted, but if it's
occupied, reject attempts to post a message.

Rule 2 is more complicated, because it requires that the identity of
the user attempting to remove a message be verified. (In fact,
there's another constraint hidden in the English statement of the rule
when it refers to the person who 'posted _that_ message.' This implies
that the user wanting to take down a post is able to prove not only
their identity, but also that they tacked up that specific post.)

One obvious way to enforce rule 2 is to make users 'log in' to the
bulletin board system, so that the system can authenticate their
identities. This approach requires users to transmit evidence of
their identities across the Internet to the bulletin board server,
usually involving some sort of secret shared between each user and the
server, which the server can verify.

Is there a better way? With Midnight, yes there is. You can
contractually obligate anyone who wants to remove a message from the
bulletin board to validate _for themselves, on their own computer_
that they posted it. Midnight can safely and reliably enforce the
terms of the contract by requiring a machine-checkable proof that the
validation has occurred, without requiring the private evidence of the
user's identity to be transmitted across the Internet.

---

SPDX-License-Identifier: Apache-2.0
copyright: This file is part of midnight-docs. Copyright (C) 2025 Midnight Foundation. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
sidebar_label: "DApp updatability"

---

# DApp updatability

Updating code in a decentralized environment is challenging, because producing
an update is typically a centralized process, and this can be employed
maliciously. It is however often necessary to have some path to changing
deployed contracts and DApps, and Midnight provides this through _Contract
Maintenance Authorities_ (CMAs).

By default, as has been the case through this tutorial, a maintenance authority
is empty, meaning no user is able to perform an update to the corresponding
contract. At deploy-time, the deployer can instead nominate a set of public
keys, and specify a threshold for how many of these public keys need to come together to
sign an update, to allow updatability of this contract. This can be used to
decentralize the power to update to a group, which needs to agree and sign off
on updates jointly, or simply to have a single owner control a contract.

:::warning

While Midnight does not require a deployed contract to nominate a CMA, we
strongly advise DApp authors to be aware of the trade-offs involved before
making this decision.

:::

## Why should you care?

Even if your are familiar with updatability in other blockchain ecosystems,
there is an important difference for Midnight that may affect what you think is
right for your DApp. In most ecosystems, a deployed contract is guaranteed to
run as deployed indefinitely, and this lessens the need for updatability. In
Midnight, as contracts _are_ in part zero-knowledge proofs, any breaking update
to our proof system – including security updates – may require contracts to
update to the new proof system. Put differently, old contracts _may be
disabled_ after system upgrades in the future.

This is especially true prior to mainnet, during which time we will not provide
any support for prior versions of our proof system. At or before mainnet launch
we will refine this support policy. Put differently: We will, with notice,
remove support for old deployments of contracts from Midnight. Updatable
contracts will be able to migrate, but non-upgradable ones will not, by
definition. Refer to the [release compatibility matrix](../../../relnotes/support-matrix) for the complete versions overview.

:::danger

Non-upgradable contracts should plan to allow users to withdraw their funds in
a timely manner (in less than a week) to prevent loss of user funds. Upgradable
contracts should make a commitment to upgrade timelines, or similarly provide a
path to withdraw funds in case the contract is not upgraded.

:::

At this time, Midnight's APIs are tooled only towards one-user authorities,
although the underlying system can cope with arbitrary party configurations.

## Capabilities of a maintenance authority

A contract maintenance authority (CMA) is able to perform various privileged actions
to change a contract after deployment. These make use of a 'verifier key
version', a combined version of proving system and the onchain runtime. A
contract can have multiple active verifier key versions at the same time, and
can have keys registered for each of them. This allows supporting transitions
between versions, and in the future may be used to provide long-term support
for some verifier key versions. A contract maintenance authority can perform
the following privileged actions:

- Change the CMA associated with this contract – this CMA then succeeds the
  current one; this can be used to relinquish control.
- Remove a verifier key (of a specific version) from the contract – this will
  reject future transactions that attempt to use this operation with this
  specific verifier key version. The key removed must exist.
- Add a new verifier key of a specific version – this adds new functionality to
  a contract, or re-exports existing functionality with a new verifier key
  version. A key may not already exist to insert it, it must first be removed.

:::info

Removing and re-adding a verifier key can be used to change the implementation
of a circuit, modifying its behaviour. Be aware that this is a very powerful
capability!

:::

Maintenance authorities can make changes by signing a sequence of the above
'single updates' into a combined 'maintenance update'. Currently, maintenance
updates take effect immediately, although this functionality may be refined
over time.

## How to operate a maintenance authority

Maintaining a maintenance authority introduces three new things for a DApp developer to manage:

1. They need to generate and store key pairs for the authority
2. They need to modify deployment to add the authority
3. They need to provide an interface for the authority to produce and sign updates

The initial contract authority of a contract being deployed can be specified by providing a value for
[`signingKey`](/develop/reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/DeployContractOptions)
in
[`DeployContractOptions`](/develop/reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/DeployContractOptions).
The initial signing key can be sampled with
[`sampleSigningKey`](/develop/reference/midnight-api/compact-runtime/functions/sampleSigningKey).
Note that the same CMA can be used in multiple contracts by specifying the same
signing key for different deployments.

A deployed contract's circuits can be updated using the
[`DeployedContract`](/develop/reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/DeployedContract)
object's
[`circuitMaintenanceTx`](/develop/reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/FoundContract#circuitmaintenancetx)
property, which contains one
[`CircuitMaintenanceTxInterface`](/develop/reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/CircuitMaintenanceTxInterface)
for each circuit defined on the contract. This allows inserting new verifier keys and removing existing verifier keys with
[`insertVerifierKey`](/develop/reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/CircuitMaintenanceTxInterface#insertverifierkey)
and
[`removeVerifierKey`](/develop/reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/CircuitMaintenanceTxInterface#removeverifierkey)
respectively.
Similarly, a deployed contract's maintenance authority can be updated using the
[`DeployedContract`](/develop/reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/DeployedContract)'s
[`contractMaintenanceTx`](/develop/reference/midnight-api/midnight-js/@midnight-ntwrk/midnight-js-contracts/type-aliases/FoundContract#contractmaintenancetx)
property. For example, `deployedContract.foo.insertVerifierKey(key)`
inserts the verifier key `key` for the `foo` circuit in the deployed contract
`deployedContract`.
