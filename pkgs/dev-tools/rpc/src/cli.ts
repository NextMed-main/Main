#!/usr/bin/env node

/**
 * Midnight Network RPC CLI Tool
 * Command-line interface for interacting with Midnight Network RPC endpoints
 */

import { Command } from "commander";
import { RpcClient } from "./rpc-client.js";

const DEFAULT_ENDPOINT = "https://rpc.testnet-02.midnight.network/";

function getClient(program: Command): RpcClient {
	const endpoint = program.opts().endpoint || DEFAULT_ENDPOINT;
	const timeout = parseInt(program.opts().timeout || "30000", 10);
	return new RpcClient({ endpoint, timeout });
}

function createRpcCommand(
	program: Command,
	method: string,
	description: string,
	config?: {
		arguments?: Array<{
			name: string;
			description: string;
			required?: boolean;
		}>;
		options?: Array<{ flags: string; description: string; required?: boolean }>;
	}
) {
	const cmd = program.command(method).description(description);

	if (config?.arguments) {
		for (const arg of config.arguments) {
			if (arg.required) {
				cmd.argument(`<${arg.name}>`, arg.description);
			} else {
				cmd.argument(`[${arg.name}]`, arg.description);
			}
		}
	}

	if (config?.options) {
		for (const opt of config.options) {
			if (opt.required) {
				cmd.requiredOption(opt.flags, opt.description);
			} else {
				cmd.option(opt.flags, opt.description);
			}
		}
	}

	cmd.action(async (...args: unknown[]) => {
		const client = getClient(program);
		try {
			const params: unknown[] = [];
			const opts = args[args.length - 1] as Record<string, unknown>;
			const argValues = args.slice(0, -1) as unknown[];

			// 引数を追加
			if (config?.arguments) {
				for (let i = 0; i < config.arguments.length; i++) {
					if (argValues[i] !== undefined) {
						params.push(argValues[i]);
					}
				}
			}

			// オプションを追加
			if (config?.options) {
				for (const opt of config.options) {
					const key = opt.flags
						.split(",")[0]
						.trim()
						.replace(/^-+/, "")
						.split(" ")[0];
					const value = opts[key];
					if (value !== undefined) {
						params.push(value);
					}
				}
			}

			const result = await client.call(method, params);
			console.log(JSON.stringify(result, null, 2));
		} catch (error) {
			console.error("Error:", error instanceof Error ? error.message : error);
			process.exit(1);
		}
	});
}

