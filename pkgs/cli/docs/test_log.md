# CLIテストのログ

```bash
[+] Pulling 3/3
 ✔ indexer Pulled                                                                                                2.2s 
 ✔ node Pulled                                                                                                   2.2s 
 ✔ proof-server Pulled                                                                                           2.2s 

 RUN  v4.0.8 /workspaces/midnight-sample/my-mn-app/pkgs/cli

[08:41:13.980] INFO (44719): Test containers starting...
[08:41:13.983] INFO (44719): Using compose file: standalone.yml
stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:13.985Z testcontainers [INFO] Starting DockerCompose environment "testcontainers-26e0d9a4330c"...
2025-11-09T08:41:13.985Z testcontainers [DEBUG] Checking container runtime strategy "TestcontainersHostStrategy"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:13.986Z testcontainers [DEBUG] Container runtime strategy "TestcontainersHostStrategy" is not applicable

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:13.986Z testcontainers [DEBUG] Checking container runtime strategy "ConfigurationStrategy"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:13.987Z testcontainers [DEBUG] Container runtime strategy "ConfigurationStrategy" is not applicable

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:13.987Z testcontainers [DEBUG] Checking container runtime strategy "UnixSocketStrategy"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:13.988Z testcontainers [TRACE] Fetching Docker info...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.004Z testcontainers [TRACE] Fetching remote container runtime socket path...
2025-11-09T08:41:14.004Z testcontainers [TRACE] Resolving host...
2025-11-09T08:41:14.005Z testcontainers [DEBUG] Checking gateway for Docker host...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.009Z testcontainers [TRACE] Fetching Compose info...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.009Z testcontainers [TRACE] Looking up host IPs...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.009Z testcontainers [TRACE] Initialising clients...
2025-11-09T08:41:14.009Z testcontainers [TRACE] Container runtime info:
{
  "node": {
    "version": "v22.17.0",
    "architecture": "x64",
    "platform": "linux"
  },
  "containerRuntime": {
    "host": "172.17.0.1",
    "hostIps": [
      {
        "address": "172.17.0.1",
        "family": 4
      }
    ],
    "remoteSocketPath": "/var/run/docker.sock",
    "indexServerAddress": "https://index.docker.io/v1/",
    "serverVersion": "28.3.1-1",
    "operatingSystem": "Ubuntu 24.04.2 LTS (containerized)",
    "operatingSystemType": "linux",
    "architecture": "x86_64",
    "cpus": 2,
    "memory": 8330579968,
    "runtimes": [
      "io.containerd.runc.v2",
      "runc"
    ],
    "labels": []
  }
}

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.010Z testcontainers [DEBUG] Container runtime strategy "UnixSocketStrategy" works

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.012Z testcontainers [DEBUG] Acquiring lock file "/tmp/testcontainers-node.lock"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.014Z testcontainers [DEBUG] Acquired lock file "/tmp/testcontainers-node.lock"
2025-11-09T08:41:14.014Z testcontainers [DEBUG] Listing containers...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.016Z testcontainers [DEBUG] Listed containers

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.016Z testcontainers [DEBUG] Creating new Reaper for session "0bd98e3a07c4" with socket path "/var/run/docker.sock"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.018Z testcontainers [DEBUG] Checking if image exists "testcontainers/ryuk:0.14.0"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.020Z testcontainers [DEBUG] Checked if image exists "testcontainers/ryuk:0.14.0"

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.020Z testcontainers [DEBUG] Image "testcontainers/ryuk:0.14.0" already exists

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.020Z testcontainers [DEBUG] Creating container for image "testcontainers/ryuk:0.14.0"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.048Z testcontainers [DEBUG] [f62b5fec3085] Created container for image "testcontainers/ryuk:0.14.0"

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.048Z testcontainers [INFO] [f62b5fec3085] Starting container for image "testcontainers/ryuk:0.14.0"...
2025-11-09T08:41:14.048Z testcontainers [DEBUG] [f62b5fec3085] Starting container...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.236Z testcontainers [DEBUG] [f62b5fec3085] Started container

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.236Z testcontainers [INFO] [f62b5fec3085] Started container for image "testcontainers/ryuk:0.14.0"

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.239Z testcontainers [DEBUG] [f62b5fec3085] Waiting for container to be ready...
2025-11-09T08:41:14.239Z testcontainers [DEBUG] [f62b5fec3085] Waiting for log message "/.*Started.*/"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.239Z testcontainers [DEBUG] [f62b5fec3085] Fetching container logs...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.241Z testcontainers [DEBUG] [f62b5fec3085] Demuxing stream...
2025-11-09T08:41:14.242Z testcontainers [DEBUG] [f62b5fec3085] Demuxed stream

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.388Z testcontainers [DEBUG] [f62b5fec3085] Log wait strategy complete

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.389Z testcontainers [INFO] [f62b5fec3085] Container is ready

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.389Z testcontainers [DEBUG] [f62b5fec3085] Connecting to Reaper (attempt 1) on "172.17.0.1:32769"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.390Z testcontainers [DEBUG] [f62b5fec3085] Connected to Reaper

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.390Z testcontainers [DEBUG] Releasing lock file "/tmp/testcontainers-node.lock"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.391Z testcontainers [DEBUG] Released lock file "/tmp/testcontainers-node.lock"

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:14.391Z testcontainers [INFO] Upping Compose environment...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.739Z testcontainers [INFO] Upped Compose environment

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.739Z testcontainers [DEBUG] Listing containers...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.745Z testcontainers [DEBUG] Listed containers

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.745Z testcontainers [INFO] Started containers "/counter-indexer", "/counter-node", "/counter-proof-server"
2025-11-09T08:41:15.746Z testcontainers [DEBUG] [d8412a4a6e8a] Getting container by ID...
2025-11-09T08:41:15.746Z testcontainers [DEBUG] [d8412a4a6e8a] Got container by ID
2025-11-09T08:41:15.746Z testcontainers [DEBUG] [c6306f44b499] Getting container by ID...
2025-11-09T08:41:15.746Z testcontainers [DEBUG] [c6306f44b499] Got container by ID
2025-11-09T08:41:15.746Z testcontainers [DEBUG] [0c58f8a7c9f0] Getting container by ID...
2025-11-09T08:41:15.746Z testcontainers [DEBUG] [0c58f8a7c9f0] Got container by ID

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.751Z testcontainers [DEBUG] [d8412a4a6e8a] Waiting for container to be ready...
2025-11-09T08:41:15.751Z testcontainers [DEBUG] [d8412a4a6e8a] Waiting for log message "/starting indexing/"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.751Z testcontainers [DEBUG] [d8412a4a6e8a] Fetching container logs...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.753Z testcontainers [DEBUG] [d8412a4a6e8a] Demuxing stream...
2025-11-09T08:41:15.753Z testcontainers [DEBUG] [d8412a4a6e8a] Demuxed stream

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.754Z testcontainers [DEBUG] [0c58f8a7c9f0] Waiting for container to be ready...
2025-11-09T08:41:15.754Z testcontainers [DEBUG] [0c58f8a7c9f0] Waiting for log message "Actix runtime found; starting in Actix runtime"...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.754Z testcontainers [DEBUG] [0c58f8a7c9f0] Fetching container logs...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.757Z testcontainers [DEBUG] [0c58f8a7c9f0] Demuxing stream...
2025-11-09T08:41:15.757Z testcontainers [DEBUG] [0c58f8a7c9f0] Demuxed stream

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.758Z testcontainers [DEBUG] [c6306f44b499] Waiting for container to be ready...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:15.759Z testcontainers [DEBUG] [c6306f44b499] Waiting for host port 32770...
2025-11-09T08:41:15.759Z testcontainers [DEBUG] [c6306f44b499] Waiting for internal port 9944/tcp...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:16.016Z testcontainers [TRACE] [c6306f44b499] Port check result exit code 127: /bin/sh: 1: nc: not found
2025-11-09T08:41:16.016Z testcontainers [TRACE] [c6306f44b499] Port check result exit code 1: /bin/bash: connect: Connection refused
/bin/bash: line 1: /dev/tcp/localhost/9944: Connection refused

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:20.386Z testcontainers [DEBUG] [c6306f44b499] Host port 32770 ready
2025-11-09T08:41:20.387Z testcontainers [DEBUG] [c6306f44b499] Host port wait strategy complete

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:20.552Z testcontainers [DEBUG] [c6306f44b499] Internal port 9944/tcp ready
2025-11-09T08:41:20.552Z testcontainers [DEBUG] [c6306f44b499] Internal port wait strategy complete

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:20.552Z testcontainers [INFO] [c6306f44b499] Container is ready

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:26.563Z testcontainers [DEBUG] [d8412a4a6e8a] Log wait strategy complete

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:41:26.563Z testcontainers [INFO] [d8412a4a6e8a] Container is ready

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:42:13.737Z testcontainers [DEBUG] [0c58f8a7c9f0] Log wait strategy complete

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:42:13.737Z testcontainers [INFO] [0c58f8a7c9f0] Container is ready

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:42:13.737Z testcontainers [INFO] DockerCompose environment started

[08:42:13.739] INFO (44719): Configuration:{"seed":"0000000000000000000000000000000000000000000000000000000000000001","entrypoint":"dist/standalone.js","psMode":"undeployed","cacheFileName":"","dappConfig":{"logDir":"/workspaces/midnight-sample/my-mn-app/pkgs/cli/logs/standalone/2025-11-09T08:41:13.980Z.log","indexer":"http://127.0.0.1:32772/api/v1/graphql","indexerWS":"ws://127.0.0.1:32772/api/v1/graphql/ws","node":"http://127.0.0.1:32770","proofServer":"http://127.0.0.1:32771"}}
[08:42:13.740] INFO (44719): Test containers started
[08:42:13.741] INFO (44719): Setting up wallet
[08:42:13.742] INFO (44719): File path for save file not found, building wallet from scratch
[08:42:13.856] INFO (44719): Your wallet seed is: 0000000000000000000000000000000000000000000000000000000000000001
[08:42:13.857] INFO (44719): Your wallet address is: mn_shield-addr_undeployed1mjngjmnlutcq50trhcsk3hugvt9wyjnhq3c7prryd5nqmvtzva0sxqpvzkdy4k9u7eyffff53cge62tqylevq3wqps86tdjuahsquwvucsy9kffv
[08:42:13.858] INFO (44719): Your wallet balance is: 0
[08:42:13.859] INFO (44719): Waiting to receive tokens...
[08:42:13.868] INFO (44719): Waiting for funds. Backend lag: 0, wallet lag: 0, transactions=0
stderr | src/test/counter.api.test.ts > API
[] | Timed out trying to connect

[08:42:24.969] INFO (44719): Waiting for funds. Backend lag: 0, wallet lag: 0, transactions=1
[08:42:24.970] INFO (44719): Your wallet balance is: 25000000000000000
[08:42:25.032] INFO (44719): Deploying counter contract...
[08:43:31.446] INFO (44719): Deployed contract at address: 020058f1921fb8973bee055663f51d7e746f7f46f2c1ce4ac86ef0b3f3c21b8583dc
[08:43:31.447] INFO (44719): Checking contract ledger state...
[08:43:31.456] INFO (44719): Ledger state: 0
[08:43:31.457] INFO (44719): Current counter value: 0
[08:43:33.462] INFO (44719): Incrementing...
[08:44:32.309] INFO (44719): Transaction 0000000053af9c57562a9a5fbd2b5e3e7034f52080fb8bde41dffa505c866278a1851bb0 added in block 30
[08:44:32.310] INFO (44719): Checking contract ledger state...
[08:44:32.312] INFO (44719): Ledger state: 1
[08:44:32.312] INFO (44719): Current counter value: 1
[08:44:32.314] INFO (44719): Not saving cache as sync cache was not defined
[08:44:32.321] INFO (44719): Test containers closing
stdout | src/test/counter.api.test.ts > API
2025-11-09T08:44:32.321Z testcontainers [INFO] Downing Compose environment...

stdout | src/test/counter.api.test.ts > API
2025-11-09T08:44:33.594Z testcontainers [INFO] Downed Compose environment

 ✓ src/test/counter.api.test.ts (1 test) 199617ms
   ✓ API (1)
     ✓ should deploy the contract and increment the counter [@slow]  127282ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  08:41:12
   Duration  200.97s (transform 180ms, setup 72ms, collect 1.11s, tests 199.62s, environment 0ms, prepare 10ms)

```

