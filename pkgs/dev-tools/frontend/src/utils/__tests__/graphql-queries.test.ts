/**
 * Tests for GraphQL query builders
 * TDD: Test-driven development for query validation
 */

import { describe, expect, it } from "vitest";
import {
    buildBlocksInRangeQuery,
    buildBlocksQuery,
    buildTransactionByHashQuery,
    buildTransactionsByAccountQuery,
    buildTransactionsQuery,
} from "../graphql-queries";

describe("GraphQL Query Builders", () => {
	describe("buildBlocksQuery", () => {
		it("should build a valid blocks query with default parameters", () => {
			const query = buildBlocksQuery();
			expect(query).toContain("blocks(offset: 0, limit: 10)");
			expect(query).toContain("number");
			expect(query).toContain("hash");
			expect(query).toContain("timestamp");
		});

		it("should build a valid blocks query with custom parameters", () => {
			const query = buildBlocksQuery(10, 20);
			expect(query).toContain("blocks(offset: 10, limit: 20)");
		});

		it("should not contain invalid fields", () => {
			const query = buildBlocksQuery();
			expect(query).not.toMatch(/\s+id\s+/);
			expect(query).not.toContain("transactionCount");
		});
	});

	describe("buildTransactionsQuery", () => {
		it("should build a valid transactions query with offset", () => {
			const query = buildTransactionsQuery();
			expect(query).toContain("transactions(offset: 0, limit: 10)");
			expect(query).toContain("hash");
			expect(query).toContain("blockNumber");
			expect(query).toContain("extrinsicIndex");
		});

		it("should include offset parameter (required)", () => {
			const query = buildTransactionsQuery(5, 15);
			expect(query).toContain("transactions(offset: 5, limit: 15)");
		});

		it("should not contain invalid fields", () => {
			const query = buildTransactionsQuery();
			expect(query).not.toMatch(/\s+id\s+/);
		});
	});

	describe("buildTransactionByHashQuery", () => {
		it("should build a valid transaction hash query", () => {
			const hash = "0x1234567890abcdef";
			const query = buildTransactionByHashQuery(hash);
			expect(query).toContain(`transactions(offset: { hash: "${hash}" })`);
			expect(query).toContain("hash");
			expect(query).toContain("timestamp");
		});

		it("should escape special characters in hash", () => {
			const hash = '0x"test"';
			const query = buildTransactionByHashQuery(hash);
			expect(query).toContain(`transactions(offset: { hash: "${hash}" })`);
		});
	});

	describe("buildTransactionsByAccountQuery", () => {
		it("should build a valid account transactions query", () => {
			const address = "mn_shield-addr_test123";
			const query = buildTransactionsByAccountQuery(address);
			expect(query).toContain(`filter: { account: "${address}" }`);
			expect(query).toContain("offset: 0");
			expect(query).toContain("limit: 100");
		});

		it("should include offset parameter", () => {
			const address = "mn_shield-addr_test123";
			const query = buildTransactionsByAccountQuery(address, 10, 50);
			expect(query).toContain("offset: 10");
			expect(query).toContain("limit: 50");
		});
	});

	describe("buildBlocksInRangeQuery", () => {
		it("should build a valid blocks range query", () => {
			const query = buildBlocksInRangeQuery(100, 200);
			expect(query).toContain("number: { gte: 100, lte: 200 }");
			expect(query).toContain("offset: 0");
			expect(query).toContain("limit: 100");
		});

		it("should include pagination parameters", () => {
			const query = buildBlocksInRangeQuery(100, 200, 5, 25);
			expect(query).toContain("offset: 5");
			expect(query).toContain("limit: 25");
		});
	});
});

