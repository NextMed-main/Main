import type { ComponentType } from "react";
import { RpcExplorer } from "./RpcExplorer";
import { WalletApp } from "./WalletApp";

export interface ToolConfig {
	/**
	 * Unique tool ID (used in URL hash)
	 */
	id: string;

	/**
	 * Tool display name
	 */
	name: string;

	/**
	 * Tool description (optional)
	 */
	description?: string;

	/**
	 * Tool component
	 */
	component: ComponentType;

	/**
	 * Tool icon (optional, for future expansion)
	 */
	icon?: string;
}

/**
 * Available tools configuration
 * To add a new tool, simply add its configuration here
 */
export const TOOLS: ToolConfig[] = [
	{
		id: "rpc",
		name: "RPC Explorer",
		description: "Explore and execute Midnight Network RPC methods",
		component: RpcExplorer,
	},
	{
		id: "wallet",
		name: "Wallet Connection",
		description: "Connect and verify Midnight Network compatible wallets",
		component: WalletApp,
	},
	// To add a new tool, add its configuration here
	// {
	//   id: "new-tool",
	//   name: "New Tool",
	//   description: "Description of the new tool",
	//   component: NewToolComponent,
	// },
];

/**
 * Default tool ID
 */
export const DEFAULT_TOOL_ID = "rpc";

/**
 * Get tool configuration by ID
 */
export function getToolById(id: string): ToolConfig | undefined {
	return TOOLS.find((tool) => tool.id === id);
}

/**
 * Get default tool configuration
 */
export function getDefaultTool(): ToolConfig {
	return getToolById(DEFAULT_TOOL_ID) ?? TOOLS[0];
}