function main() {
	const program = new Command();

	program
		.name("midnight-rpc")
		.description("Midnight Network RPC CLI Tool")
		.version("0.1.0")
		.option("-e, --endpoint <url>", "RPCエンドポイントURL", DEFAULT_ENDPOINT)
		.option("-t, --timeout <ms>", "リクエストタイムアウト（ミリ秒）", "30000");

	// System methods
	createRpcCommand(program, "system_chain", "チェーン名を取得");
	createRpcCommand(program, "system_name", "ノード名を取得");
	createRpcCommand(program, "system_version", "ノードバージョンを取得");
	createRpcCommand(program, "system_health", "ノードのヘルス状態を取得");
	createRpcCommand(program, "system_peers", "接続されているピアのリストを取得");
	createRpcCommand(program, "system_properties", "チェーンのプロパティを取得");

	// Chain methods
	createRpcCommand(
		program,
		"chain_getBlock",
		"ブロックのヘッダーとボディを取得",
		{
			arguments: [
				{
					name: "hash",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);
	createRpcCommand(
		program,
		"chain_getBlockHash",
		"特定のブロックのハッシュを取得",
		{
			arguments: [
				{
					name: "blockNumber",
					description: "ブロック番号（オプション）",
					required: false,
				},
			],
		}
	);
	createRpcCommand(
		program,
		"chain_getFinalizedHead",
		"最終確定されたブロックのハッシュを取得"
	);
	createRpcCommand(
		program,
		"chain_getHeader",
		"特定のブロックのヘッダーを取得",
		{
			arguments: [
				{
					name: "hash",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);

	// State methods
	createRpcCommand(program, "state_getStorage", "ストレージエントリを取得", {
		options: [
			{
				flags: "-k, --key <key>",
				description: "ストレージキー",
				required: true,
			},
			{
				flags: "-a, --at <hash>",
				description: "ブロックハッシュ（オプション）",
				required: false,
			},
		],
	});
	createRpcCommand(program, "state_getMetadata", "ランタイムメタデータを取得", {
		options: [
			{
				flags: "-a, --at <hash>",
				description: "ブロックハッシュ（オプション）",
				required: false,
			},
		],
	});
	createRpcCommand(
		program,
		"state_getRuntimeVersion",
		"ランタイムバージョンを取得",
		{
			options: [
				{
					flags: "-a, --at <hash>",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);

	// RPC methods
	createRpcCommand(
		program,
		"rpc_methods",
		"利用可能なRPCメソッドのリストを取得"
	);

	// Midnight methods
	createRpcCommand(
		program,
		"midnight_jsonContractState",
		"JSONエンコードされたコントラクト状態を取得",
		{
			options: [
				{
					flags: "-a, --address <address>",
					description: "コントラクトアドレス",
					required: true,
				},
				{
					flags: "-b, --block <hash>",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);
	createRpcCommand(
		program,
		"midnight_contractState",
		"生の（バイナリエンコードされた）コントラクト状態を取得",
		{
			options: [
				{
					flags: "-a, --address <address>",
					description: "コントラクトアドレス",
					required: true,
				},
				{
					flags: "-b, --block <hash>",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);
	createRpcCommand(
		program,
		"midnight_unclaimedAmount",
		"未請求トークンまたは報酬の額を取得",
		{
			options: [
				{
					flags: "-b, --beneficiary <address>",
					description: "受益者アドレス",
					required: true,
				},
				{
					flags: "-a, --at <hash>",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);
	createRpcCommand(
		program,
		"midnight_zswapChainState",
		"ZSwapチェーン状態を取得",
		{
			options: [
				{
					flags: "-a, --address <address>",
					description: "コントラクトアドレス",
					required: true,
				},
				{
					flags: "-b, --block <hash>",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);
	createRpcCommand(
		program,
		"midnight_apiVersions",
		"サポートされているRPC APIバージョンのリストを取得"
	);
	createRpcCommand(
		program,
		"midnight_ledgerVersion",
		"レジャーバージョンを取得",
		{
			options: [
				{
					flags: "-a, --at <hash>",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);
	createRpcCommand(
		program,
		"midnight_jsonBlock",
		"JSONエンコードされたブロック情報を取得（extrinsicを含む）",
		{
			options: [
				{
					flags: "-a, --at <hash>",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);
	createRpcCommand(
		program,
		"midnight_decodeEvents",
		"イベントをデコード",
		{
			options: [
				{
					flags: "-e, --events <events>",
					description: "エンコードされたイベントデータ",
					required: true,
				},
			],
		}
	);
	createRpcCommand(
		program,
		"midnight_zswapStateRoot",
		"ZSwap状態ルートを取得",
		{
			options: [
				{
					flags: "-a, --at <hash>",
					description: "ブロックハッシュ（オプション）",
					required: false,
				},
			],
		}
	);

	// カスタムRPCコール
	program
		.command("call")
		.description("カスタムRPCメソッドを呼び出し")
		.requiredOption("-m, --method <method>", "RPCメソッド名")
		.option("-p, --params <params>", "パラメータ（JSON配列形式）", "[]")
		.action(async (options: { method: string; params: string }) => {
			const client = getClient(program);
			try {
				let params: unknown[] = [];
				try {
					params = JSON.parse(options.params);
					if (!Array.isArray(params)) {
						throw new Error("Params must be a JSON array");
					}
				} catch {
					console.error("Invalid params format. Please provide a JSON array.");
					process.exit(1);
				}

				const result = await client.call(options.method, params);
				console.log(JSON.stringify(result, null, 2));
			} catch (error) {
				console.error("Error:", error instanceof Error ? error.message : error);
				process.exit(1);
			}
		});

	program.parse();
}

main();
