import { describe, test, expect } from "vitest";
import {
	validateAge,
	genderToCode,
	codeToGender,
	hashCondition,
	formatStats,
} from "../utils";
import { Gender } from "../types";

describe("Patient Registry Utils", () => {
	describe("validateAge", () => {
		test("should accept valid ages", () => {
			expect(validateAge(0)).toBe(true);
			expect(validateAge(30)).toBe(true);
			expect(validateAge(150)).toBe(true);
		});

		test("should reject invalid ages", () => {
			expect(validateAge(-1)).toBe(false);
			expect(validateAge(151)).toBe(false);
			expect(validateAge(200)).toBe(false);
		});
	});

	describe("genderToCode", () => {
		test("should convert gender to code", () => {
			expect(genderToCode(Gender.MALE)).toBe(BigInt(0));
			expect(genderToCode(Gender.FEMALE)).toBe(BigInt(1));
			expect(genderToCode(Gender.OTHER)).toBe(BigInt(2));
		});
	});

	describe("codeToGender", () => {
		test("should convert code to gender", () => {
			expect(codeToGender(BigInt(0))).toBe(Gender.MALE);
			expect(codeToGender(BigInt(1))).toBe(Gender.FEMALE);
			expect(codeToGender(BigInt(2))).toBe(Gender.OTHER);
			expect(codeToGender(BigInt(99))).toBe(Gender.OTHER); // default
		});
	});

	describe("hashCondition", () => {
		test("should generate consistent hashes", () => {
			const hash1 = hashCondition("diabetes");
			const hash2 = hashCondition("diabetes");
			expect(hash1).toBe(hash2);
		});

		test("should generate different hashes for different conditions", () => {
			const hash1 = hashCondition("diabetes");
			const hash2 = hashCondition("hypertension");
			expect(hash1).not.toBe(hash2);
		});

		test("should return bigint", () => {
			const hash = hashCondition("test");
			expect(typeof hash).toBe("bigint");
		});
	});

	describe("formatStats", () => {
		test("should format stats correctly", () => {
			const stats: [bigint, bigint, bigint, bigint] = [
				BigInt(100),
				BigInt(40),
				BigInt(50),
				BigInt(10),
			];
			const formatted = formatStats(stats);

			expect(formatted).toEqual({
				total: 100,
				male: 40,
				female: 50,
				other: 10,
			});
		});

		test("should handle zero values", () => {
			const stats: [bigint, bigint, bigint, bigint] = [
				BigInt(0),
				BigInt(0),
				BigInt(0),
				BigInt(0),
			];
			const formatted = formatStats(stats);

			expect(formatted).toEqual({
				total: 0,
				male: 0,
				female: 0,
				other: 0,
			});
		});
	});
});
