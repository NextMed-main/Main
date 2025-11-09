.# Building Blocks - Midnight Documentation Summary

## Overview
Midnight's transaction structure is unique and may not be immediately intuitive. This document covers the structure of transactions, their effects, and fundamental components.

## Transactions

In Midnight, transactions consist of:

- **Guaranteed Zswap offer** - Always executed
- **Optional fallible Zswap offer** - May fail during execution
- **Optional contract calls segment**, containing:
  - A sequence of contract calls or contract deploys
  - A cryptographic binding commitment (ensures transaction integrity)
  - A binding randomness (for transaction integrity)

## Contract Deployments

- Creates a new contract if it doesn't already exist, fails otherwise
- Executed entirely as part of the 'fallible' execution step
- Transaction parts consist of:
  - Contract state
  - Nonce
- Creates new contract at an address that is a hash of the deploy part

## Contract Calls

- Invokes a specific contract address and entry point
- Entry points are keys into the contracts' operation map
- Combined with address, they select the verifier key for validation

### Contract Call Components:
- **Guaranteed and fallible transcript** - Declares visible effects of the call
- **Communication commitment** - Used for cross-contract interaction (still under development)
- **Zero-knowledge proof** - Validates transcripts and binds to other transaction elements

> **Note**: Cross-contract interaction is still under development and not available for use currently.

## Merging

- Zswap permits atomic swaps by allowing transaction merging
- Currently, contract call sections cannot be merged
- Two transactions can be merged if at least one has an empty contract call section
- Results in a new composite transaction with combined effects of both inputs

## Transaction Integrity

### Basic Mechanism:
- Inherits from Zswap's transaction integrity mechanism
- Uses Pedersen commitments due to merge capability
- Commitments commit to the value of each input and output
- Homomorphically summed before integrity checking
- Only creators of individual components know the opening randomnesses

### Contract Call Integration:
- Contract call section contributes to overall Pedersen commitment
- Contribution restricted to carry no value vector
- Requires knowledge of generator exponent via Fiat-Shamir transformed Schnorr proof

This binding mechanism ensures that user funds are spent as originally intended, maintaining transaction integrity across the system.

---

# Compact Language Reference

## Language Overview

Compact is a strongly statically typed, bounded smart contract language, designed to be used in combination with TypeScript for writing smart contracts for the three-part structure of Midnight:

1. **Replicated component** on a public ledger
2. **Zero-knowledge circuit component**, confidentially proving the correctness of the former
3. **Local, off-chain component** that can perform arbitrary code

## Contract Structure

Each contract in Compact can have four kinds of code:
- **Type declarations** - to support all of the following
- **Declarations of data** - that the contract stores in the public ledger
- **Declarations of witness functions** - to be supplied in TypeScript
- **Circuit definitions** - that serve as the operational core of a smart contract

## Type System

### Primitive Types

- **Boolean** - `true` or `false`
- **Uint<m..n>** - bounded unsigned integers between 0 and n
- **Uint<n>** - sized unsigned integers with binary representations using up to n bits
- **Field** - elements in the scalar prime field of the zero-knowledge proving system
- **[T, ...]** - tuple values with element types T, ...
- **Vector<n, T>** - shorthand for tuple type [T, ...] with n occurrences of type T
- **Bytes<n>** - byte array values of length n
- **Opaque<s>** - opaque values with tag s (e.g., "string", "Uint8Array")

### User-Defined Types

#### Structure Types
```compact
struct Thing {
    triple: Vector<3, Field>,
    flag: Boolean,
}

struct NumberAnd<T> {
    num: Uint<32>;
    item: T
}
```

#### Enumeration Types
```compact
enum Fruit { apple, pear, plum }
```

### Subtyping
- Any type T is a subtype of itself
- Uint<0..n> is a subtype of Uint<0..m> if n ≤ m
- Uint<0..n> is a subtype of Field for all n
- [T, ...] is a subtype of [S, ...] if same length and each T is subtype of corresponding S

## Circuits

The basic operational element in Compact is the `circuit`. Circuits are compiled directly into zero-knowledge circuits.

### Circuit Declaration
```compact
circuit c(a: A, b: B, ...): R {
    ...
}

// Generic circuit
circuit id<T>(value: T): T {
    return value;
}
```

### Pure vs Impure Circuits
- **Pure circuits** - compute outputs from inputs without reference to public/private state
- **Impure circuits** - contain ledger operations, calls to impure circuits, or witness calls

