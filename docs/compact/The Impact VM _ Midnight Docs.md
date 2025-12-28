9/26/25, 8:38 AM

The Impact VM | Midnight Docs

Reference

How Midnight works

The Impact VM

The Impact VM

INFO

Impact is still under active revision. Expect its attributes, including storage-related costs, to change.

Currently, users cannot write Impact manually; this feature may be added in the future.

On-chain parts of programs are written in Impact, our on-chain VM language. You should not need to worry about the details of impact

when writing contracts; however, you may see it appear when inspecting transactions and contract outputs.

Impact is a stack-based, non-Turing-complete state manipulation language. A contract is executed on a stack containing three things:

a 'context' object describing context related to the containing transaction

an 'effects' object gathering actions performed by the contract during the execution

the contract's current state.

Program execution proceeds linearly, with no operations being able to decrease the program counter and every operation being

bounded in the time it takes. Program execution has an attached cost, which may be bounded by a 'gas' limit. Programs can either

abort, invalidating this (part of) a transaction, or succeed, in which case they must leave a stack in the same shape as they started. The
Ask AI
Ask AI

resulting effects must match the transcript's declared effects, and the contract state must be marked as storable, in which case it is

adopted as the updated state.

Transcripts

https://docs.midnight.network/develop/how-midnight-works/impact

Feedback

1/11

9/26/25, 8:38 AM

Execution transcripts consist of:

The Impact VM | Midnight Docs

a declared gas bound, used to derive the fees for this call

a declared effects object, used to bind the contract's semantics to that of other parts

the program to execute.

Values

The Impact stack machine operates on the following state values:

null
<x: y> , a ﬁeld-aligned binary cell
Map { k1: v1, k2: v2, ... } , a map from ﬁeld-aligned binary values to state values
Array(n) [ v0, v1, ... ] , an array of  0 < n < 16  state values
MerkleTree(d) { k0: v1, k2: v2, ... } , a sparse, ﬁxed-depth  1 <= d <= 32  Merkle tree, with the slots  k0 ,  k2 , ...,
containing the leaf hashes  v1 ,  v2 , ... (typically represented as hex strings).

Field-aligned binary

The basic data types used in Impact are 'ﬁeld-aligned binary' (FAB) values. These values can store complex data structures in a binary

representation while keeping the information necessary to encode them as ﬁeld elements in any prime ﬁeld.

Aligned values consist of a sequence of aligned atoms, each of which consists of a byte string and an alignment atom, where alignment

atoms are one of:

f , indicating a ﬁeld alignment: the atom will be interpreted as a little-endian representation of a ﬁeld element.

https://docs.midnight.network/develop/how-midnight-works/impact

Feedback

2/11

9/26/25, 8:38 AM

The Impact VM | Midnight Docs

c , indicating a compression alignment: the atom will be interpreted as a ﬁeld element derived by hashing its value.
bn, indicating an  n -byte alignment: the atom will be interpreted as a sequence of ﬁeld elements depending on the prime ﬁeld and
curve to compactly encode

 bytes.

n

Programs

A program is a sequence of operations, consisting of an opcode, potentially followed by a number of arguments depending on the
speciﬁc opcode. Programs can be run in two modes: evaluating and verifying. In verifying mode,  popeq[c]  arguments are enforced
for equality, while in evaluating mode, the results are gathered instead.

b

a

 above

), and replacing them with

