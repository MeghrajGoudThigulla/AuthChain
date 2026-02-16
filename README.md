# AuthChain: Blockchain Based Fake Product Identification System 🛡️⛓️

AuthChain is a premium, blockchain-powered supply chain ecosystem designed to eliminate counterfeit products thru cryptographic verification and IPFS-backed metadata integrity.

## 🚀 Vision
To provide a defensible, transparent, and user-friendly platform for manufacturers, sellers, and consumers to verify the authenticity of high-value goods in real-time.

## 🛠️ Technical Stack
- **Blockchain**: Solidity (EVM)
- **Network**: Polygon POS (Amoy Testnet/Mainnet)
- **Metadata**: IPFS (via Pinata)
- **Frontend**: Vite + ESM + Vanilla JS + Bootstrap 5
- **Tooling**: Web3.js v4, Truffle

## 📋 Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MetaMask](https://metamask.io/) browser extension
- [Truffle](https://trufflesuite.com/docs/truffle/getting-started/installation/) installed globally
- [Polygon MATIC](https://faucet.polygon.technology/) tokens (for gas)

## 🏗️ Installation & Setup

1. **Clone & Install**:
   ```bash
   git clone <your-new-github-url>
   cd AuthChain
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file based on the provided guide in `DEPLOYMENT.md`.

3. **Smart Contract Deployment**:
   ```bash
   truffle compile
   truffle migrate --network amoy
   ```

4. **Run Locally**:
   ```bash
   npm run dev
   ```

## 📖 Detailed Guides
For full deployment instructions, security protocols, and architectural overviews, refer to:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production launch steps.
- [Walkthrough](./walkthrough.md) - Master feature breakdown.

---
Authored with excellence for the Threshing Floor Group.
规
