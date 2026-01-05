Module 5: Developing on Midnight
Introduction
Midnight is a next-generation blockchain platform designed to provide data protection, privacy, and security while enabling businesses and developers to build decentralized applications (DApps) without exposing sensitive information. Unlike traditional blockchains that operate with full transparency, Midnight integrates Zero-Knowledge Proofs (ZKPs) to allow selective disclosure, meaning users can prove information validity without revealing underlying data.


This module will guide you through the fundamentals of developing on Midnight, focusing on its architecture, development environment setup, and the Compact framework for smart contract development.

Learning Objectives
By the end of this module, you will be able to:

Understand Midnight’s architecture and privacy features.
Set up a development environment for writing and deploying Midnight applications.
Learn the basics of Compact, Midnight’s smart contract framework.
Midnight’s Architecture and Privacy Features
Midnight’s architecture is built to make decentralized application (DApp) development accessible across a wide range of devices, from high-performance servers to everyday mobile phones. As long as the device supports a modern web browser, it can run a Midnight DApp. However, many of Midnight’s privacy-preserving capabilities, such as identity protection and confidential transactions, require advanced cryptographic computations. To balance accessibility with strong security guarantees, Midnight integrates Zero-Knowledge Proofs (ZKPs) and optimizes its architecture by separating lightweight application logic from computationally intensive cryptographic operations.

Midnight HLA

The Core of Midnight’s Smart Contract Development
At the heart of this architecture is Compact, Midnight’s domain-specific language for smart contract development. When developers write smart contracts in Compact, the compiler outputs both JavaScript/TypeScript API definitions for the DApp and the cryptographic materials needed to generate ZK proofs. These outputs allow developers to build frontends that interface with Midnight’s privacy infrastructure, ensuring that applications can process transactions and validate user data without exposing sensitive information. Importantly, the Compact compiler runs only on the developer’s system, ensuring that private logic and data remain under local control during development.

Security Model
Midnight’s security model is built upon zkSNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge), an advanced form of ZKP that enables one party to prove a statement’s validity without revealing any additional information beyond the claim itself. zkSNARKs allow Midnight to facilitate secure transactions, privacy-preserving identity verification, and confidential data exchanges without exposing user identities or transaction details. These cryptographic proofs ensure data integrity and enable businesses to comply with privacy regulations while maintaining full transparency where necessary.

To enforce privacy, Midnight’s proof server is responsible for generating these zero-knowledge proofs. Any sensitive information used in a transaction is sent only to the proof server, never to the blockchain or intermediary services. This architecture ensures that user data remains protected while allowing DApps to prove facts—such as ownership of an asset or eligibility for a service—without disclosing underlying information.

Midnight’s modular design supports multiple deployment models, giving users control over their data exposure. A user could run all necessary components locally, ensuring that nothing leaves their device. Alternatively, they might rely on a cloud-based proof server while keeping private data encrypted. The system also allows for a hybrid approach where private proofs are generated locally, while transaction validation happens in a distributed, decentralized manner. This flexibility ensures that Midnight can cater to various use cases, from fully private environments to enterprise-scale applications requiring selective disclosure.

🔒 Access Restricted
You must log in with GitHub to access this section.

Login with GitHub
Development Environment for Writing and Deploying Midnight Applications
Midnight provides a full suite of tools for building privacy-preserving decentralized applications. This chapter will walk you through the process of preparing your system to interact with the Midnight Testnet—from setting up the core components to running your first transaction. You'll begin by configuring your environment to act as a DApp user, then progressively install the tools necessary to build and deploy your own Midnight smart contracts.

Interacting with Midnight as a User
Before writing or deploying smart contracts, you’ll begin by becoming a user of the Midnight network. This involves setting up the Lace wallet, installing a local proof server, and acquiring tDUST (test tokens) to interact with the blockchain.

You’ll need:

