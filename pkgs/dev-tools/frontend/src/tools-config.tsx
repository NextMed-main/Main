import type { ComponentType } from "react";
import { RpcExplorer } from "./RpcExplorer";
import { WalletApp } from "./WalletApp";

export interface ToolConfig {
	/**
	 * ツールの一意のID（URLハッシュで使用）
	 */
	id: string;

	/**
	 * ツールの表示名
	 */
	name: string;

	/**
	 * ツールの説明（オプション）
	 */
	description?: string;

	/**
	 * ツールのコンポーネント
	 */
	component: ComponentType;

	/**
	 * ツールのアイコン（オプション、将来の拡張用）
	 */
	icon?: string;
}

/**
 * 利用可能なツールの設定
 * 新しいツールを追加する場合は、ここに設定を追加するだけ
 */
export const TOOLS: ToolConfig[] = [
	{
		id: "rpc",
		name: "RPC Explorer",
		description: "Midnight NetworkのRPCメソッドを探索・実行",
		component: RpcExplorer,
	},
	{
		id: "wallet",
		name: "Wallet Connection",
		description: "Midnight Network対応ウォレットに接続して確認",
		component: WalletApp,
	},
	// 新しいツールを追加する場合は、ここに設定を追加
	// {
	//   id: "new-tool",
	//   name: "New Tool",
	//   description: "新しいツールの説明",
	//   component: NewToolComponent,
	// },
];

/**
 * デフォルトのツールID
 */
export const DEFAULT_TOOL_ID = "rpc";

/**
 * ツールIDからツール設定を取得
 */
export function getToolById(id: string): ToolConfig | undefined {
	return TOOLS.find((tool) => tool.id === id);
}

/**
 * デフォルトのツール設定を取得
 */
export function getDefaultTool(): ToolConfig {
	return getToolById(DEFAULT_TOOL_ID) ?? TOOLS[0];
}