Each  Op  has a ﬁxed effect on the stack, which will be written as  -{a, b} +{c, d} : consuming items  a  and  b  being at the top of the
). The number of values here is just an example. State values
stack (with

d
are immutable from the perspective of programs: a value on the stack cannot be changed, but it can be replaced with a modiﬁed
version of the same value. We write  [a]  to refer to the value stored in the cell  a . Due to the ubiquity of it, we write 'sets  [a] := ... '
for 'create  a  as a new cell containing  ... '. We preﬁx an output value with a  '  to indicate this is a weak value, kept solely in-memory,
and not written to disk, and an input value with  '  to indicate it may be a weak value. We use  "  and  †  to indicate that an input may be a
weak value, and iff it is, the correspondingly marked output will be a weak value.

 above

 (with

 and

c

d

c

Where arguments are used, we use  State  for a state value,  u21  for a 21-bit unsigned integer, and  path(n)  for a sequence of either
ﬁeld-aligned binary values, or the symbol  stack , indicating keys to use in indexing, either directly, or to use stack values instead.

Name

Opcode

Stack

Arguments

Cost

(unscaled)

Description

noop

00

-{}

+{}

n: u21

nothing

n

https://docs.midnight.network/develop/how-midnight-works/impact

Feedback

3/11

9/26/25, 8:38 AM

The Impact VM | Midnight Docs

Name

Opcode

Stack

Arguments

Cost

(unscaled)

Description

lt

eq

01

02

-{'a, 'b}

+{c}

-{'a, 'b}

+{c}

type

03

-{'a}

+{b}

size

04

-{'a}

+{b}

new

05

-{'a}

+{b}

and

06

-{'a, 'b}

+{c}

or

07

-{'a, 'b}

+{c}

neg

08

-{'a}

+{b}

-

-

-

-

-

-

-

-

https://docs.midnight.network/develop/how-midnight-works/impact

1

1

1

1

1

1

1

1

sets  [c] := [a] < [b]

sets  [c] := [a] == [b]

sets  [b] := typeof(a)

sets  [b] := size(a)

sets  [b] := new [a]

sets

[c] := [a] & [b]

sets `[c] := [a]

sets  [b] := ![a]

Feedback

4/11

9/26/25, 8:38 AM

The Impact VM | Midnight Docs

Name

Opcode

Stack

Arguments

Cost

(unscaled)

Description

log

09

-{'a}

+{}

root

0a

-{'a}

+{b}

pop

0b

-{'a}

+{}

-

-

-

pope

q

pope

qc

0c

0d

-{'a}

a: State
only when

+{}

validating

-{'a}

a: State
only when

+{}

validating

addi

0e

subi

0f

+{b}

+{b}

-{'a}

c: State

-{'a}

c: State

https://docs.midnight.network/develop/how-midnight-works/impact

1

1

1

`

`

1

1

outputs  a  as an event

sets  [b] := root(a)

removes  a

a

a

sets  [b] := [a] + c , where addition is deﬁned below

sets  [b] := [a] - c , where subtraction is deﬁned
below

Feedback

5/11

9/26/25, 8:38 AM

The Impact VM | Midnight Docs

Name

Opcode

Stack

Arguments

Cost

(unscaled)

Description

push

10

push

s

bran

ch

11

12

-{}

a: State

+{'a}

-{}

a: State

+{a}

-{'a}

+{}

jmp

13

-{}

+{}

add

14

-{'a, 'b}

+{c}

sub

15

-{'a, 'b}

+{c}

n: u21

n: u21

-

-

conc

at

conc

atc

16

17

-{'a, 'b}

+{c}

-{'a, 'b}

+{c}

n: u21

n: u21

https://docs.midnight.network/develop/how-midnight-works/impact

`

`

a

a

1

1

1

1

1

1

if  a  is non-empty, skip  n  operations.

skip  n  operations.

sets  [c] := [a] + [b]

sets

[c] := [b] - [a]

sets  [c] = [b] ++ [a] , if `

as  concat , but  a  and  b  must already be in-memory

Feedback

6/11

9/26/25, 8:38 AM

The Impact VM | Midnight Docs

Name

Opcode

Stack

Arguments

Cost

(unscaled)

Description

memb

er

18

-{'a, 'b}

+{c}

rem

19

-{a, "b}

+{"c}

remc

1a

-{a, "b}

+{"c}

-{x*, "a}

dup

3n

+{"a, x*,

"a}

-{"a, x*,

†b}     +

{†b, x*,

"a}

-{k*, "a}

c: path(n)

+{"b}

-{k*, "a}

c: path(n)

+{"b}

swap

4n

idx

5n

idxc

6n

-

-

-

-

-

size(b)

sets  [c] := has_key(b, a)

size(b)

sets  c := rem(b, a, false)

size(b)

sets  c := rem(b, a, true)

1

duplicates  a , where  x*  are  n  stack items

1

swaps two stack items, with

 items

n

x*

 between them

`

`

c

c

Feedback

7/11

https://docs.midnight.network/develop/how-midnight-works/impact

9/26/25, 8:38 AM

The Impact VM | Midnight Docs

Name

Opcode

Stack

Arguments

Cost

(unscaled)

Description

-{k*, "a}

idxp

7n

+{"b, pth

c: path(n)

*}

idxp

c

-{k*, "a}

8n

+{"b, pth

c: path(n)

*}

`

c

`

c

-{"a, pth

ins

9n

*}       +

{†b}

-{"a, pth

insc

an

*}       +

{†b}

-

-

where  pth*  is  {key_{n+1}, x_{n+1}, ..., key_
1, x_1}  set  x'_{n+2} = a ,  x'_j = ins(x_j, key
_j, cached, x'_{j+1}) ,  b = x'_1 .  †  is the
weakest modiﬁer of  a  and  x_j s, and  cached  set to  fa

sum size

(x_i)

lse

sum size

(x_i)

as  ins , but with  cached  set to  true

ckpt

ff

-{}

+{}

denotes boundary between internally atomic program

1

segments. Should not be crossed by jumps.

In the description above, the following short-hand notations are used. Where not speciﬁed, result values are placed in a  Cell  and
encoded as FAB values.

Feedback

https://docs.midnight.network/develop/how-midnight-works/impact

8/11

9/26/25, 8:38 AM

The Impact VM | Midnight Docs

a + b ,  a - b , or  a < b  (collectively  a op b ), for applying  op  on the contents of cells  a  and  b , interpreted as 64-bit unsigned
integers, with alignment  b8 .

 is the ﬁeld aligned binary concatenation of

 and

.

a ++ b
a == b  for checking two cells for equality, at least one of which must contain at most 64 bytes of data
a & b ,  a | b ,  !a  are processed as boolean and, or, and not over the contents of cells  a  and maybe  b . These must encode 1 or
0.

a

b

typeof(a)  returns a tag representing the type of a state value:

<a: b> : 0
null : 1
Map { ... } : 2
Array(n) { ... } : 3 + n * 32
MerkleTree(n) { ... } : 4 + n * 32

 returns the number of non-null entries is a

,

 for an

size(a)
Array(n)
has_key(a, b)  returns  true  if  b  is a key to a non-null value in the  Map a .
new ty  creates a new instance of a state value according to the tag  ty  (as returned by  typeof ):

MerkleTree(n)

Map

n

 or

.

cell: Containing the empty value.

null  for itself
Map : The empty map
Array(n) : An array on  n null s
MerkleTree(n) : A blank Merkle tree

a.get(b, cached)  retrieves the sub-item indexed with  b . If the sub-item is not loaded in memory, and cached  is  true , this
command fails. For different  a :

, the value stored at the key

a: Map
a: Array(n) , the value at the index  b  < n

b

https://docs.midnight.network/develop/how-midnight-works/impact

Feedback

9/11

9/26/25, 8:38 AM

The Impact VM | Midnight Docs

rem(a, b, cached)  removes the sub-item indexed (as in  get ) with  b  from  a . If the sub-item is not loaded in memory, and ca
ched  is  true , this command fails.
 inserts

. If the path for this index is not loaded in memory, and

 as a sub-item into

 at index

cache

ins(a, b, cached, c)
d  is  true , this command fails.
root(a)  outputs the Merkle-tree root of the  MerkleTree(n) a .

c

a

c

Context and effects

The  context  is an  Array(_) , with the following entries, in order:

CAUTION

Currently, only the ﬁrst two of these are correctly initialized!

1. A

Cell

 containing the 256-bit aligned current contract's address.

2. A  Map  from  CoinCommitment  keys to 64-bit aligned Merkle tree indicies, for all newly allocated coins.
3. A  Cell  containing the block's 64-bit aligned seconds since the UNIX epoch approximation.
4. A  Cell  containing the block's 32-bit aligned seconds indicating the maximum amount that the former value may diverge.
5. A  Cell  containing the block's 256-bit hash.

This list may be extended in the future in a minor version increment.

The  effects  is an  Array(_) , with the following entries, in order:

1. A  Map  from  Nullifier s to  null s, representing a set of claimed nulliﬁers.
2. A  Map  from  CoinCommitment s to  null s, representing a set of received coins claimed.
3. A  Map  from  CoinCommitment s to  null s, representing a set of spent coins claimed.

https://docs.midnight.network/develop/how-midnight-works/impact

Feedback

10/11

9/26/25, 8:38 AM

The Impact VM | Midnight Docs

4. A  Map  from  (Address, Bytes(32), Field)  to  null , representing the contract calls claimed.
5. A  Map  from  Bytes(32)  to cells of  u64 , representing coins minted for any specialization hash.

This list may be extended in the future in a minor version increment.

effects  is initialized to  [{}, {}, {}, {}, {}] .

All of  context  and  effects  may be considered cached. To prevent cheaply copying data into the contract state with as little as two
opcodes, both are ﬂagged as weak, and any operations performed with them. If the ﬁnal  state'  is tainted, the transaction fails,
preventing this from being directly copied into the contract's state.

https://docs.midnight.network/develop/how-midnight-works/impact

Feedback

11/11