A recent version of Docker installed and running.
The Google Chrome browser (version 119+), as only Chrome is fully supported for wallet extension integration.
The Lace Wallet Chrome extension
Once Docker is ready, confirm it’s working by running:

docker --version

You should also verify access to Midnight’s Docker images:

docker search midnightnetwork

Install the Lace Wallet
Download the latest version of the Lace Wallet from here.
Pin the extension for easier access.
Start the wallet and create a new testnet wallet. You'll set a password and generate a recovery phrase. You’ll then be prompted to configure wallet settings to connect to:

The testnet version of the Midnight network.
A node endpoint.
The indexer.
Your local proof server (default: localhost:6300).
Once setup is complete, your wallet is ready, but you’ll start with an empty balance.

Acquire Test Tokens (tDUST)
To make transactions on the testnet, you'll need tDUST. Get some by visiting the Midnight Testnet Faucet, entering your wallet address, and requesting tokens. This will fund your wallet with free, non-transferable testnet tokens, allowing you to pay for smart contract execution.

Run the Proof Server Locally
Midnight’s privacy guarantees are enforced by a local proof server that handles zero-knowledge proof generation. The proof server never connects to the internet or sends data to third-party services. Its sole role is to receive private transaction data from your wallet and return zkSNARK proofs.

Install and run the proof server via Docker:

docker pull midnightnetwork/proof-server:latest
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'

You should see logs indicating the server is targeting the Testnet. Keep this running to support proof generation for your wallet transactions.

Building Midnight Applications
Now that you’re connected to the Midnight Testnet, it’s time to set up your environment to write and deploy real Midnight smart contracts.

First, install Node.js using NVM:

nvm install 18 --lts

You’ll also need:

The Midnight Compact compiler
The Midnight TypeScript libraries (available on npm)
(Optional) The VSCode Compact Extension for syntax support and code validation
Install the Compact Compiler
Download the compactc-<platform>.zip file and unzip it into a dedicated directory. Then, test the installation:

./compactc --version

Mac users may need to allow binaries in System Preferences → Privacy & Security.

Set the COMPACT_HOME variable in your shell profile for easier tooling integration:

export COMPACT_HOME='<absolute path to compactc directory>'

You may also want to add this path to your system $PATH.

Optional: Install the Compact VSCode Extension
For improved development experience:

Download the .vsix file from the Midnight releases page.
In VSCode, open the Extensions pane → click the ... → “Install from VSIX...”
Select the file and restart if prompted.
The extension provides syntax highlighting, inline validation, and contract templates—ideal for both learning and production work.

You’re Now Ready
At this stage, your environment includes:

A Lace Wallet with tDUST
A running local proof server
Node.js and TypeScript setup
The Compact compiler and Midnight libraries
You’ve completed your first transaction and are ready to write, compile, and deploy your own Midnight DApps.

🔒 Access Restricted
You must log in with GitHub to access this section.

Login with GitHub
Learn the basics of Compact, Midnight’s smart contract framework
Compact is a declarative smart contract language made for building privacy-first applications on Midnight.

In most blockchains, everything is public. In others, everything is private. Midnight does something more nuanced — selective disclosure — where private data stays private unless you explicitly choose to reveal it. Compact enforces this by design.

So when you're writing a Compact contract, you're not just writing business logic — you're also defining what’s visible to the world and what’s hidden by default.

Building Blocks of a Contract
Every Compact contract includes:

Ledger state: Public data stored on the chain
Circuits: Logic that runs on-chain and generates zero-knowledge proofs
Witnesses: Private inputs, typically provided by the DApp or user
Types and Structs: For organizing data
Constructor: Runs when the contract is first created
Here’s a simple Compact contract that stores a public number, restricts who can update or clear it, and only allows one value to be set at a time:

import CompactStandardLibrary;

enum State { unset, set }

export ledger authority: Bytes<32>;
export ledger value: Uint<64>;
export ledger state: State;
export ledger round: Counter;

