# AuthChain Deployment Guide 🚀

This guide provides step-by-step instructions for deploying the modernized, hardened AuthChain ecosystem to a production-grade network (Polygon).

## 📋 Prerequisites

1.  **Node.js & npm**: [Download here](https://nodejs.org/).
2.  **MetaMask**: Installed in your browser.
3.  **MATIC Tokens**: Get test tokens from the [Polygon Faucet](https://faucet.polygon.technology/) for the Amoy Testnet.
4.  **Pinata Account**: Required for IPFS storage. [Sign up here](https://www.pinata.cloud/).

---

## 🏗️ Step 1: Smart Contract Deployment

AuthChain uses Truffle for contract management.

1.  **Configure `.env`**:
    Open the `.env` file in the root directory and ensure the following are set:
    ```env
    MNEMONIC="your twelve word secret recovery phrase from metamask"
    INFURA_API_KEY="your_infura_or_alchemy_project_id"
    ```
2.  **Install Global Dependencies**:
    ```bash
    npm install -g truffle
    ```
3.  **Compile & Migrate**:
    ```bash
    truffle compile
    truffle migrate --network amoy
    ```
    *Note the **Contract Address** output at the end of the migration.*

---

## ⚙️ Step 2: Frontend Configuration

1.  **Update Environment Variables**:
    Update your `.env` file with the newly deployed contract address and your Pinata credentials:
    ```env
    VITE_CONTRACT_ADDRESS="0xYourDeployedContractAddress"
    VITE_CHAIN_ID="0x13882" # 80002 in hex for Polygon Amoy
    VITE_PINATA_API_KEY="your_pinata_key"
    VITE_PINATA_SECRET_KEY="your_pinata_secret"
    ```

---

## 💻 Step 3: Local Execution & Testing

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
3.  **Verify**:
    - Open the browser at `http://localhost:5173`.
    - Connect MetaMask and ensure you are on the **Polygon Amoy** network.

---

## 🌐 Step 4: Production Hosting (Vercel/Netlify)

1.  **Build the Project**:
    ```bash
    npm run build
    ```
2.  **Deploy**:
    - Push your code to GitHub.
    - Connect your repository to **Vercel** or **Netlify**.
    - **Crucial**: Add all environment variables from `.env` to the hosting provider's "Environment Variables" settings.
    - Set the build command to `npm run build` and the output directory to `dist`.

---

## 🛡️ Security Post-Deployment Checks

- [ ] **RBAC Verification**: Ensure only the account that deployed the contract (Admin) can add manufacturers.
- [ ] **Metadata Integrity**: Verify that tampering with an IPFS JSON manually triggers the "Tampered" warning in the portal.
- [ ] **Chain Guard**: Attempt to connect with Ethereum Mainnet; the app should prompt you to switch back to Polygon.

**AuthChain is now ready to secure your supply chain.**
规
