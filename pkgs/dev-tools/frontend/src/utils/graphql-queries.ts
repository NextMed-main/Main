/**
 * GraphQL Query Builders for Midnight Network Indexer
 * Based on actual schema introspection from the public indexer
 * 
 * Schema Summary:
 * - Query.block(offset: BlockOffset): Block - Get a single block (or latest if offset omitted)
 * - Query.transactions(offset: TransactionOffset!): [Transaction!]! - Get transactions (offset is required)
 * - BlockOffset: { hash?: HexEncoded, height?: Int }
 * - TransactionOffset: { hash?: HexEncoded, identifier?: HexEncoded }
 * 
 * Note: identifier is HexEncoded type (32-byte hex string, 64 hex characters with 0x prefix)
 */

/**
 * Introspect GraphQL schema to understand available fields
 */
export const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType {
        name
        fields {
          name
          description
          args {
            name
            description
            type {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
          type {
            name
            kind
            ofType {
              name
              kind
              fields {
                name
                description
                type {
                  name
                  kind
                }
              }
            }
          }
        }
      }
      types {
        name
        kind
        description
        fields {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
`;

/**
 * Query the latest block
 */
export function buildLatestBlockQuery(): string {
	return `
    query {
      block {
        hash
        height
        timestamp
        protocolVersion
        author
      }
    }
  `;
}

/**
 * Query a single block by height
 */
export function buildBlockByHeightQuery(height: number): string {
	return `
    query {
      block(offset: { height: ${height} }) {
        hash
        height
        timestamp
        protocolVersion
        author
        parent {
          hash
          height
        }
      }
    }
  `;
}

/**
 * Query a single block by hash
 */
export function buildBlockByHashQuery(blockHash: string): string {
	return `
    query {
      block(offset: { hash: "${blockHash}" }) {
        hash
        height
        timestamp
        protocolVersion
        author
        parent {
          hash
          height
        }
      }
    }
  `;
}

/**
 * Query a block with its transactions
 */
export function buildBlockWithTransactionsQuery(height?: number): string {
	if (height !== undefined) {
		return `
      query {
        block(offset: { height: ${height} }) {
          hash
          height
          timestamp
          protocolVersion
          author
          parent {
            hash
            height
          }
          transactions {
            hash
            protocolVersion
            applyStage
            identifiers
            raw
            merkleTreeRoot
            block {
              height
              hash
              timestamp
              author
              protocolVersion
            }
            contractActions {
              __typename
              address
              state
              chainState
              transaction {
                hash
              }
            }
          }
        }
      }
    `;
	}
	
	return `
    query {
      block {
        hash
        height
        timestamp
        protocolVersion
        author
        parent {
          hash
          height
        }
        transactions {
          hash
          protocolVersion
          applyStage
          identifiers
          raw
          merkleTreeRoot
          block {
            height
            hash
            timestamp
            author
            protocolVersion
          }
          contractActions {
            __typename
            address
            state
            chainState
            transaction {
              hash
            }
          }
        }
      }
    }
  `;
}

/**
 * Maximum recursion depth for parent chain queries
 * GraphQL servers typically limit recursion depth to prevent abuse
 * Actual limit from the indexer: 13 (14+ causes "Query is nested too deep" error)
 */
export const MAX_PARENT_CHAIN_DEPTH = 13;

/**
 * Query latest block with parent chain
 * This allows us to get multiple blocks by following the parent chain
 * @param depth - Maximum depth to traverse (capped at MAX_PARENT_CHAIN_DEPTH)
 */
export function buildLatestBlockWithParentsQuery(depth: number = 10): string {
	// Cap depth at maximum allowed
	const safeDepth = Math.min(depth, MAX_PARENT_CHAIN_DEPTH);
	
	// Build recursive parent query structure
	const buildParentQuery = (currentDepth: number, maxDepth: number): string => {
		if (currentDepth >= maxDepth) {
			return "";
		}
		
		const indent = "  ".repeat(currentDepth + 1);
		const nextDepth = currentDepth + 1;
		const parentContent = buildParentQuery(nextDepth, maxDepth);
		
		return `
${indent}parent {
${indent}  hash
${indent}  height
${indent}  timestamp
${indent}  protocolVersion
${indent}  author${parentContent}
${indent}}`;
	};
	
	const parentChain = buildParentQuery(0, safeDepth);
	
	return `
    query {
      block {
        hash
        height
        timestamp
        protocolVersion
        author${parentChain}
      }
    }
  `;
}

/**
 * Query latest block with transactions
 * This is more reliable than using identifier offset
 */
export function buildLatestBlockWithTransactionsQuery(): string {
	return `
    query {
      block {
        hash
        height
        timestamp
        protocolVersion
        author
        transactions {
          hash
          block {
            hash
            height
            timestamp
            protocolVersion
            author
          }
        }
      }
    }
  `;
}

/**
 * Query transactions with offset (offset is required)
 * TransactionOffset: { hash?: HexEncoded, identifier?: HexEncoded }
 * identifier must be a hex-encoded 32-byte value (64 hex chars with 0x prefix)
 */
export function buildTransactionsQuery(
	identifierHex: string,
): string {
	return `
    query {
      transactions(offset: { identifier: "${identifierHex}" }) {
        hash
        protocolVersion
        applyStage
        identifiers
        block {
          hash
          height
          timestamp
        }
      }
    }
  `;
}

/**
 * Query transactions by hash
 * Hash must be a hex-encoded string (with or without 0x prefix)
 * Transaction hash should be 64 hex characters (32 bytes)
 */
export function buildTransactionsByHashQuery(txHash: string): string {
	// Normalize hash: ensure it has 0x prefix and is valid hex
	let normalizedHash = txHash.trim();
	
	// Remove 0x prefix if present for validation
	let cleanHash = normalizedHash.startsWith("0x") 
		? normalizedHash.slice(2) 
		: normalizedHash;
	
	// Validate hex format
	if (!/^[0-9a-fA-F]+$/.test(cleanHash)) {
		throw new Error(`Invalid hash format: ${txHash}`);
	}
	
	// Transaction hash should be exactly 64 hex characters (32 bytes)
	// If longer, truncate to 64 characters (take first 64)
	// If shorter, pad with zeros (though this is unusual)
	if (cleanHash.length > 64) {
		cleanHash = cleanHash.slice(0, 64);
	} else if (cleanHash.length < 64) {
		cleanHash = cleanHash.padStart(64, "0");
	}
	
	// Add 0x prefix
	normalizedHash = `0x${cleanHash}`;
	
	return `
    query {
      transactions(offset: { hash: "${normalizedHash}" }) {
        hash
        protocolVersion
        applyStage
        identifiers
        raw
        merkleTreeRoot
        block {
          height
          timestamp
          hash
          author
          protocolVersion
          parent {
            hash
            height
          }
          transactions {
            hash
          }
        }
        contractActions {
          __typename
          address
          state
          chainState
          transaction {
            hash
          }
        }
      }
    }
  `;
}

/**
 * Query transactions by identifier
 * identifier can be:
 * - 72-character hex string (full identifier from transaction.identifiers)
 * - 64-character hex string with 0x prefix (data part of identifier)
 */
export function buildTransactionsByIdentifierQuery(identifier: string): string {
	// If it's a 72-character identifier, use it as-is
	// Otherwise, assume it's already formatted correctly (with or without 0x)
	const identifierValue = identifier.length === 72 ? identifier : identifier;
	
	return `
    query {
      transactions(offset: { identifier: "${identifierValue}" }) {
        hash
        protocolVersion
        applyStage
        identifiers
        raw
        merkleTreeRoot
        block {
          height
          timestamp
          hash
          author
          protocolVersion
          parent {
            hash
            height
          }
          transactions {
            hash
          }
        }
        contractActions {
          __typename
          address
          state
          chainState
          transaction {
            hash
          }
        }
      }
    }
  `;
}

/**
 * Query contract actions by address
 * Address must be a hex-encoded string (with or without 0x prefix)
 */
export function buildContractActionQuery(address: string): string {
	// Normalize address: ensure it has 0x prefix and is valid hex
	let normalizedAddress = address.trim();
	
	// Remove 0x prefix if present for validation
	const cleanAddress = normalizedAddress.startsWith("0x") 
		? normalizedAddress.slice(2) 
		: normalizedAddress;
	
	// Validate hex format
	if (!/^[0-9a-fA-F]+$/.test(cleanAddress)) {
		throw new Error(`Invalid address format: ${address}`);
	}
	
	// Add 0x prefix if not present
	if (!normalizedAddress.startsWith("0x")) {
		normalizedAddress = `0x${normalizedAddress}`;
	}
	
	return `
    query {
      contractAction(address: "${normalizedAddress}") {
        address
        state
        chainState
        transaction {
          hash
          protocolVersion
          applyStage
          identifiers
          block {
            hash
            height
            timestamp
          }
        }
      }
    }
  `;
}

/**
 * Query a single transaction by hash (returns first result)
 * Note: transactions returns a list, so we get the first one
 */
export function buildTransactionByHashQuery(txHash: string): string {
	return `
    query {
      transactions(offset: { hash: "${txHash}" }) {
        hash
        protocolVersion
        applyStage
        identifiers
        raw
        merkleTreeRoot
        block {
          hash
          height
          timestamp
          protocolVersion
          author
        }
        contractActions {
          address
          state
        }
      }
    }
  `;
}
