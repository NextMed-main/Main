# NextMed Hackathon Implementation Plan - Task List

## Overview

For the late January 2025 hackathon, we will implement an incentive-enabled medical data platform based on the existing NextMed MVP within 4 weeks. Each task maximizes the use of existing code and incrementally adds new features.

## Implementation Approach

- **Leverage Existing Code**: Extend patient-registry.compact and frontend components
- **Incremental Implementation**: Complete one milestone per week
- **Test-Driven**: Implement property-based tests for each feature
- **Demo-Focused**: Effective demonstrations for hackathon judges

---

## Week 1: ZK Contract & Frontend Integration Testing

### Milestone #1: ZKDataMasking and IncentivePool Development

- [ ] 1. ZKDataMasking Contract Implementation
  - Extend existing patient-registry.compact to add ZK masking functionality
  - Implement data encryption and hashing features
  - Implement statistical calculation features (provide aggregate statistics without exposing individual data)
  - _Requirements: 1.1, 1.3, 1.4_

- [ ] 1.1 ZKDataMasking Circuit Implementation
  - Create registerPatientWithMasking circuit
  - Implement applyZKMasking function
  - Add maskedDataStore Ledger
  - _Requirements: 1.1_

- [ ]* 1.2 ZKDataMasking Unit Tests
  - **Property 1: Data Privacy Protection**
  - **Validates: Requirements 1.1, 1.4**

- [ ] 1.3 Zero-Knowledge Proof Generation Implementation
  - Create generateZKProof circuit
  - Implement proof generation for data access
  - Implement proof verification functionality
  - _Requirements: 1.2, 1.5_

- [ ]* 1.4 ZK Proof Functionality Tests
  - **Property 2: Zero-Knowledge Proof Generation**
  - **Validates: Requirements 1.2, 1.5**

- [ ] 2. IncentivePool Contract Implementation
  - Create new contract file (incentive-pool.compact)
  - Implement data fee pool management functionality
  - Implement patient-specific balance management system
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 2.1 Payment Reception Implementation
  - Create payDataAccessFee circuit
  - Implement dataFeePool Ledger
  - Implement paymentHistory recording functionality
  - _Requirements: 2.1_

- [ ]* 2.2 Payment Functionality Tests
  - **Property 4: Payment Pool Management**
  - **Validates: Requirements 2.1, 2.3**

- [ ] 2.3 Automatic Distribution Implementation
  - Create distributeIncentives circuit
  - Manage patientBalances Map
  - Implement distribution logic
  - _Requirements: 2.2_

- [ ]* 2.4 Distribution Functionality Tests
  - **Property 5: Automatic Distribution Function**
  - **Validates: Requirements 2.2**

- [ ] 2.5 Security Features Implementation
  - Implement fraud payment prevention
  - Implement access control
  - Enhance error handling
  - _Requirements: 2.5_

- [ ]* 2.6 Security Features Tests
  - **Property 7: Security Protection**
  - **Validates: Requirements 2.5**

- [ ] 3. Contract Integration and Deployment
  - Integration with existing patient-registry.compact
  - Deploy to Midnight Testnet-02
  - Update deployment scripts
  - _Requirements: Overall Integration_

- [ ] 3.1 Integration Tests Implementation
  - Test ZKDataMasking and IncentivePool integration
  - Verify compatibility with existing features
  - Confirm basic end-to-end flow

- [ ] 3.2 Deployment Verification and Documentation Update
  - Verify transaction execution on Testnet
  - Record contract addresses
  - Organize GitHub repository

## Week 2: Patient "My Data Wallet" Prototype

### Milestone #2: Frontend Foundation & Wallet Integration

- [ ] 4. My Data Wallet UI Implementation
  - Extend existing patient-dashboard.tsx
  - Implement NEXT token balance display functionality
  - Implement data usage history display functionality
  - _Requirements: 3.1, 3.2_

- [ ] 4.1 Balance Display Component Creation
  - Implement TokenBalanceCard component
  - Integrate with IncentivePool contract
  - Implement real-time balance update functionality
  - _Requirements: 3.1_

- [ ]* 4.2 Balance Display Functionality Tests
  - **Property 6: Balance Calculation Accuracy**
  - **Validates: Requirements 2.4**