```compact
pure circuit c(a: Field): Field {
    ...
}
```

## Statements

### For Loops
```compact
for (const i of <vector>) <statement>
for (const i of <lower>..<upper>) <statement>
```

### If Statements
```compact
if (testexpr)
    <statement>

if (testexpr)
    <statement>
else
    <statement>
```

### Return Statements
```compact
return;          // for circuits with return type []
return <expr>;   // for circuits with other return types
```

### Assert Statements
```compact
assert(<expr>, "what constraint was violated");
```

### Const Binding
```compact
const x = <expr>;
const x = <expr>, y = <expr>;
const x: T = <expr>;  // with type annotation
```

## Expressions

### Literals
- Boolean: `true`, `false`
- Numeric: `0`, `42`, `1000`
- String: `"hello"`, `'world'`
- Padded string: `pad(n, s)`

### Structure Creation
```compact
Thing {[0, 1, 2], true}              // positional
NumberAnd<Uint<8>> { item: 255, num: 0 }  // named
S { ...s1, b: true }                 // spread syntax
```

### Tuple Creation
```compact
[1, 2, 3]
[true, "hello", 42]
[]  // empty tuple
```

### Circuit and Witness Calls
```compact
someCircuit(arg1, arg2)
genericCircuit<Field>(value)

// Anonymous circuit
(x: Field, y: Boolean): Field => x + (y ? 1 : 0)
```

### Arithmetic Operations
```compact
a + b    // addition
a - b    // subtraction
a * b    // multiplication
```

### Comparison Operations
```compact
a == b   // equals
a != b   // not equals
a < b    // less than
a > b    // greater than
a <= b   // less than or equals
a >= b   // greater than or equals
```

### Logical Operations
```compact
!a       // boolean negation
a && b   // logical and (short-circuit)
a || b   // logical or (short-circuit)
```

### Conditional Expressions
```compact
condition ? value_if_true : value_if_false
```

### Type Casting
```compact
value as TargetType
```

### Access Operations
```compact
tuple[0]        // tuple element access
struct.field    // structure member access
```

## Ledger Operations

### Ledger Field Declarations
```compact
import CompactStandardLibrary;

ledger val: Field;
export ledger cnt: Counter;
sealed ledger u8list: List<Uint<8>>;
export sealed ledger mapping: Map<Boolean, Field>;
```

### Ledger State Types
- **T** - any Compact type (implicitly Cell<T>)
- **Counter** - integer counter
- **Set<T>** - set of values of type T
- **Map<K, T>** - mapping from keys K to values T
- **List<T>** - list of values of type T
- **MerkleTree<n, T>** - Merkle tree with depth n and values T
- **HistoricMerkleTree<n, T>** - historic Merkle tree

### Ledger Operations
```compact
// Cell operations (syntactic sugar)
x           // equivalent to x.read()
x = val     // equivalent to x.write(val)

// Counter operations (syntactic sugar)
c           // equivalent to c.read()
c += val    // equivalent to c.increment(val)
c -= val    // equivalent to c.decrement(val)

// Explicit operations
field.read()
field.write(value)
counter.increment(amount)
counter.decrement(amount)
set.insert(value)
map.lookup(key)
list.push(value)
```

### Kernel Operations
```compact
import CompactStandardLibrary;

circuit f(): ContractAddress {
    return kernel.self();
}
```

## Witness Functions

Witness functions call external TypeScript code for private state:

```compact
witness something(x: Boolean): Field;

// Called like a circuit
const result = something(true);
```

> **DANGER**: Do not assume witness function implementations are trustworthy. Results should be treated as untrusted input.

## Modules and Imports

### Module Declaration
```compact
module Mod1 {
    export { G };
    export struct S { x: Uint<16>, y: Boolean }
    circuit F(s: S): Boolean {
        return s.y;
    }
    circuit G(s: S): Uint<16> {
        return F(s) ? s.x : 0;
    }
}
```

### Importing Modules
```compact
import Runner;                    // import module
import Runner prefix SomePrefix_; // import with prefix
import Identity<Field>;           // import generic module
import CompactStandardLibrary;    // import standard library
```

### File Inclusion
```compact
include "path/to/file";
```

## Advanced Features

### Map and Fold Operations
```compact
// Map over vectors
map(circuit, vector1, vector2, ...)

// Fold over vectors
fold(circuit, initial_value, vector1, vector2, ...)
```

