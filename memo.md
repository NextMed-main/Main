# CLI と コントラクトの動かし方

## 環境

- nodejs
- yarn
- docker
- compact CLI

## compact CLIのインストール

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
```

その後、以下でバージョン指定

```bash
compact update 0.25.0
```

インストールされているかの確認

```bash
compact --version
compact compile --version
```

それぞれ以下のようになればOK!

```bash
compact 0.2.0
0.25.0
```

## Testnet用のZKProof serverの起動

```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

```bash
docker ps
```

localhost:6300でサーバーが起動していればOK

```bash
CONTAINER ID   IMAGE                          COMMAND                  CREATED          STATUS          PORTS                                         NAMES
a62d9787f7a1   midnightnetwork/proof-server   "/nix/store/qa9fb15p…"   25 seconds ago   Up 24 seconds   0.0.0.0:6300->6300/tcp, [::]:6300->6300/tcp   flamboyant_roentgen
```

念の為以下のコマンドでも稼働確認

```bash
curl -X GET "http://localhost:6300"
```

```bash
We're alive 🎉!
```

## サンプルプログラムのコンパイル＆デプロイ手順

まず、依存関係をインストールする

```bash
yarn
```

以下のコマンドでコントラクトをビルドする

```bash
yarn contract compact
```

以下のようになればOK!

```bash
Fetching public parameters for k=10 [====================] 192.38 KiB / 192.38 KiB
  circuit "increment" (k=10, rows=29)  
Overall progress [====================] 1/1   
```

コントラクトのユニットテストコードを実行する

```bash
yarn contract test
```

以下のようになればOK!

```bash
 RUN  v4.0.8 /workspaces/midnight-sample/my-mn-app/pkgs/contract

 ✓ test/counter.test.ts (3 tests) 44ms
   ✓ Counter smart contract (3)
     ✓ generates initial ledger state deterministically 36ms
     ✓ properly initializes ledger state and private state 3ms
     ✓ increments the counter correctly 4ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  08:27:47
   Duration  421ms (transform 95ms, setup 0ms, collect 233ms, tests 44ms, environment 0ms, prepare 13ms)

JUNIT report written to /workspaces/midnight-sample/my-mn-app/pkgs/contract/reports/report.xml
Done in 1.34s.
```

次にCLI用のTypeScriptファイルを以下のコマンドで生成する

```bash
yarn contract build
```

そしてCLI用のユニットテストコードを実行する

```bash
yarn cli test-api
```

以下のようになればOK!

```bash
Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  08:41:12
   Duration  200.97s (transform 180ms, setup 72ms, collect 1.11s, tests 199.62s, environment 0ms, prepare 10ms)
```

さらにテストネット上でもユニットテストコードを実行するコマンド

```bash
yarn cli test-against-testnet
```

以下のようになればOK!

```bash
 ✓ src/test/counter.api.test.ts (1 test) 151857ms
   ✓ API (1)
     ✓ should deploy the contract and increment the counter [@slow]  125059ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  08:47:54
   Duration  153.65s (transform 205ms, setup 93ms, collect 1.56s, tests 151.86s, environment 0ms, prepare 8ms)
```

以下のコマンドでコントラクトを対話式でテストネットにデプロイする

```bash
yarn cli testnet-remote
```

単にデプロイだけ行いたい場合は以下を実行する

事前に環境変数を設定する

```bash
cp .env.example .env
```

```bash
yarn cli deploy
```

以下のようになればOK!

```bash
[12:16:24.603] INFO (39506): Deploying counter contract...
[12:17:27.488] INFO (39506): Deployed contract at address: 020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3
[12:17:27.488] INFO (39506): Deployment transaction: 00000000c408a293e4e287285649623774b2be950bf0d385a20117ce79a99eb7315aa547
[12:17:27.489] INFO (39506): Contract address: 020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3
Counter contract deployed at: 020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3
[12:17:27.489] INFO (39506): Not saving cache as sync cache was not defined
Done in 90.16s.
```

デプロイされたコントラクトアドレスを環境変数に追加する

incrementメソッドだけを呼び出すコマンドを実行する

```bash
yarn cli increment
```

以下のようになればOK!

```bash
[12:33:37.176] INFO (47085): Incrementing...
[12:34:34.270] INFO (47085): Transaction 000000000202acbcd05e9f19e5144acc5f97953255840b8b932fc71b84520e715b7ca900 added in block 2485067
[12:34:34.271] INFO (47085): Increment transaction: 000000000202acbcd05e9f19e5144acc5f97953255840b8b932fc71b84520e715b7ca900 (block 2485067)
Counter incremented. txId=000000000202acbcd05e9f19e5144acc5f97953255840b8b932fc71b84520e715b7ca900 block=2485067
[12:34:34.271] INFO (47085): Checking contract ledger state...
[12:34:34.462] INFO (47085): Ledger state: 1
[12:34:34.463] INFO (47085): Current counter value: 1
[12:34:34.463] INFO (47085): Current counter value: 1
Current counter value: 1
[12:34:34.463] INFO (47085): Not saving cache as sync cache was not defined
Done in 128.20s.
```

## 参考文献
- [ブロックエクスプローラー](https://www.midnightexplorer.com/)