import DApp from './dapp.js';
import IPFS from './ipfs.js';

const App = {
    init: async function () {
        await DApp.init();
        this.bindEvents();
    },

    bindEvents: function () {
        const registerBtn = document.querySelector('.btn-register');
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => this.registerProduct(e));
        }
        const bulkBtn = document.getElementById('bulkRegister');
        if (bulkBtn) {
            bulkBtn.addEventListener('click', (e) => this.batchRegisterProduct(e));
        }
    },

    registerProduct: async function (event) {
        event.preventDefault();

        const manufacturerID = document.getElementById('manufacturerID').value;
        const productName = document.getElementById('productName').value;
        const productSN = document.getElementById('productSN').value;
        const productBrand = document.getElementById('productBrand').value;
        const productPrice = document.getElementById('productPrice').value;
        const productImage = document.getElementById('productImage').files[0];
        const productDescription = document.getElementById('productDescription').value;

        if (!DApp.contract) {
            alert("Contract not loaded");
            return;
        }

        let metadataCID = "";

        try {
            if (productImage || productDescription) {
                console.log("Uploading metadata to IPFS...");
                let imageCID = "";
                if (productImage) {
                    imageCID = await IPFS.uploadFile(productImage);
                }

                const metadata = {
                    name: productName,
                    description: productDescription,
                    image: imageCID ? `https://gateway.pinata.cloud/ipfs/${imageCID}` : "",
                    sn: productSN,
                    brand: productBrand,
                    timestamp: Date.now()
                };

                const metadataHash = DApp.calculateHash(metadata);
                metadataCID = await IPFS.uploadJSON(metadata);
                console.log("IPFS Metadata CID:", metadataCID);
                console.log("Metadata Hash:", metadataHash);

                await DApp.contract.methods.addProduct(
                    DApp.toHex(manufacturerID),
                    DApp.toHex(productName),
                    DApp.toHex(productSN),
                    DApp.toHex(productBrand),
                    productPrice,
                    metadataCID,
                    metadataHash
                ).send({ from: DApp.account });
            } else {
                // No IPFS metadata, but still need a null hash
                const nullHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
                await DApp.contract.methods.addProduct(
                    DApp.toHex(manufacturerID),
                    DApp.toHex(productName),
                    DApp.toHex(productSN),
                    DApp.toHex(productBrand),
                    productPrice,
                    "",
                    nullHash
                ).send({ from: DApp.account });
            }

            // Clear form
            document.getElementById('manufacturerID').value = '';
            document.getElementById('productName').value = '';
            document.getElementById('productSN').value = '';
            document.getElementById('productBrand').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productImage').value = '';
            document.getElementById('productDescription').value = '';

            alert("Product registered successfully!");

        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        }
    },

    batchRegisterProduct: async function (event) {
        event.preventDefault();
        const bulkData = document.getElementById('bulkData').value;
        const manufacturerID = document.getElementById('manufacturerID').value;

        if (!bulkData || !manufacturerID) {
            alert("Please provide manufacturer ID and bulk data.");
            return;
        }

        try {
            const lines = bulkData.trim().split('\n');
            const names = [], sns = [], brands = [], prices = [], metadatas = [], hashes = [];

            for (let line of lines) {
                const [name, sn, brand, price] = line.split(',').map(s => s.trim());
                if (name && sn && brand && price) {
                    names.push(DApp.toHex(name));
                    sns.push(DApp.toHex(sn));
                    brands.push(DApp.toHex(brand));
                    prices.push(price);
                    metadatas.push("");
                    hashes.push("0x0000000000000000000000000000000000000000000000000000000000000000"); // Batch defaults to null hash for gas
                }
            }

            if (sns.length === 0) {
                alert("No valid data found in bulk entry.");
                return;
            }

            console.log(`Batch registering ${sns.length} products...`);
            await DApp.contract.methods.batchAddProduct(
                DApp.toHex(manufacturerID),
                names,
                sns,
                brands,
                prices,
                metadatas,
                hashes
            ).send({ from: DApp.account });

            document.getElementById('bulkData').value = '';
            alert(`Successfully registered ${sns.length} products in a single batch!`);

        } catch (error) {
            console.error("Batch error:", error);
            alert("Batch registration failed. Check format: Name, SN, Brand, Price");
        }
    }
};

window.addEventListener('load', () => {
    App.init();
});

export default App;