### Contract Constructor
```compact
constructor(x: Uint<16>) {
    field1 = 2 * x;
    init(x);
}
```

### Sealed Ledger Fields
```compact
export sealed ledger field2: Uint<32>;  // can only be set during initialization
```

### Default Values
```compact
default<Boolean>     // false
default<Uint<32>>    // 0
default<Field>       // 0
default<[T, S]>      // [default<T>, default<S>]
default<MyStruct>    // struct with all fields set to defaults
```

## TypeScript Integration

### Type Representations
- **Boolean** → `boolean`
- **Field** → `bigint` with runtime bounds checks
- **Uint<n>** → `bigint` with runtime bounds checks
- **[T, ...]** → `[S, ...]` or `S[]` with runtime length checks
- **Bytes<n>** → `Uint8Array` with runtime length checks
- **Opaque<"string">** → `string`
- **struct** → object with corresponding fields
- **enum** → `number` with runtime membership checks

### Generated TypeScript Interface
```typescript
// Contract exports
type Witnesses<T>;        // witness function signatures
type ImpureCircuits<T>;   // impure circuit signatures
type PureCircuits;        // pure circuit signatures
type Circuits<T>;         // all circuit signatures
class Contract<T, W>;     // main contract class
const pureCircuits;       // pure circuits as functions
type Ledger;              // ledger state access
function ledger(state);   // ledger constructor
```

## Best Practices

1. **Type Safety**: Always use type annotations for circuit parameters and return types
2. **Witness Security**: Treat witness function results as untrusted input
3. **Ledger Design**: Use appropriate ledger types for your use case
4. **Circuit Purity**: Mark circuits as pure when possible for better optimization
5. **Error Handling**: Use assert statements for constraint validation
6. **Module Organization**: Use modules to organize related functionality
7. **Generic Programming**: Use generics for reusable code patterns

---

# Explicit Disclosure: The Midnight "Witness Protection Program"

## Overview

Midnight supports selective disclosure - preserving privacy whenever possible while allowing selective disclosure of private information as necessary. This differs from traditional blockchains (everything public) or strict privacy-preserving blockchains (everything private).

## Key Principle

**Privacy is the default, disclosure is an explicit exception.**

Compact requires explicit declaration of intent to disclose data that might be private before:
- Storing it in the public ledger
- Returning it from an exported circuit
- Passing it to another contract

## The `disclose()` Function

### Basic Usage

```compact
import CompactStandardLibrary;

witness getBalance(): Bytes<32>;
export ledger balance: Bytes<32>;

export circuit recordBalance(): [] {
    balance = disclose(getBalance());  // Explicit disclosure required
}
```

### Without `disclose()` - Compiler Error

```compact
export circuit recordBalance(): [] {
    balance = getBalance();  // ERROR: missing disclose() wrapper
}
```

**Error Message:**
```
Exception: potential witness-value disclosure must be declared but is not:
witness value potentially disclosed:
  the return value of witness getBalance at line 2 char 1
nature of the disclosure:
  ledger operation might disclose the witness value
```

## Witness Data Sources

Witness data comes from:
1. **External callback functions** declared as witnesses
2. **Exported circuit arguments**
3. **Contract constructor arguments**
4. **Any value derived from witness data**

## Tracking Indirect Disclosure

The compiler tracks witness data through complex paths:

```compact
struct S { x: Field; }

circuit obfuscate(x: Field): Field {
    return x + 73;  // Still contains witness data
}

export circuit recordBalance(): [] {
    const s = S { x: getBalance() as Field };
    const x = obfuscate(s.x);
    balance = x as Bytes<32>;  // ERROR: Still needs disclose()
}
```

**The compiler traces the full path:**
```
via this path through the program:
  the binding of s at line 11 char 3
  the argument to obfuscate at line 12 char 13
  the computation at line 7 char 10
  the binding of x at line 12 char 3
  the right-hand side of = at line 13 char 11
```

## Conditional Expression Disclosure

Even conditional expressions can cause disclosure:

```compact
witness getBalance(): Uint<64>;

export circuit balanceExceeds(n: Uint<64>): Boolean {
    return getBalance() > n;  // ERROR: Comparison result discloses info
}
```

**Error Message:**
```
nature of the disclosure:
  the value returned from exported circuit balanceExceeds might disclose the result of a
  comparison involving the witness value
```