constructor(sk: Bytes<32>, v: Uint<64>) {
  authority = publicKey(round, sk);
  value = v;
  state = State.set;
}

This contract sets up a shared public value. Only the user who originally set it can clear it. One of Compact’s standout features is its strict handling of privacy. Compact enforces a rule: you can’t accidentally reveal private data. If you want to disclose something, you must explicitly declare it using disclose().

For example:

witness getSecret(): Bytes<32>;
export ledger publicData: Bytes<32>;

export circuit record(): [] {
  publicData = disclose(getSecret());
}

Try skipping the disclose() wrapper, and Compact will give you a compiler error. Why? Because it treats all witness data (data coming from the user or DApp) as private by default.

This design protects against unintentional data leaks and makes privacy the standard.

Working with Witnesses
Witnesses are functions that supply private inputs from outside the contract — usually from the user or DApp.

witness getSecret(): Bytes<32>;

You can use witness data inside circuits, but Compact won’t let you return it, store it, or share it publicly unless you explicitly disclose it.

And even if you try to hide the disclosure (e.g., by changing its format or passing it through other functions), Compact will catch it. It’s like having a privacy-focused compiler buddy watching your back.

Opaque Types
Compact also supports opaque data types, like Opaque<'string'> or Opaque<'Uint8Array'>. These are useful for passing data from the DApp into the contract without letting Compact inspect it.

note
These values are only opaque within Compact. In your DApp's JavaScript or TypeScript, they’re fully visible. Also, they’re not encrypted on-chain — just not readable from within the Compact program.

Example: In the Bulletin Board example, an Opaque<'string'> is posted to public state by Compact. Later, another circuit reads it back and sends it to the front-end. But Compact itself can’t "look inside" the string.

Hashing and Commitment Functions
Compact’s standard library gives you tools to hash and commit to values. These functions help you prove something about data without revealing it.

Examples:

persistentCommit(value, random)   // Creates a public commitment
transientCommit(value)            // Creates a temporary commitment

These are often used in privacy-preserving protocols like anonymous voting or zero-knowledge authentication.

Exported Circuits
Circuits are like functions — they define what your contract can do.

Any circuit you export becomes an entry point to your contract. For example:

export circuit get(): Uint<64> {
  assert state == State.set "No value yet";
  return value;
}

Only circuits marked export are accessible from outside the contract (via the DApp or other contracts). Everything else stays private.

🔒 Access Restricted
You must log in with GitHub to access this section.

Login with GitHub
Module Summary
Midnight’s architecture enables privacy-preserving DApps on any device by integrating zkSNARKs and separating lightweight app logic from cryptographic processing. Compact, its smart contract language, generates JavaScript/TypeScript APIs and cryptographic proofs, ensuring secure transactions without exposing sensitive data. A dedicated proof server creates zero-knowledge attestations, keeping private data off-chain. Midnight supports multiple deployment models, allowing users to run services locally for full privacy or leverage cloud-based infrastructure while maintaining encrypted data protection.

Midnight provides a development environment for building secure DApps. To get started, install Docker, Google Chrome, and the Midnight Lace Wallet. Then, request test tokens (tDUST) from the faucet and run a local proof server to handle zero-knowledge proofs.

Next, set up your development tools by installing Node.js, the Compact compiler, and the Midnight TypeScript libraries. You can also install the Compact VSCode extension.

After your environment is ready, you can write, compile, and deploy your own Midnight smart contracts.

Compact is Midnight’s smart contract language designed for privacy-first applications. Unlike most blockchains, which are either fully public or private, Midnight enforces selective disclosure, meaning data stays private unless explicitly revealed. Contracts consist of ledger state, circuits, witnesses, types, and a constructor. Compact enforces strict privacy rules, requiring explicit disclosure of private data to prevent accidental leaks. Witnesses supply private inputs, but their data remains hidden unless explicitly disclosed. Opaque types allow DApps to pass data into contracts without Compact inspecting it. Hashing and commitment functions help prove properties about data without revealing it. Circuits define contract logic, and only exported circuits can be accessed externally.

