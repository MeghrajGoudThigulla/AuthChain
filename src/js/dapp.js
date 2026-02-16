import Web3 from 'web3';

const DApp = {
    web3: null,
    account: null,
    contract: null,

    init: async function () {
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            try {
                // Check network first
                await this.checkNetwork();

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.account = accounts[0];

                // Handle account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    this.account = accounts[0];
                    window.location.reload();
                });

                // Handle chain changes
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                });

            } catch (error) {
                console.error("Initialization error:", error);
                alert(error.message || "Failed to connect wallet.");
            }
        } else if (window.web3) {
            this.web3 = new Web3(window.web3.currentProvider);
        } else {
            const fallbackRpc = import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:7545';
            console.warn(`No web3 detected. Falling back to ${fallbackRpc}.`);
            this.web3 = new Web3(new Web3.providers.HttpProvider(fallbackRpc));
        }

        await this.loadContract();
        return this;
    },

    checkNetwork: async function () {
        const targetChainId = import.meta.env.VITE_CHAIN_ID || '0x13882'; // Default Amoy: 80002
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (currentChainId !== targetChainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: targetChainId }],
                });
            } catch (switchError) {
                // Handle missing network
                if (switchError.code === 4902) {
                    throw new Error("Target network not found in wallet. Please add Polygon Amoy.");
                }
                throw switchError;
            }
        }
    },

    loadContract: async function () {
        try {
            const response = await fetch('/product.json');
            const data = await response.json();

            // Priority 1: Environment Variable Override
            const envAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

            if (envAddress) {
                console.log(`Using contract address from environment: ${envAddress}`);
                this.contract = new this.web3.eth.Contract(data.abi, envAddress);
                return;
            }

            // Priority 2: Truffle Artifact Network ID
            const networkId = await this.web3.eth.net.getId();
            const deployedNetwork = data.networks[networkId.toString()];

            if (deployedNetwork) {
                this.contract = new this.web3.eth.Contract(data.abi, deployedNetwork.address);
            } else {
                console.error("Contract not deployed to the current network.");
            }
        } catch (error) {
            console.error("Error loading contract artifact:", error);
        }
    },

    toHex: function (str) {
        return this.web3.utils.padRight(this.web3.utils.asciiToHex(str), 64);
    },

    getStatusString: function (statusInt) {
        const statuses = ["Manufactured", "At Seller", "Sold", "Recalled"];
        return statuses[statusInt] || "Unknown";
    },

    /**
     * @dev Cryptographic hash of metadata for on-chain tamper detection.
     */
    calculateHash: function (obj) {
        const str = JSON.stringify(obj);
        return this.web3.utils.keccak256(str);
    }
};

export default DApp;