## Placement Best Practices

### 1. Close to Disclosure Point
Place `disclose()` as close to the actual disclosure as possible:

```compact
export circuit recordBalance(): [] {
    const s = S { x: getBalance() as Field };
    const x = obfuscate(s.x);
    balance = disclose(x) as Bytes<32>;  // Good: close to disclosure
}
```

### 2. Structured Values
For structured values, only wrap portions expected to contain witness data:

```compact
struct UserData {
    publicId: Field,
    privateBalance: Field,
}

// Only disclose the private portion
const userData = UserData {
    publicId: user.id,
    privateBalance: disclose(getBalance())
};
```

### 3. Always-Safe Witnesses
If a witness always returns non-private data, place `disclose()` directly on the call:

```compact
witness getPublicConfig(): Field;  // Always returns public data

export circuit updateConfig(): [] {
    config = disclose(getPublicConfig());  // Safe to disclose immediately
}
```

## Safe Standard Library Functions

Some Compact standard library functions sufficiently disguise witness data:

```compact
// These are treated as NOT containing witness data:
transientCommit(witnessValue)  // Commitment hides original value
transientHash(witnessValue)    // Hash function disguises data
```

## Implementation Details

The "witness protection program" is implemented as an **abstract interpreter**:

1. **Abstract Values**: Information about witness data containment, not actual runtime values
2. **Propagation Rules**: Operations propagate witness data information from inputs to outputs
3. **Disclosure Detection**: Halts compilation when undeclared disclosure is encountered
4. **Error Reporting**: Provides detailed path tracing for debugging

## Disclosure Scenarios

### ✅ Allowed (with `disclose()`)
- Storing witness data in public ledger
- Returning witness data from exported circuits
- Passing witness data to other contracts
- Using witness data in conditional expressions that affect control flow

### ❌ Forbidden (without `disclose()`)
- Any of the above scenarios without explicit declaration
- Accidental leakage through arithmetic operations
- Indirect disclosure through data structure manipulation

## Error Message Structure

Compact error messages provide:
1. **Location**: Exact line and character of disclosure
2. **Witness Source**: Which witness function produced the data
3. **Disclosure Nature**: How the data would be disclosed
4. **Execution Path**: Complete trace from witness to disclosure point

## Security Benefits

1. **Privacy by Default**: Prevents accidental disclosure of sensitive data
2. **Explicit Intent**: Forces developers to consciously decide on disclosure
3. **Audit Trail**: Makes it easy to identify all disclosure points in code
4. **Regulatory Compliance**: Supports selective disclosure for compliance requirements

## Example: Banking Application

```compact
import CompactStandardLibrary;

witness getAccountBalance(): Uint<64>;
witness getAccountHolder(): Bytes<32>;

// Regulatory disclosure - explicit and intentional
export circuit reportForRegulator(): [Uint<64>, Bytes<32>] {
    return [
        disclose(getAccountBalance()),  // Balance for tax reporting
        disclose(getAccountHolder())    // Identity for AML compliance
    ];
}

// Private operation - no disclosure
export circuit checkSufficientFunds(amount: Uint<64>): Boolean {
    return getAccountBalance() >= amount;  // No disclose() needed - stays private
}
```

This system ensures that sensitive financial data is only disclosed when explicitly intended, supporting both privacy and regulatory compliance.

---

# How to Keep Data Private

## Core Privacy Principle

**Key Rule**: Except for `[Historic]MerkleTree` data types, anything passed as an argument to a ledger operation in Compact, as well as all reads and writes of the ledger itself, are **publicly visible**.

What is public: **The argument or ledger value itself**, not the code that manipulates it.

```compact
export ledger items: Set<Field>;
export ledger others: MerkleTree<10, Field>;

// ❌ Reveals `item1` publicly
items.insert(item1);

// ⚠️ Reveals the *value* of `f(x)`, but not `x` directly
items.member(f(x));

// ✅ Does *not* reveal `item2` (but someone who guesses can verify!)
others.insert(item2);
```

## Privacy Strategies

### 1. Hashes and Commitments

Store only a hash or commitment of data rather than the full data itself.

#### Standard Library Primitives

- **`persistentHash`** - Building block to hash binary data (limited to `Bytes<32>`)
- **`persistentCommit`** - Create commitments from any Compact type (includes randomness)

