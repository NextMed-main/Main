/**
 * Bech32m address utilities for Midnight Network
 * Uses @midnight-ntwrk/wallet-sdk-address-format for proper decoding
 */

import {
	ShieldedAddress,
	MidnightBech32m,
} from "@midnight-ntwrk/wallet-sdk-address-format";
import { NetworkId } from "@midnight-ntwrk/zswap";

/**
 * Decode a Bech32m address to ShieldedAddress
 * Uses the official Midnight Network wallet SDK
 */
export function decodeBech32mAddress(address: string): ShieldedAddress | null {
	try {
		// Bech32m addresses start with "mn_shield-addr_" or "addr_"
		if (!address.startsWith("mn_shield-addr_") && !address.startsWith("addr_")) {
			console.warn("Address does not start with expected prefix:", address.substring(0, 20));
			return null;
		}

		// Parse the Bech32m address
		const parsedAddress: MidnightBech32m = MidnightBech32m.parse(address);
		
		// Determine network ID based on address prefix
		// Testnet addresses start with "addr_test1" or "mn_shield-addr_test1"
		const networkId = address.includes("test") ? NetworkId.TestNet : NetworkId.MainNet;
		
		// Decode to ShieldedAddress
		const decodedAddress = ShieldedAddress.codec.decode(networkId, parsedAddress);
		return decodedAddress;
	} catch (error) {
		console.error("Failed to decode Bech32m address:", error);
		if (error instanceof Error) {
			console.error("Error details:", error.message, error.stack);
		}
		return null;
	}
}

/**
 * Convert Bech32m address to hex identifier (32 bytes, 64 hex chars)
 * Uses the coinPublicKey from the decoded ShieldedAddress as the identifier
 * Returns null if decoding fails
 */
export function bech32mToHexIdentifier(address: string): string | null {
	try {
		const shieldedAddress = decodeBech32mAddress(address);
		if (!shieldedAddress) {
			console.warn("Failed to decode Bech32m address:", address.substring(0, 50));
			return null;
		}
		
		// Use coinPublicKey as the identifier (32 bytes)
		const coinPublicKeyHex = shieldedAddress.coinPublicKeyString();
		console.log("CoinPublicKey hex:", coinPublicKeyHex, "length:", coinPublicKeyHex.length);
		
		// Ensure it's 64 hex characters (32 bytes)
		// If shorter, pad with zeros; if longer, take first 64
		let hexIdentifier = coinPublicKeyHex;
		if (hexIdentifier.length < 64) {
			hexIdentifier = hexIdentifier.padStart(64, "0");
		} else if (hexIdentifier.length > 64) {
			hexIdentifier = hexIdentifier.slice(0, 64);
		}
		
		return `0x${hexIdentifier}`;
	} catch (error) {
		console.error("Error converting Bech32m to hex identifier:", error);
		if (error instanceof Error) {
			console.error("Error details:", error.message);
		}
		return null;
	}
}

