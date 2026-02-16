import DApp from './dapp.js';

const App = {
    init: async function () {
        await DApp.init();
        this.bindEvents();
    },

    bindEvents: function () {
        const checkBtn = document.querySelector('.btn-register');
        if (checkBtn) {
            checkBtn.addEventListener('click', (e) => this.getData(e));
        }
    },

    getData: async function (event) {
        event.preventDefault();
        const productSN = document.getElementById('productSN').value;
        const consumerCode = document.getElementById('consumerCode').value;

        if (!DApp.contract) {
            alert("Contract not loaded");
            return;
        }

        try {
            const result = await DApp.contract.methods.verifyProduct(
                DApp.toHex(productSN),
                DApp.toHex(consumerCode)
            ).call({ from: DApp.account });

            let logHtml = "";
            if (result) {
                // Fetch product details for metadata
                const productIdx = await DApp.contract.methods.productMap(DApp.toHex(productSN)).call();
                const product = await DApp.contract.methods.productItems(productIdx).call();

                let metadataHtml = "";
                let integrityFlag = true;

                if (product.productMetadata && product.metadataHash !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                    try {
                        const metaUrl = `https://gateway.pinata.cloud/ipfs/${product.productMetadata}`;
                        const metaResponse = await fetch(metaUrl);
                        const metaData = await metaResponse.json();

                        // Cryptographic Integrity Check
                        const calculatedHash = DApp.calculateHash(metaData);
                        if (calculatedHash !== product.metadataHash) {
                            console.error("METADATA TAMPERING DETECTED!", { recorded: product.metadataHash, calculated: calculatedHash });
                            integrityFlag = false;
                        }

                        if (metaData.image) {
                            metadataHtml += `<div class="mb-3 text-center"><img src="${metaData.image}" style="max-height:200px; width:auto;" class="img-fluid rounded shadow-sm border"></div>`;
                        }
                        if (metaData.description) {
                            metadataHtml += `<div class="bg-light p-2 rounded mb-2"><small class="text-dark">${metaData.description}</small></div>`;
                        }
                    } catch (e) {
                        console.error("Failed to fetch/verify IPFS metadata:", e);
                    }
                }

                if (!integrityFlag) {
                    logHtml = `<tr><td><div class="alert alert-warning mt-2 text-center"><h5 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i>Integrity Mismatch</h5>Data for this product may have been tampered with. Verifying on-chain keys only.</div></td></tr>`;
                } else {
                    logHtml = `<tr><td><div class="alert alert-success mt-2 text-center"><h5 class="alert-heading">Genuine Product Confirmed</h5>${metadataHtml}</div></td></tr>`;
                }
            } else {
                logHtml = `<tr><td><div class="alert alert-danger mt-2 text-center"><h5 class="alert-heading">Verification Failed</h5>Fake Product or Incorrect Codes.</div></td></tr>`;
            }

            document.getElementById('logdata').innerHTML = logHtml;
            document.getElementById('add').innerHTML = DApp.account;

        } catch (error) {
            console.error("Verification error:", error);
            alert("Verification failed. Check console for details.");
        }
    }
};

window.addEventListener('load', () => {
    App.init();
});

export default App;