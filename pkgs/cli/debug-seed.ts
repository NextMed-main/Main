
import * as bip39 from 'bip39';

const mnemonic = "toast shrimp lumber shop keen obvious fit diary height olympic demise legend hazard reform horn two fish virus fiction bleak rent tortoise ancient fetch";

console.log("Mnemonic:", mnemonic);
const entropy = bip39.mnemonicToEntropy(mnemonic);
console.log("Entropy (Hex):", entropy);
console.log("Entropy Length (chars):", entropy.length);
console.log("Entropy Length (bytes):", entropy.length / 2);

const seed = bip39.mnemonicToSeedSync(mnemonic);
console.log("Seed (Hex):", seed.toString('hex'));
console.log("Seed Length (bytes):", seed.length);