```compact
import CompactStandardLibrary;

// Hash binary data
const dataHash = persistentHash<Bytes<32>>(secretData);

// Commit with randomness (prevents guessing attacks)
const commitment = persistentCommit(secretValue, randomness);
```

#### Why Randomness Matters

1. **Prevents Guessing Attacks**: Without randomness, attackers can guess values and check if the hash matches
2. **Prevents Correlation**: Even if you can't guess the value, identical hashes would reveal when the same value appears twice

```compact
// ❌ Bad: Predictable for small value sets (e.g., votes)
ledger votes: Set<Bytes<32>>;
votes.insert(persistentHash(vote));  // Attackers can guess "yes"/"no"

// ✅ Good: Randomness prevents guessing
votes.insert(persistentCommit(vote, secretRandomness));
```

#### Randomness Best Practices

**Fresh randomness** for each commitment is ideal, but you can reuse randomness if you guarantee the data will never be the same:

```compact
// Reusing secret key as randomness source with round counter
const commitment = persistentCommit(data, persistentHash([secretKey, roundNumber]));
```

> **⚠️ CAUTION**: Be very careful with randomness! It's easy to get wrong. Err on the safe side.

### 2. Authenticating with Hashes

Zero-knowledge proofs allow emulating signatures using just hashes - proving knowledge of a secret key without revealing it.

```compact
import CompactStandardLibrary;

witness secretKey(): Bytes<32>;
export ledger organizer: Bytes<32>;
export ledger restrictedCounter: Counter;

constructor() {
    organizer = publicKey(secretKey());
}

export circuit increment(): [] {
    assert(organizer == publicKey(secretKey()), "not authorized");
    restrictedCounter.increment(1);
}

circuit publicKey(sk: Bytes<32>): Bytes<32> {
    return persistentHash<Vector<2, Bytes<32>>>([
        pad(32, "some-domain-seperator"),
        sk
    ]);
}
```

### 3. Merkle Trees for Private Sets

`MerkleTree<n, T>` and `HistoricMerkleTree<n, T>` allow proving membership without revealing **which** member.

#### Key Advantage over Simple Sets

```compact
// ❌ Set<Bytes<32>> with commitments reveals WHICH commitment was used
Set<Bytes<32>> commitmentSet;
commitmentSet.member(someCommitment);  // Reveals which commitment

// ✅ MerkleTree does NOT reveal which entry's membership is proven
MerkleTree<10, Field> items;
// Proves membership without revealing which item
```

#### Merkle Tree Usage Pattern

```compact
import CompactStandardLibrary;

export ledger items: MerkleTree<10, Field>;
witness findItem(item: Field): MerkleTreePath<10, Field>;

export circuit insert(item: Field): [] {
    items.insert(item);
}

export circuit check(item: Field): [] {
    const path = findItem(item);
    assert(items.checkRoot(merkleTreePathRoot<10, Field>(path.value)), "path must be valid");
}
```

**TypeScript witness implementation:**
```typescript
function findItem(context: WitnessContext, item: bigint): MerkleTreePath<bigint> {
    return context.ledger.items.findPathForLeaf(item)!;
}
```

#### MerkleTree vs HistoricMerkleTree

- **`MerkleTree<n, T>`**: Proofs only valid against current tree state
- **`HistoricMerkleTree<n, T>`**: Accepts proofs against prior versions
  - ✅ Good for frequent insertions (old proofs remain valid)
  - ❌ Not suitable for frequent removals/replacements (could validate invalid proofs)

### 4. The Commitment/Nullifier Pattern

A powerful pattern for single-use authentication tokens, used by Zerocash and Zswap.

#### Pattern Structure

1. **Commitments**: Stored in `MerkleTree` (proves authorization without revealing which)
2. **Nullifiers**: Stored in `Set` (prevents double-spending)

#### How It Works

1. Create entry in Merkle tree (commitment)
2. When using token:
   - Prove existence in Merkle tree
   - Add nullifier to Set (assert not already there)
   - This prevents reuse while hiding which token was used

#### Implementation Example

