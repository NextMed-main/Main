/**
 * Utility functions for Patient Registry Contract
 */

import { Gender } from "./types";
import { createHash } from "crypto";

/**
 * Validate age is within acceptable range (0-150 years)
 * @param age - Age to validate
 * @returns true if valid, false otherwise
 */
export function validateAge(age: number): boolean {
	return age >= 0 && age <= 150;
}

/**
 * Convert Gender enum to numeric code for Compact contract
 * @param gender - Gender enum value
 * @returns Numeric code (0=MALE, 1=FEMALE, 2=OTHER)
 */
export function genderToCode(gender: Gender): bigint {
	return BigInt(gender);
}

/**
 * Convert numeric code to Gender enum
 * @param code - Numeric code from contract
 * @returns Gender enum value
 */
export function codeToGender(code: bigint): Gender {
	const numCode = Number(code);
	if (numCode === 0) return Gender.MALE;
	if (numCode === 1) return Gender.FEMALE;
	return Gender.OTHER;
}

/**
 * Hash condition data to Field value
 * @param condition - Condition string to hash
 * @returns Field value as bigint
 */
export function hashCondition(condition: string): bigint {
	const hash = createHash("sha256").update(condition).digest();
	// Convert first 32 bytes to bigint (Field compatible)
	let result = BigInt(0);
	for (let i = 0; i < Math.min(hash.length, 32); i++) {
		result = (result << BigInt(8)) | BigInt(hash[i]);
	}
	return result;
}

/**
 * Format registration stats for display
 * @param stats - Registration stats tuple
 * @returns Formatted object
 */
export function formatStats(stats: [bigint, bigint, bigint, bigint]): {
	total: number;
	male: number;
	female: number;
	other: number;
} {
	return {
		total: Number(stats[0]),
		male: Number(stats[1]),
		female: Number(stats[2]),
		other: Number(stats[3]),
	};
}