Module 6: Building Decentralized Applications (DApps) on Midnight
Introduction
This module walks learners through creating, testing, and deploying a full-stack decentralized application (DApp) on the Midnight blockchain using the Compact framework. It includes hands-on development, front-end integration, and deployment on TestNet-02. Multiple-choice quizzes are provided at the end of each major section to reinforce learning outcomes.

Learning Objectives
By the end of this module, you will be able to:

Understand the core components and privacy model of Midnight’s blockchain and smart contract platform.
Set up a local development environment tailored for building on Midnight, including Docker, Node.js, and the Lace wallet.
Write, compile, and test smart contracts using the Compact domain-specific language.
Build a full-stack DApp that interfaces with a Midnight smart contract using TypeScript and Midnight.js.
Connect a frontend securely to the Midnight network via indexers, proof servers, and the Lace wallet DApp connector.
Test your DApp in a local standalone environment and on the public TestNet-02 network.
Use automated testing libraries to ensure functional correctness and privacy guarantees of your application.
Deploy a complete privacy-preserving DApp and verify contract interaction and state changes on Midnight.
What is a DApp on Midnight?
Unlike conventional DApps that publish all interactions on-chain, Midnight ensures user data stays private by default. Developers can selectively disclose information when needed, but private state is never stored publicly.

Developing DApps on Midnight involves a streamlined yet privacy-centric workflow designed for building secure, zero-knowledge-based decentralized applications. Unlike conventional blockchain development, Midnight emphasizes confidentiality and selective data disclosure as first-class design principles.

Key aspects include:

Setting Up the Development Environment: Developers install Docker, Node.js, and the Compact compiler. The Lace Wallet (a Chrome extension) is used for managing identities and signing transactions. A local proof server is run to handle zero-knowledge proof generation. Test tokens (tDUST) are acquired from the testnet faucet to cover transaction fees.

Writing Smart Contracts in Compact: Midnight smart contracts are written in Compact, a privacy-enforcing domain-specific language inspired by TypeScript. Compact allows you to define which variables are private and which can be publicly disclosed. The Compact compiler generates both cryptographic artifacts and strongly typed TypeScript/JavaScript APIs.

Building the DApp Frontend/Backend: DApps on Midnight are typically developed in TypeScript or JavaScript, using the generated contract APIs. The Midnight.js SDK offers utilities for blockchain interaction, wallet integration, and managing private state transitions.

Testing in a Local Environment: Midnight supports full-stack local development using Docker. Developers can simulate the entire stack (node, indexer, proof server) offline to validate contract behavior and data privacy before deploying to the public testnet.

Deploying and Interacting on TestNet-02: After successful testing, DApps can be deployed to Midnight TestNet-02, allowing interaction with real network services in a sandboxed environment. This stage supports user testing, transaction signing, and remote proof generation.

Using Developer Tools: Midnight provides a CLI wallet, a VSCode extension for Compact, a mock node for simulations, and built-in testing libraries for automation. The ecosystem is designed to support iterative development and high-confidence deployment.

In short, building DApps on Midnight means combining secure, privacy-first smart contracts with a robust developer experience tailored for scalable, confidential applications.

🔒 Access Restricted
You must log in with GitHub to access this section.

Login with GitHub
Environment Setup and First Contract
This section walks you through the foundational steps for developing decentralized applications (DApps) on the Midnight blockchain. Midnight is built around privacy and zero-knowledge proofs, and its development workflow reflects that with specialized tools and architecture.

You’ll begin by installing and configuring the necessary environment—this includes Docker, Node.js, the Compact compiler, and the Lace Wallet extension. Then, you’ll create a project scaffold, write your first Compact smart contract, and compile it into a usable form.