```compact
import CompactStandardLibrary;

witness findAuthPath(pk: Bytes<32>): MerkleTreePath<10, Bytes<32>>;
witness secretKey(): Bytes<32>;

export ledger authorizedCommitments: HistoricMerkleTree<10, Bytes<32>>;
export ledger authorizedNullifiers: Set<Bytes<32>>;
export ledger restrictedCounter: Counter;

// Add authority (anyone can call)
export circuit addAuthority(pk: Bytes<32>): [] {
    authorizedCommitments.insert(pk);
}

// Use authority (single-use, private)
export circuit increment(): [] {
    const sk = secretKey();
    const authPath = findAuthPath(publicKey(sk));

    // Prove authorization without revealing which key
    assert(authorizedCommitments.checkRoot(
        merkleTreePathRoot<10, Bytes<32>>(authPath)
    ), "not authorized");

    // Prevent double-use
    const nul = nullifier(sk);
    assert(!authorizedNullifiers.member(nul), "already incremented");
    authorizedNullifiers.insert(disclose(nul));

    restrictedCounter.increment(1);
}

// Domain-separated commitment and nullifier
circuit publicKey(sk: Bytes<32>): Bytes<32> {
    return persistentHash<Vector<2, Bytes<32>>>([
        pad(32, "commitment-domain"),
        sk
    ]);
}

circuit nullifier(sk: Bytes<32>): Bytes<32> {
    return persistentHash<Vector<2, Bytes<32>>>([
        pad(32, "nullifier-domain"),
        sk
    ]);
}
```

#### Critical Security Requirements

1. **Domain Separation**: Commitments and nullifiers must use different domain separators
2. **Secret Knowledge**: Creating nullifiers should require secret knowledge
3. **Uniqueness**: Same secret should produce different commitment and nullifier

## Privacy Patterns Summary

| Pattern | Use Case | Privacy Level | Complexity |
|---------|----------|---------------|------------|
| **Hash/Commit** | Hide single values | High (with randomness) | Low |
| **Hash Authentication** | Prove identity | High | Low |
| **Merkle Trees** | Private set membership | Very High | Medium |
| **Commit/Nullifier** | Single-use tokens | Very High | High |

## Best Practices

1. **Always use randomness** with commitments for small value spaces
2. **Use domain separators** to prevent hash collision attacks
3. **Prefer MerkleTree** over Set when you need private membership proofs
4. **Use HistoricMerkleTree** for systems with frequent insertions
5. **Implement commit/nullifier** for advanced privacy with single-use semantics
6. **Test privacy properties** - ensure no unintended information leakage

## Common Pitfalls

❌ **Storing raw values in ledger** (except in MerkleTree)
❌ **Reusing randomness** without ensuring data uniqueness
❌ **Missing domain separators** in hash functions
❌ **Using Set instead of MerkleTree** when privacy is needed
❌ **Forgetting disclose()** when storing nullifiers

---

# Writing Contracts in Compact

## Basic Contract Structure

Every Compact contract starts with a language version declaration and imports:

```compact
pragma language_version 0.16;
import CompactStandardLibrary;
```

### Data Types and Structures

Define custom data types using enums and structs:

```compact
enum State {
    UNSET,
    SET
}

struct UserData {
    publicKey: Bytes<32>;
    balance: Uint<64>;
    isActive: Boolean;
}
```

### Ledger Section

The ledger section defines the contract's on-chain state:

```compact
export ledger authority: Bytes<32>;
export ledger value: Uint<64>;
export ledger state: State;
export ledger round: Counter;
```

### Constructor

Initialize ledger fields when the contract is deployed:

```compact
constructor(sk: Bytes<32>, v: Uint<64>) {
    authority = disclose(publicKey(round, sk));
    value = disclose(v);
    state = State.SET;
}
```

### Circuit Definitions

Circuits are the main entry points for contract functionality:

```compact
// Public getter - unrestricted access
export circuit get(): Uint<64> {
    assert(state == State.SET, "Attempted to get uninitialized value");
    return value;
}

// Witness function for local computation
witness secretKey(): Bytes<32>;

// State-changing circuit
export circuit set(v: Uint<64>): [] {
    assert(state == State.UNSET, "Attempted to set initialized value");
    const sk = secretKey();
    const pk = publicKey(round, sk);
    authority = disclose(pk);
    value = disclose(v);
    state = State.SET;
}

export circuit clear(): [] {
    assert(state == State.SET, "Attempted to clear uninitialized value");
    const sk = secretKey();
    const pk = publicKey(round, sk);
    assert(authority == pk, "Attempted to clear without authorization");
    state = State.UNSET;
    round.increment(1);
}
```

### Helper Circuits

Define utility circuits for common operations:

