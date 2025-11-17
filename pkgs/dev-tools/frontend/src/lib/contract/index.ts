// Contract exports for browser environment
// Using compiled contract files instead of importing from contract package

// CommonJS形式のcontractファイルをインポート（ViteがESMに変換）
// @ts-ignore - CommonJS module exports
import * as CounterModule from "./managed/counter/contract/index.cjs";

// Counterオブジェクトとしてエクスポート
export const Counter = CounterModule;
export * from "./witnesses";