- [ ] 4.3 Usage History Display Component Creation
  - Implement DataUsageHistory component
  - Display usage count and earned rewards history
  - Implement history data retrieval and display functionality
  - _Requirements: 3.2_

- [ ]* 4.4 History Display Functionality Tests
  - **Property 8: Usage History Display**
  - **Validates: Requirements 3.2**

- [ ] 5. Consent Management Implementation
  - Implement Grant Access button
  - Implement consent granting/revocation functionality for researchers
  - Record on-chain consent state
  - _Requirements: 3.3, 3.4_

- [ ] 5.1 Consent Management UI Creation
  - Implement ConsentManagement component
  - Display researcher list and consent status
  - Implement consent granting/revocation buttons
  - _Requirements: 3.3_

- [ ] 5.2 On-Chain Consent Recording Implementation
  - Integrate midnight.sendMnTransaction
  - Record consent state in smart contract
  - Monitor transaction status
  - _Requirements: 3.4_

- [ ]* 5.3 Consent Functionality Tests
  - **Property 9: Consent State Recording**
  - **Validates: Requirements 3.4**

- [ ] 6. Enhanced Lace Wallet Integration
  - Extend existing wallet-provider.tsx
  - Implement NEXT token balance retrieval functionality
  - Enhance transaction signing functionality
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 6.1 Token Balance Retrieval Implementation
  - Integrate with NEXT token contract
  - Implement balance retrieval API
  - Implement automatic balance display updates

- [ ] 6.2 State Persistence Implementation
  - Save state in local storage
  - Restore state after page reload
  - Improve session management
  - _Requirements: 3.5_

- [ ]* 6.3 State Persistence Tests
  - **Property 10: State Persistence**
  - **Validates: Requirements 3.5**

- [ ] 7. Week 2 Integration Testing
  - Integration testing of all My Data Wallet features
  - Verify integration with Lace Wallet
  - Conduct usability testing

## Week 3: Researcher Query & Data Purchase Features

### Milestone #2 Continued: AI Features, Query Features, Token Display Implementation

- [ ] 8. Researcher Payment UI Implementation
  - Extend existing researcher-dashboard.tsx
  - Implement dataset search functionality
  - Implement data access fee payment functionality
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 8.1 Dataset Search Implementation
  - Create DatasetSearch component
  - Display available data statistics
  - Implement search filter functionality
  - _Requirements: 4.1_

- [ ]* 8.2 Dataset Search Tests
  - **Property 11: Dataset Search**
  - **Validates: Requirements 4.1**

- [ ] 8.3 Payment UI Implementation
  - Create PaymentInterface component
  - Display payment amount and target data
  - Integrate with IncentivePool contract
  - _Requirements: 4.2_

- [ ]* 8.4 Payment UI Functionality Tests
  - **Property 12: Purchase Information Display**
  - **Validates: Requirements 4.2**

- [ ] 8.5 Post-Purchase UI Implementation
  - Create access rights confirmation screen
  - Display data usage start guidance
  - Implement purchase history recording and display
  - _Requirements: 4.3, 4.5_

- [ ]* 8.6 Purchase History Functionality Tests
  - **Property 14: History Display Function**
  - **Validates: Requirements 4.5**

- [ ] 9. Data Usage Implementation
  - Implement anonymized data display functionality
  - Implement analysis result visualization
  - Verify privacy protection
  - _Requirements: 4.4_

- [ ] 9.1 Anonymized Data Display Implementation
  - Create AnonymizedDataViewer component
  - Display data without personal information
  - Visualize statistical data and analysis results

- [ ]* 9.2 Anonymized Data Display Tests
  - **Property 13: Anonymized Data Display**
  - **Validates: Requirements 4.4**

- [ ] 10. Data Consent Implementation
  - Send on-chain transactions to ZK contracts
  - Implement consent state verification and management
  - Implement consent flow between researchers and patients
  - _Requirements: 3.4, 5.1_

- [ ] 10.1 Consent Transaction Sending Implementation
  - Create consent granting transactions
  - Utilize midnight.sendMnTransaction
  - Monitor transaction status

- [ ] 10.2 Consent State Management Implementation
  - Verify consent status by researcher
  - Manage consent expiration
  - Implement consent revocation functionality

## Week 4: E2E Ecosystem Loop & Demo Creation