```compact
circuit publicKey(round: Field, sk: Bytes<32>): Bytes<32> {
    return persistentHash<Vector<3, Bytes<32>>>(
        [pad(32, "midnight:examples:lock:pk"), round as Bytes<32>, sk]
    );
}
```

### Confidentiality Rules

In Compact contracts:
- All data not in ledger fields and not arguments/return values of ledger operations is kept confidential
- All computation not done in witness functions is enforced to be correct
- Use round parameters to prevent linkability between transactions
- Witnesses are implemented in TypeScript, not Compact

### Commitment Schemes

Use built-in commitment functions for privacy:

```compact
// Transient functions - for temporary use
circuit transientHash<T>(value: T): Field;
circuit transientCommit<T>(value: T, rand: Field): Field;

// Persistent functions - for storing in ledger state
circuit persistentHash<T>(value: T): Bytes<32>;
circuit persistentCommit<T>(value: T, rand: Bytes<32>): Bytes<32>;
```

---

# Ledger Data Types Reference

## Kernel Type

Special ADT with built-in operations:

```compact
// Time-based operations
blockTimeGreaterThan(time: Uint<64>): Boolean
blockTimeLessThan(time: Uint<64>): Boolean
checkpoint(): []

// Cross-contract operations
claimContractCall(addr: Bytes<32>, entry_point: Bytes<32>, comm: Field): []

// Zswap operations
claimZswapCoinReceive(note: Bytes<32>): []
claimZswapCoinSpend(note: Bytes<32>): []
claimZswapNullifier(nul: Bytes<32>): []

// Minting and contract info
mint(domain_sep: Bytes<32>, amount: Uint<64>): []
self(): ContractAddress
```

## Cell<value_type>

Single value storage with implicit wrapping:

```compact
// Available operations
read(): value_type
write(value: value_type): []
resetToDefault(): []
writeCoin(coin: CoinInfo, recipient: Either<ZswapCoinPublicKey, ContractAddress>): []
```

## Counter

Simple incrementable/decrementable counter:

```compact
read(): Uint<64>
increment(amount: Uint<16>): []
decrement(amount: Uint<16>): []
lessThan(threshold: Uint<64>): Boolean
resetToDefault(): []
```

## Set<value_type>

Unbounded set of unique values:

```compact
insert(elem: value_type): []
member(elem: value_type): Boolean
isEmpty(): Boolean
remove(elem: value_type): []
size(): Uint<64>
resetToDefault(): []

// Coin operations
insertCoin(coin: CoinInfo, recipient: Either<ZswapCoinPublicKey, ContractAddress>): []
```

## Map<key_type, value_type>

Key-value mapping:

```compact
insert(key: key_type, value: value_type): []
lookup(key: key_type): value_type
member(key: key_type): Boolean
isEmpty(): Boolean
remove(key: key_type): []
size(): Uint<64>
resetToDefault(): []

// Special operations
insertDefault(key: key_type): []
insertCoin(key: key_type, coin: CoinInfo, recipient: Either<ZswapCoinPublicKey, ContractAddress>): []
```

## List<value_type>

Ordered collection:

```compact
head(): Maybe<value_type>
isEmpty(): Boolean
length(): Uint<64>
pushFront(value: value_type): []
popFront(): []
resetToDefault(): []

// Coin operations
pushFrontCoin(coin: CoinInfo, recipient: Either<ZswapCoinPublicKey, ContractAddress>): []
```

## MerkleTree<nat, value_type>

Bounded Merkle tree with depth nat:

```compact
// Verification
checkRoot(rt: MerkleTreeDigest): Boolean

// Insertion operations
insert(item: value_type): []
insertHash(hash: Bytes<32>): []
insertIndex(item: value_type, index: Uint<64>): []
insertHashIndex(hash: Bytes<32>, index: Uint<64>): []
insertIndexDefault(index: Uint<64>): []

// State queries
isFull(): Boolean
resetToDefault(): []

// TypeScript access
root(): MerkleTreeDigest
firstFree(): bigint
findPathForLeaf(leaf: value_type): MerkleTreePath<value_type> | undefined
pathForLeaf(index: bigint, leaf: value_type): MerkleTreePath<value_type>
```

## HistoricMerkleTree<nat, value_type>

Merkle tree with historical root tracking:

```compact
// All MerkleTree operations plus:
checkRoot(rt: MerkleTreeDigest): Boolean  // Checks against any historical root
resetHistory(): []

// TypeScript access
history(): Iterator<MerkleTreeDigest>
```

