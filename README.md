# AuthChain: Blockchain Based Fake Product Identification System 🛡️⛓️

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://authchain-g087.onrender.com)
[![Polygon Amoy](https://img.shields.io/badge/Polygon-Amoy_Testnet-8247E5?style=for-the-badge&logo=polygon&logoColor=white)](https://amoy.polygonscan.com/address/0x558683Ad4f250a22f5BcB0bfcf4C269dFAA1b853)

AuthChain is a premium, blockchain-powered supply chain ecosystem designed to eliminate counterfeit products thru cryptographic verification and IPFS-backed metadata integrity.

> **🚀 Institutional-Grade Supply Chain Integrity Platform**
> live on **Polygon Amoy Testnet**: [https://authchain-g087.onrender.com](https://authchain-g087.onrender.com)

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

## 🎮 Live Demo & Test Credentials

To test the full supply chain flow on the live demo, you can use the following **Testnet-Only** credentials.

> **⚠️ SECURITY WARNING:** These private keys are public for **DEMO PURPOSES ONLY**. Do not use them on mainnet. Do not send real funds to them.

### 🔐 1. Admin (Governance)
*   **Role**: Contract Owner & Deployer
*   **Action**: Authorize Manufacturers
*   **Wallet**: *Connect the account you used to deploy the contract.*
    *   *If testing as a guest, you cannot perform Admin actions unless you deploy your own instance.*

### 🏭 2. Manufacturer (Test Account)
*   **Role**: Create Products & Authorize Sellers
*   **Address**: `0xC09183FceCCeB26d09Aa6c929B89fA79C9D34F9b`
*   **Private Key**: `0x45417673eb6bc8fcb693b06c88c27472d8bf73c54222f85689381092c862cdea`

### 🏪 3. Seller (Test Account)
*   **Role**: Receive Products & Sell to Consumers
*   **Address**: `0x731C25039E4cE81E2C58D088290842FBFcAefb6f`
*   **Private Key**: `0x9412152af0b974b03ad617fa3e38e87508dae0bd0c4d8473e6f1523833d54270`

### 👤 4. Consumer (Test Account)
*   **Role**: Verify Authenticity & View History
*   **Address**: `0xDFA3cbFAF35093b1F8c1f8b57e3345a17284c576`
*   **Private Key**: `0xb8f8aa33cf53034d950463341877a56a41f0a5a87a26ffd0f8d6cd734efcda46`

---

### 🧪 Demo Flow Walkthrough
1.  **Login as Admin**: Connect your deployer wallet. Go to **Admin Panel** -> Add `0xC091...` (Manufacturer Address).
2.  **Switch to Manufacturer**: Import the Manufacturer Private Key into MetaMask. Connect.
3.  **Register Seller**: Go to **Manufacturer Portal** -> Add `0x731C...` (Seller Address).
4.  **Create Product**: In Manufacturer Portal -> Register Product (e.g., "Rolex Submariner", SN: 998877).
5.  **Switch to Seller**: Import Seller Key. Connect.
6.  **Receive & Sell**: Go to **Seller Portal** -> Order product 998877 -> Sell to Consumer `0xDFA3...`.
7.  **Switch to Consumer**: Import Consumer Key. Connect.
8.  **Verify**: Go to **Consumer Portal** -> Scan/Enter 998877 -> View full provenance!

---

## 📖 Detailed Guides
For full deployment instructions, security protocols, and architectural overviews, refer to:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production launch steps.
- [Walkthrough](./walkthrough.md) - Master feature breakdown.