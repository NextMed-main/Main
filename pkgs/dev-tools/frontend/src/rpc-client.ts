/**
 * RPC Client for Midnight Network
 * Handles JSON-RPC requests to Midnight Network nodes
 */

export interface RpcRequest {
	jsonrpc: "2.0";
	method: string;
	params: unknown[];
	id: number;
}

export interface RpcResponse<T = unknown> {
	jsonrpc: "2.0";
	result?: T;
	error?: {
		code: number;
		message: string;
		data?: unknown;
	};
	id: number;
}

export interface RpcClientConfig {
	endpoint: string;
	timeout?: number;
}

export class RpcClient {
	private endpoint: string;
	private timeout: number;
	private requestId: number = 1;

	constructor(config: RpcClientConfig) {
		this.endpoint = config.endpoint;
		this.timeout = config.timeout ?? 30000; // 30秒デフォルト
	}

	/**
	 * RPCリクエストを送信
	 */
	async call<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
		// Use requestId to generate unique request IDs
		const requestId = this.requestId;
		this.requestId++;
		const request: RpcRequest = {
			jsonrpc: "2.0",
			method,
			params,
			id: requestId,
		};

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(this.endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(request),
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = (await response.json()) as RpcResponse<T>;

			if (data.error) {
				throw new Error(
					`RPC error: ${data.error.message} (code: ${data.error.code})`,
				);
			}

			if (data.result === undefined) {
				throw new Error("RPC response missing result");
			}

			return data.result;
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

	/**
	 * 複数のRPCリクエストをバッチで送信
	 */
	async batch(
		requests: Array<{ method: string; params?: unknown[] }>,
	): Promise<unknown[]> {
		const batchRequest: RpcRequest[] = requests.map((req) => {
			// Use requestId to generate unique request IDs
			const requestId = this.requestId;
			this.requestId++;
			return {
				jsonrpc: "2.0",
				method: req.method,
				params: req.params ?? [],
				id: requestId,
			};
		});

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(this.endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(batchRequest),
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = (await response.json()) as RpcResponse[];

			// バッチレスポンスのエラーチェック
			const errors = data.filter((res) => res.error);
			if (errors.length > 0) {
				const errorMessages = errors.map((e) => e.error?.message).join(", ");
				throw new Error(`RPC errors: ${errorMessages}`);
			}

			return data.map((res) => res.result);
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
