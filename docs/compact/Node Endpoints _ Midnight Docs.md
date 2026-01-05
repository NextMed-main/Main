9/26/25, 8:37 AM

Node Endpoints | Midnight Docs

How to

Query the blockchain

Node Endpoints

Node Endpoints

You have the option to run your own node for interacting with the Midnight network via various user interfaces (UIs) and

programmatically. Alternatively, you can connect to public endpoints provided by infrastructure and API service providers. For

development convenience, you may use the following public endpoints. These endpoints can be utilized with APIs to interact with the

Midnight network and its test environments.

Network endpoints #

Testnet network

Network

URL

Testnet-02

https://rpc.testnet-02.midnight.network/

Explorer (temporary)

https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.testnet-02.midnight.network#/explorer

Example query of a Midnight node:

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
        "jsonrpc": "2.0",

https://docs.midnight.network/develop/nodes-and-dapps/nodes-endpoints

Ask AI
Ask AI

Feedback

1/4

9/26/25, 8:37 AM

Node Endpoints | Midnight Docs

        "method": "system_chain",
        "params": [],
        "id": 1
      }' \
  https://rpc.testnet-02.midnight.network/

Query available RPC methods into a readable ﬁle  rpc_methods.json :

curl \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"rpc_methods","params":[],"id":1}' \
  https://rpc.testnet-02.midnight.network/ \
  > rpc_methods.json

Insomnia API Collection

https://docs.midnight.network/develop/nodes-and-dapps/nodes-endpoints

Feedback

2/4

9/26/25, 8:37 AM

Node Endpoints | Midnight Docs

To facilitate interaction with the Midnight Node, we have prepared an Insomnia API collection. This collection contains pre-conﬁgured

requests that you can use to test and interact with the node's various endpoints.

1. Download the collection

Click on the following link to download the Insomnia API collection ﬁle: 📦 ⬇ Midnight Node Insomnia Collection .

2. Open Insomnia

If you haven't already installed Insomnia, download and install it from Insomnia's official website.

Feedback

https://docs.midnight.network/develop/nodes-and-dapps/nodes-endpoints

3/4

9/26/25, 8:37 AM

3. Import the collection

Open Insomnia.

Node Endpoints | Midnight Docs

Go to the main menu and select  Import/Export .
Choose  Import Data  >  From File .
Locate and select the downloaded  Insomnia.json  ﬁle.

4. Use the collection

Once imported, you will see the Midnight Node collection in your Insomnia workspace.

Expand the collection to view and utilize the available requests.

Conﬁgure any necessary environment variables if prompted, such as API keys or server URLs.

https://docs.midnight.network/develop/nodes-and-dapps/nodes-endpoints

Feedback

4/4

