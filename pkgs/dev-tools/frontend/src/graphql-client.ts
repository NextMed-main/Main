/**
 * GraphQL Client for Midnight Network Indexer
 */

export interface GraphQLRequest {
	query: string;
	variables?: Record<string, unknown>;
}

export interface GraphQLResponse<T = unknown> {
	data?: T;
	errors?: Array<{
		message: string;
		locations?: Array<{ line: number; column: number }>;
		path?: Array<string | number>;
	}>;
}

export interface GraphQLClientConfig {
	endpoint: string;
	timeout?: number;
}

export class GraphQLClient {
	private endpoint: string;
	private timeout: number;

	constructor(config: GraphQLClientConfig) {
		this.endpoint = config.endpoint;
		this.timeout = config.timeout ?? 30000;
	}

	/**
	 * Execute a GraphQL query
	 */
	async query<T = unknown>(
		query: string,
		variables?: Record<string, unknown>,
	): Promise<T> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(this.endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query,
					variables,
				}),
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = (await response.json()) as GraphQLResponse<T>;

			if (data.errors && data.errors.length > 0) {
				const errorMessages = data.errors
					.map((e) => e.message)
					.join(", ");
				throw new Error(`GraphQL error: ${errorMessages}`);
			}

			if (data.data === undefined) {
				throw new Error("GraphQL response missing data");
			}

			return data.data;
		} catch (error) {
			if (error instanceof Error) {
				if (error.name === "AbortError") {
					throw new Error(`Request timeout after ${this.timeout}ms`);
				}
				throw error;
			}
			throw new Error("Unknown error occurred");
		} finally {
			clearTimeout(timeoutId);
		}
	}
}