### Milestone #3: Researcher UI, Incentive Distribution, Video Production

- [ ] 11. E2E Incentive Flow Implementation
  - Complete token flow (researcher payment → patient rewards)
  - Implement real-time balance update functionality
  - Implement audit log functionality
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 11.1 Complete Token Flow Implementation
  - Add researcher payments to Data Fee Pool
  - Automatic distribution to patients upon data usage
  - State management for entire flow

- [ ]* 11.2 E2E Payment Flow Tests
  - **Property 15: E2E Payment Flow**
  - **Validates: Requirements 5.1, 5.2**

- [ ] 11.3 Real-Time Update Implementation
  - Immediate reflection of balance changes
  - Updates via WebSocket or polling
  - UI state synchronization functionality

- [ ]* 11.4 Real-Time Update Tests
  - **Property 16: Real-Time Balance Updates**
  - **Validates: Requirements 5.3**

- [ ] 11.5 Audit Log Implementation
  - Record all token movements
  - Maintain records in auditable format
  - Implement log search and display functionality

- [ ]* 11.6 Audit Functionality Tests
  - **Property 17: Audit Record Management**
  - **Validates: Requirements 5.4**

- [ ] 12. Demo Scenario Creation
  - Demo flow for hackathon judges
  - Prepare sample data
  - Implement demo reset functionality
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 12.1 Demo Sample Data Preparation
  - Dataset reproducing realistic scenarios
  - Create patient, researcher, and transaction data
  - Set initial data for demo environment

- [ ] 12.2 Demo Flow Visualization Implementation
  - Display progress of each step
  - Visual flow guidance
  - Demo progress guide functionality

- [ ] 12.3 Demo Reset Implementation
  - Restore to initial state functionality
  - Repeatable execution environment
  - Re-initialize demo data

- [ ] 13. Performance Optimization
  - Verify E2E completion within 3 minutes
  - Optimize transaction processing
  - Improve UI responsiveness
  - _Requirements: 7.3_

- [ ] 13.1 Transaction Optimization
  - Improve gas efficiency
  - Implement parallel processing
  - Optimize error handling

- [ ] 13.2 UI Responsiveness Improvement
  - Improve loading states
  - Optimize asynchronous processing
  - Enhance user feedback

- [ ] 14. Final Integration Testing and Demo Preparation
  - Integration testing of all features
  - Verify demo scenario execution
  - Generate calculation accuracy proofs
  - _Requirements: 5.5_

- [ ] 14.1 E2E Accuracy Proof Implementation
  - Generate test logs proving calculation accuracy
  - Output proofs upon flow completion
  - Create audit reports

- [ ]* 14.2 E2E Accuracy Proof Tests
  - **Property 18: E2E Accuracy Proof**
  - **Validates: Requirements 5.5**

- [ ] 14.3 Demo Video Production
  - E2E test video showing token flow
  - Feature explanation and demonstration
  - Prepare hackathon submission materials

- [ ] 15. Final Checkpoint
  - Verify achievement of all milestones
  - Final verification of demo environment
  - Complete preparation of submission materials

---

## Implementation Guidelines

### Existing Code Utilization Policy
- **patient-registry.compact**: Extend with ZKDataMasking functionality
- **patient-dashboard.tsx**: Extend with My Data Wallet functionality
- **researcher-dashboard.tsx**: Extend with Payment UI functionality
- **wallet-provider.tsx**: Extend with NEXT token support

### Testing Requirements
- Implement property-based tests for each feature
- Test library: fast-check (TypeScript)
- Minimum execution count: 100 times/property
- Tag format: **Feature: hackathon-implementation-plan, Property {number}: {property_text}**

### Performance Goals
- Wallet connection: Within 5 seconds
- Transaction execution: Within 30 seconds
- Data search: Within 3 seconds
- E2E flow completion: Within 3 minutes

### Security Requirements
- Validate all external inputs
- Proper private key management
- Prevent unauthorized access
- Ensure audit log integrity

### Demo Requirements
- Complete E2E demo within 3 minutes
- Visually clear UI
- Repeatable execution with reset functionality
- Display calculation accuracy proofs

This task list enables the implementation of an incentive-enabled medical data platform that will impact hackathon judges within 4 weeks, based on the existing NextMed MVP.