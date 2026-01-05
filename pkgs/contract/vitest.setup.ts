import { createRequire } from 'module';
// @ts-ignore
const require = createRequire(import.meta.url);

// This setup file can be used to polyfill or shim environmental differences
// between the local and CI test runs.
console.log('Vitest setup initialized for contract package');
