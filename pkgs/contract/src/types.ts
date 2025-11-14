/**
 * Type definitions for Patient Registry Contract
 */

/**
 * Gender enumeration
 * Corresponds to Compact Gender enum
 */
export enum Gender {
	MALE = 0,
	FEMALE = 1,
	OTHER = 2,
}

/**
 * Registration state enumeration
 * Corresponds to Compact RegistrationState enum
 */
export enum RegistrationState {
	UNREGISTERED = 0,
	REGISTERED = 1,
	VERIFIED = 2,
}

/**
 * Registration statistics
 * Tuple format: [totalCount, maleCount, femaleCount, otherCount]
 */
export type RegistrationStats = [bigint, bigint, bigint, bigint];

/**
 * Patient data for registration
 */
export interface PatientData {
	age: number;
	gender: Gender;
	conditionHash: string;
}

/**
 * Registration result
 */
export interface RegistrationResult {
	success: boolean;
	transactionHash?: string;
	error?: string;
}