---

# Opaque Data Types

Opaque types allow storing foreign JavaScript data in Compact contracts:

## Supported Types
- `Opaque<'string'>`: For UTF-8 encoded strings
- `Opaque<'Uint8Array'>`: For byte arrays

## Usage Pattern
```compact
// In Compact - store opaque data
export circuit storeData(data: Opaque<'string'>): [] {
    storedData = data;  // Can store but not inspect
}

export circuit retrieveData(): Opaque<'string'> {
    return storedData;  // Can return to TypeScript
}
```

```typescript
// In TypeScript - manipulate the data
const textData = "Hello, Midnight!";
await contract.storeData(textData);
const retrieved = await contract.retrieveData();
console.log(retrieved); // "Hello, Midnight!"
```

---

# Compact Standard Library

## Core Data Structures

```compact
struct Maybe<T> {
    isSome: Boolean;
    value: T;
}

struct Either<A, B> {
    isLeft: Boolean;
    left: A;
    right: B;
}

struct CurvePoint {
    x: Field;
    y: Field;
}

struct MerkleTreeDigest {
    field: Field;
}

struct ContractAddress {
    bytes: Bytes<32>;
}

struct CoinInfo {
    nonce: Bytes<32>;
    color: Bytes<32>;
    value: Uint<128>;
}

struct QualifiedCoinInfo {
    nonce: Bytes<32>;
    color: Bytes<32>;
    value: Uint<128>;
    mtIndex: Uint<64>;
}
```

## Constructor Functions

```compact
circuit some<T>(value: T): Maybe<T>;
circuit none<T>(): Maybe<T>;
circuit left<A, B>(value: A): Either<A, B>;
circuit right<A, B>(value: B): Either<A, B>;
```

## Cryptographic Primitives

```compact
// Hash functions
circuit transientHash<T>(value: T): Field;
circuit persistentHash<T>(value: T): Bytes<32>;

// Commitment schemes
circuit transientCommit<T>(value: T, rand: Field): Field;
circuit persistentCommit<T>(value: T, rand: Bytes<32>): Bytes<32>;

// Elliptic curve operations
circuit ecAdd(a: CurvePoint, b: CurvePoint): CurvePoint;
circuit ecMul(a: CurvePoint, b: Field): CurvePoint;
circuit ecMulGenerator(b: Field): CurvePoint;
circuit hashToCurve<T>(value: T): CurvePoint;
```

## Merkle Tree Operations

```compact
circuit merkleTreePathRoot<#n, T>(path: MerkleTreePath<n, T>): MerkleTreeDigest;
circuit merkleTreePathRootNoLeafHash<#n>(path: MerkleTreePath<n, Bytes<32>>): MerkleTreeDigest;
```

## Token Operations

```compact
circuit nativeToken(): Bytes<32>;
circuit tokenType(domainSep: Bytes<32>, contract: ContractAddress): Bytes<32>;
circuit mintToken(
    domainSep: Bytes<32>,
    value: Uint<128>,
    nonce: Bytes<32>,
    recipient: Either<ZswapCoinPublicKey, ContractAddress>
): CoinInfo;

circuit evolveNonce(index: Uint<64>, nonce: Bytes<32>): Bytes<32>;
```

## Zswap Operations

```compact
circuit send(
    input: QualifiedCoinInfo,
    recipient: Either<ZswapCoinPublicKey, ContractAddress>,
    value: Uint<128>
): SendResult;

circuit sendImmediate(
    input: CoinInfo,
    target: Either<ZswapCoinPublicKey, ContractAddress>,
    value: Uint<128>
): SendResult;

circuit receive(coin: CoinInfo): [];
circuit mergeCoin(a: QualifiedCoinInfo, b: QualifiedCoinInfo): CoinInfo;
circuit mergeCoinImmediate(a: QualifiedCoinInfo, b: CoinInfo): CoinInfo;
```

## Utility Functions

```compact
circuit burnAddress(): Either<ZswapCoinPublicKey, ContractAddress>;
circuit ownPublicKey(): ZswapCoinPublicKey;

// Time-based functions
circuit blockTimeLt(time: Uint<64>): Boolean;
circuit blockTimeGte(time: Uint<64>): Boolean;
circuit blockTimeGt(time: Uint<64>): Boolean;
circuit blockTimeLte(time: Uint<64>): Boolean;
```