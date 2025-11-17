# テストネットにデプロイした時の記録

```bash
You can do one of the following:
  1. Build a fresh wallet
  2. Build wallet from a seed
  3. Exit
Which would you like to do? 2
Enter your wallet seed: <ここにシードが表示される>
[11:20:50.877] INFO (5975): File path for save file not found, building wallet from scratch
[11:20:51.000] INFO (5975): Your wallet seed is: <ここにシードが表示される>
[11:20:51.001] INFO (5975): Your wallet address is: mn_shield-addr_test1j60pvf0u72y45z38hcmqznl99nmmvcggd9m3ns7zeszq9vuxverqxqx9vusaru5xcy9thmflusv6w5qpf4azghfcd7k84ef3mq8hzjg3hvyt3rtf
[11:20:51.002] INFO (5975): Your wallet balance is: 0
[11:20:51.002] INFO (5975): Waiting to receive tokens...
[11:20:51.014] INFO (5975): Waiting for funds. Backend lag: 0, wallet lag: 0, transactions=0
[11:21:01.143] INFO (5975): Waiting for funds. Backend lag: 0, wallet lag: 11, transactions=102
[11:21:11.354] INFO (5975): Waiting for funds. Backend lag: 0, wallet lag: 23, transactions=262
[11:21:21.470] INFO (5975): Waiting for funds. Backend lag: 0, wallet lag: 36, transactions=368
[11:21:31.621] INFO (5975): Waiting for funds. Backend lag: 0, wallet lag: 0, transactions=458
[11:21:31.743] INFO (5975): Your wallet balance is: 1009553269

You can do one of the following:
  1. Deploy a new counter contract
  2. Join an existing counter contract
  3. Exit
Which would you like to do? 1
[11:21:41.623] INFO (5975): Deploying counter contract...
[11:23:22.164] INFO (5975): Deployed contract at address: 0200733a6afab2b9a836ab62908836088645069545df850abe48238477a5cad4c40b

You can do one of the following:
  1. Increment
  2. Display current counter value
  3. Exit
Which would you like to do? 1
[11:24:44.832] INFO (5975): Incrementing...
[11:25:46.487] INFO (5975): Transaction 00000000e5b7813af333511135f1af16d168fda1f753c6cd2e45cda7ffac425eea6849c8 added in block 2484395

You can do one of the following:
  1. Increment
  2. Display current counter value
  3. Exit
Which would you like to do? 2
[11:25:49.004] INFO (5975): Checking contract ledger state...
[11:25:49.276] INFO (5975): Ledger state: 1
[11:25:49.276] INFO (5975): Current counter value: 1

You can do one of the following:
  1. Increment
  2. Display current counter value
  3. Exit
Which would you like to do? 3
[11:27:54.619] INFO (5975): Exiting...
Done in 510.05s.
```