Setting Up Your Environment
To begin building on Midnight, install the essential tools and configure your development environment:

Docker Desktop – Required to run local instances like the proof server.

Google Chrome (v119 or later) – Required for installing the Lace wallet extension.

Node.js (v18 LTS) – Runtime for JavaScript tooling and DApp development:

nvm install 18 --lts

Lace Wallet Chrome Extension:

Install from the here.
Configure Wallet and Get Test Tokens
Create a new wallet address in Lace.

Request tDUST from the Midnight testnet faucet.

Run the proof server:

docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'

Install the Compact Compiler
Download the Compact compiler from the Midnight release page.

Test installation:

./compactc --version

Set environment variable:

export COMPACT_HOME='<absolute path to compactc directory>'

Install the VSCode Compact Extension
Download the .vsix file from the Midnight releases page.
In VSCode, go to Extensions → ... → Install from VSIX... and select the file.
Create Project Structure
When starting a Midnight DApp project, the recommended project structure is illustrated in the official tutorials and example projects. The structure is designed to separate the smart contract code from the DApp interface (such as a CLI or web UI), making development and testing more manageable.

your-dapp/
├── contract/         # Compact contract source and related TypeScript
│   ├── src/
│   │   └── your_contract.compact
│   └── ...           # build/test scripts, managed code, etc.
├── dapp-cli/         # Command-line interface for interacting with the contract
│   ├── src/
│   │   └── index.ts
│   └── ...           # CLI-specific code and configs
├── dapp-web/         # (optional) Web UI for your DApp
│   └── ...
└── README.md

contract/: Contains the Compact contract source file(s) and associated TypeScript code generated by the Compact compiler. This is where you define your smart contract logic.
dapp-cli/: Contains the command-line interface code, which depends on the outputs of the contract sub-project. This is where you implement user interactions for testing or administration.
dapp-web/: (Optional) For more complex DApps, you might have a separate folder for a web-based UI.
Each sub-project is typically buildable and testable independently.

Create and Build Your Compact Contract
Write your smart contract in the Compact DSL. For example, a simple contract that maintains a public counter and provides a single operation to increment it:

pragma language_version 0.16;

import CompactStandardLibrary;

// public state
export ledger round: Counter;

// transition function changing public state
export circuit increment(): [] {
  round.increment(1);
}

In this example, pragma language_version 0.16.0; ensures compatibility with the Compact compiler version. The import CompactStandardLibrary; brings in standard types like Counter. The export ledger round: Counter; declares a public counter stored on the ledger. The export circuit increment(): [] { ... } defines a public function that increments the counter by 1.

Compile the contract using the Compact compiler:

compactc --skip-zk contract/counter.compact managed/counter
npm run build

🔒 Access Restricted
You must log in with GitHub to access this section.

Login with GitHub
Front-End Integration
To implement user interfaces that interact seamlessly with Midnight smart contracts, you should leverage the TypeScript/JavaScript APIs generated by the Compact compiler and use the Midnight.js framework.

Use TypeScript/JavaScript for DApp Development
Midnight is designed so that most business logic and front-end code can be written in TypeScript, making it accessible to a wide range of developers. The Compact compiler outputs TypeScript API definitions for your smart contracts, which you can import into your DApp project. This allows your UI to call contract methods and handle responses in a type-safe way.

Integrate with Midnight.js
Midnight.js is the main framework for interacting with the Midnight blockchain. It provides utilities for:

Creating and submitting transactions
Interacting with wallets
Querying block and state information
Subscribing to chain events
It also includes unique utilities for privacy, such as executing smart contracts locally and managing private state

Connect to Wallets
Your UI should connect to a Midnight-compatible wallet (such as the Lace wallet extension) to allow users to sign transactions and manage their assets. The wallet exposes an API (DApp connector) that your frontend can use to request signatures and interact with the user’s account.

Example Integration Pattern
A typical integration flow in your UI might look like:

