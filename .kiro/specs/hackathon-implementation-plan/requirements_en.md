# NextMed Hackathon Implementation Plan - Requirements Document

## Introduction

NextMed is a next-generation EHR analysis platform that leverages Midnight Blockchain's zero-knowledge proof technology to completely protect patient data sovereignty while accelerating the development of medical AI.

This document defines implementable requirements for the hackathon in late January 2025. Building on the existing NextMed MVP foundation, we will add **incentive functionality and token economy**.

## Glossary

- **NextMed**: Medical data privacy protection platform
- **ZKDataMasking**: Data masking functionality using zero-knowledge proofs
- **IncentivePool**: Smart contract that distributes payments from researchers to patients
- **NEXT Token**: Incentive token used within the platform
- **My Data Wallet**: Dashboard for patients to manage their data and rewards
- **Data Fee Pool**: Pool of data access fees paid by researchers
- **Patient**: Data subject (patient)
- **Researcher**: Data user (researcher/AI developer)
- **Lace Wallet**: Midnight-compatible wallet

## Requirements

### Requirement 1: ZK Data Masking Functionality

**User Story:** 
As a patient, I want my medical data to be used for research in a completely anonymized state.
So that I can contribute to medical research while protecting my privacy.

#### Acceptance Criteria

1. WHEN a patient registers medical data, the ZKDataMasking contract SHALL encrypt and store the data on Midnight Blockchain
2. WHEN data is accessed, the ZKDataMasking contract SHALL generate zero-knowledge proofs without exposing the original data
3. The ZKDataMasking contract SHALL provide only statistical characteristics (mean, variance, etc.) to researchers
4. The ZKDataMasking contract SHALL never expose individual patient data to the public ledger
5. WHEN data masking is executed, the ZKDataMasking contract SHALL generate proof of the masking operation

### Requirement 2: Incentive Pool Functionality

**User Story:** 
As a researcher, I want to pay appropriate compensation for data access.
As a patient, I want to receive fair rewards when my data is used.

#### Acceptance Criteria

1. WHEN a researcher pays a data access fee, the IncentivePool contract SHALL add the fee to the pool
2. WHEN data is used, the IncentivePool contract SHALL automatically distribute funds from the pool to relevant patients
3. The IncentivePool contract SHALL transparently manage records of all payments and distributions
4. WHEN a patient checks their wallet, the IncentivePool contract SHALL display accurate balance
5. The IncentivePool contract SHALL implement security features to prevent fraudulent payments or distributions

### Requirement 3: My Data Wallet Functionality

**User Story:** 
As a patient, I want to see my data usage status and earned rewards at a glance.
So that I can feel the value of providing data and encourage continued participation.

#### Acceptance Criteria

1. WHEN a patient accesses My Data Wallet, the frontend SHALL display the current NEXT token balance
2. My Data Wallet SHALL display history of data usage count and earned rewards
3. My Data Wallet SHALL provide a "Grant Access" button to enable consent management for researchers
4. WHEN consent is granted, My Data Wallet SHALL record consent status on-chain via midnight.sendMnTransaction
5. My Data Wallet SHALL maintain state after page reload

### Requirement 4: Researcher Data Purchase Functionality

**User Story:** 
As a researcher, I want to search for necessary datasets and purchase access rights by paying appropriate fees.
So that I can conduct medical research efficiently.

#### Acceptance Criteria

1. WHEN a researcher executes a dataset search, the frontend SHALL display statistical information of available data
2. WHEN a researcher purchases data access, the frontend SHALL clearly display payment amount and target data
3. WHEN payment is completed, the researcher UI SHALL display access rights confirmation and data usage guidance
4. WHEN a researcher uses data, the frontend SHALL display only anonymized data and analysis results
5. The researcher UI SHALL display history of past purchases and usage status

### Requirement 5: E2E Incentive Flow

**User Story:** 
As a system overall, I want to realize a complete economic ecosystem from researcher payments to patient reward receipt.
So that I can build a sustainable medical data ecosystem.

#### Acceptance Criteria

1. WHEN a researcher pays "data access fee", the system SHALL add the fee to the "Data Fee Pool"
2. WHEN data is used, the system SHALL automatically distribute funds from the pool to relevant patient wallets
3. WHEN patient wallet balance is updated, My Data Wallet SHALL display the new balance in real-time
4. The system SHALL record all token flows in an auditable manner
5. WHEN E2E flow is completed, the system SHALL generate test logs proving calculation accuracy

### Requirement 6: Lace Wallet Integration

**User Story:** 
As a user (patient or researcher), I want to securely connect to the platform using Lace Wallet.
So that I can safely manage tokens and execute transactions.

#### Acceptance Criteria

1. WHEN a user clicks the wallet connection button, the frontend SHALL prompt Lace Wallet connection
2. WHEN wallet connection succeeds, the frontend SHALL display wallet address and NEXT token balance
3. WHEN a transaction is executed, the frontend SHALL request signature through Lace Wallet
4. WHEN wallet connection fails, the frontend SHALL display clear error messages and troubleshooting steps
5. WHEN a user disconnects the wallet, the frontend SHALL clear all session data

### Requirement 7: Demo Support Functionality

**User Story:** 
As a hackathon judge, I want to understand and evaluate the system operation in a short time.
As a developer, I want to effectively demonstrate the system's value.

#### Acceptance Criteria

1. WHEN demo sample data is prepared, the system SHALL reproduce realistic scenarios
2. During demo execution, the frontend SHALL visually display progress of each step
3. WHEN token flow demo is executed, the system SHALL complete the entire process from payment to distribution within 3 minutes
4. Upon demo completion, the system SHALL display execution result summary and metrics
5. The demo environment SHALL provide reset functionality to enable repeated execution

## Technical Constraints

### Midnight Blockchain Constraints
- Compact language version: 0.16.0 - 0.25.0
- Operation in Testnet-02 environment
- Compatibility with Lace Wallet

### Development Period Constraints
- Implementation period: 4 weeks (January 2025)
- Demo preparation: Final week
- Testing period: Each weekend

### Performance Constraints
- Wallet connection: Within 5 seconds
- Transaction execution: Within 30 seconds
- Data search: Within 3 seconds
- Balance update: Real-time

## Success Metrics

### Milestone #1: ZK Contract & Frontend Integration Test
- Deployment completion of ZKDataMasking and IncentivePool
- Transaction execution confirmation on Testnet
- GitHub repository organization

### Milestone #2: Patient "My Data Wallet" Prototype
- Implementation of balance display functionality
- Completion of Lace Wallet integration
- Implementation of consent management functionality

### Milestone #3: Researcher Query & E2E Incentive Test
- Researcher data purchase UI
- Complete token flow verification
- Demo video creation

## Implementation Priority

1. **Highest Priority**: ZKDataMasking, IncentivePool smart contracts
2. **High Priority**: My Data Wallet UI, Lace wallet integration
3. **Medium Priority**: Researcher data purchase UI
4. **Low Priority**: Advanced analysis features, detailed audit logs

This requirements definition achieves both implementation feasibility for the hackathon and impact on judges through the development plan.