# CLI のテストネット向けのユニットテストログ

```bash
 RUN  v4.0.8 /workspaces/midnight-sample/my-mn-app/pkgs/cli

[08:47:56.324] INFO (52069): Test wallet seed: 1dec0dd58fbe4d3206ef960aebff95a77e09dffbd19f3e9439d23fe6de4fcdd1
[08:47:56.327] INFO (52069): Proof server starting...
[08:48:00.641] INFO (52069): Configuration:{"seed":"1dec0dd58fbe4d3206ef960aebff95a77e09dffbd19f3e9439d23fe6de4fcdd1","entrypoint":"","dappConfig":{"logDir":"/workspaces/midnight-sample/my-mn-app/pkgs/cli/logs/testnet-remote/2025-11-09T08:47:56.324Z.log","indexer":"https://indexer.testnet-02.midnight.network/api/v1/graphql","indexerWS":"wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws","node":"https://rpc.testnet-02.midnight.network","proofServer":"http://172.17.0.1:32774"},"psMode":"testnet","cacheFileName":"1dec0dd-testnet.state"}
[08:48:00.642] INFO (52069): Test containers started
[08:48:00.642] INFO (52069): Setting up wallet
[08:48:00.643] INFO (52069): File path for save file not found, building wallet from scratch
[08:48:00.785] INFO (52069): Your wallet seed is: 1dec0dd58fbe4d3206ef960aebff95a77e09dffbd19f3e9439d23fe6de4fcdd1
[08:48:00.786] INFO (52069): Your wallet address is: mn_shield-addr_test1mksxede6e6g85mp68levnatv3eeva0nczhmrgn9n7hgagsd8cvhsxqq78lg9phh6tzvl5efmvzqzxzlc8f4fkpncu3p7gsw7jyl22dryggu2djq9
[08:48:00.789] INFO (52069): Your wallet balance is: 0
[08:48:00.790] INFO (52069): Waiting to receive tokens...
[08:48:00.808] INFO (52069): Waiting for funds. Backend lag: 0, wallet lag: 0, transactions=0
[08:48:11.071] INFO (52069): Waiting for funds. Backend lag: 0, wallet lag: 24104, transactions=119
[08:48:22.837] INFO (52069): Waiting for funds. Backend lag: 0, wallet lag: 0, transactions=149
[08:48:22.838] INFO (52069): Your wallet balance is: 1047353290
[08:48:22.893] INFO (52069): Deploying counter contract...
[08:49:27.377] INFO (52069): Deployed contract at address: 0200a83c22cc05775912c52dfa3d4c4504c22225cd3231d1a3634ca8b87409875916
[08:49:27.378] INFO (52069): Checking contract ledger state...
[08:49:27.573] INFO (52069): Ledger state: 0
[08:49:27.573] INFO (52069): Current counter value: 0
[08:49:29.575] INFO (52069): Incrementing...
[08:50:27.760] INFO (52069): Transaction 00000000ba8eee2293bc795e5b60d874071e75e486cb4494d75609f9a0e71b5f16c25dd3 added in block 2482886
[08:50:27.760] INFO (52069): Checking contract ledger state...
[08:50:27.950] INFO (52069): Ledger state: 1
[08:50:27.951] INFO (52069): Current counter value: 1
[08:50:27.952] INFO (52069): Not saving cache as sync cache was not defined
[08:50:27.960] INFO (52069): Test container closing
 ✓ src/test/counter.api.test.ts (1 test) 151857ms
   ✓ API (1)
     ✓ should deploy the contract and increment the counter [@slow]  125059ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  08:47:54
   Duration  153.65s (transform 205ms, setup 93ms, collect 1.56s, tests 151.86s, environment 0ms, prepare 8ms)
```