Import the generated TypeScript API and Midnight.js utilities.
Connect to the user’s wallet using the DApp connector API.
Configure providers (for private state, public data, proof server, etc.) using helper functions like configureProviders.
Call contract methods via the generated API, passing user input from the UI.
Handle transaction signing and proof generation via the wallet and proof server.
Display results or errors to the user.
import { configureProviders } from './api';
import { ContractApi } from './generated/contractApi';

async function runDAppUI(wallet, config) {
  const providers = await configureProviders(wallet, config);
  const contract = new ContractApi(providers);

  // Example: User clicks a button to increment a counter
  document.getElementById('incrementBtn').onclick = async () => {
    try {
      await contract.increment();
      alert('Counter incremented!');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };
}

🔒 Access Restricted
You must log in with GitHub to access this section.

Login with GitHub
Test Your DApp
To test DApps for functionality and security before deploying them on the Midnight network, you should use the dedicated Midnight test environment and available testing libraries.

Use the Local Midnight Test Environment
Midnight provides a Docker Compose setup that allows you to run a proof server, Midnight node, and Midnight Indexer locally, disconnected from the public Midnight network. This setup simulates a full network environment on your machine, enabling you to test contracts and DApps in isolation before deploying them to the real network.

Start the local test environment using the standalone.yml Docker Compose file, such as the one in the example-counter repository. This ensures your DApp interacts only with local services during testing.

Navigate to your DApp’s CLI directory and run yarn standalone.

When running in standalone mode, the DApp creates a disposable wallet and uses test tokens (tDUST) valid only for offline testing. The DApp uses the wallet SDK to create a wallet from a seed. The wallet address is shown in Bech32m format. This allows you to safely experiment without risking real assets or exposing sensitive data.

Automated Testing with Midnight.js Testing Library
Midnight offers a comprehensive testing library, @midnight-ntwrk/midnight-js-testing, designed for DApp developers.

Install the library:
yarn add -D @midnight-ntwrk/midnight-js-testing

Set up your test file (e.g., midnight.test.js):
import { getTestEnvironment } from '@midnight-ntwrk/midnight-js-testing';

beforeAll(async () => {
  testEnvironment = getTestEnvironment(logger);
  environmentConfiguration = await testEnvironment.start();
  walletProvider = await testEnvironment.getMidnightWalletProvider();
});

afterAll(async () => {
  await testEnvironment.shutdown();
});

The library provides utilities for:

Spinning up local or live test environments (including proof server control)
Managing and funding wallets
Checking system health
Running tests against your DApp’s contract logic and transaction flows
You can use environment variables to control the test environment (e.g., local, devnet, testnet) and wallet seed for reproducibility.

Functional and Security Testing Steps
Unit Test Your Smart Contracts: Write unit tests for your Compact contracts and run them locally before integration.
Simulate DApp Interactions: Use the CLI or UI to interact with your DApp in the local test environment, verifying all user flows and contract state changes.
Check Privacy Guarantees: Ensure that private data is never sent to the blockchain or indexer—only to the proof server, as enforced by the architecture Midnight architecture.
Test Wallet Integration: Confirm that wallet creation, restoration (using seed), and transaction signing work as expected, especially with the Bech32m address format Midnight test environment.
Automate Regression and Security Tests: Use the testing library’s assertions and environment controls to automate checks for expected contract behavior and to catch regressions.
🔒 Access Restricted
You must log in with GitHub to access this section.

Login with GitHub
Module Summary
In this module, you set up a full development environment for building privacy-preserving DApps on Midnight. You wrote and compiled smart contracts using the Compact DSL, connected your frontend with Midnight.js and TypeScript APIs, and tested your app locally using Docker and the standalone test environment.

You also learned how to securely interact with wallets, generate zero-knowledge proofs, and prepare your DApp for deployment on TestNet-02. With these tools and patterns, you're now ready to build and test real-world applications on the Midnight blockchain.