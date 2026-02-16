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
        const sellerCode = document.getElementById('sellerCode').value;

        if (!DApp.contract) {
            alert("Contract not loaded");
            return;
        }

        try {
            const sCodeHex = DApp.toHex(sellerCode);

            // Query ProductSoldToSeller events filtered by sellerCode
            const events = await DApp.contract.getPastEvents('ProductSoldToSeller', {
                filter: { sellerCode: sCodeHex },
                fromBlock: 0,
                toBlock: 'latest'
            });

            if (events.length === 0) {
                document.getElementById('logdata').innerHTML = '<tr><td colspan="6" class="text-center text-muted">No products found for this seller.</td></tr>';
                return;
            }

            let t = "";
            for (const event of events) {
                const productSN = event.returnValues.productSN;

                // Fetch full details from contract using productMap
                const productIdx = await DApp.contract.methods.productMap(productSN).call();
                const product = await DApp.contract.methods.productItems(productIdx).call();

                // Double check if SN matches
                if (product.productSN === productSN) {
                    const sn = DApp.web3.utils.hexToAscii(product.productSN).replace(/\0/g, '');
                    const name = DApp.web3.utils.hexToAscii(product.productName).replace(/\0/g, '');
                    const brand = DApp.web3.utils.hexToAscii(product.productBrand).replace(/\0/g, '');
                    const status = DApp.getStatusString(product.productStatus);

                    let metadataHtml = "";
                    let tamperWarning = "";

                    if (product.productMetadata && product.metadataHash !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                        try {
                            const metaUrl = `https://gateway.pinata.cloud/ipfs/${product.productMetadata}`;
                            const metaResponse = await fetch(metaUrl);
                            const metaData = await metaResponse.json();

                            // Integrity check
                            const calculatedHash = DApp.calculateHash(metaData);
                            if (calculatedHash !== product.metadataHash) {
                                tamperWarning = `<span class="badge bg-danger ms-2" title="On-chain hash mismatch!">Tampered</span>`;
                            }

                            if (metaData.image) {
                                metadataHtml += `<img src="${metaData.image}" style="width:50px; height:50px; object-fit:cover;" class="rounded me-2">`;
                            }
                            if (metaData.description) {
                                metadataHtml += `<small class="text-muted d-block" style="font-size: 0.75rem;">${metaData.description.substring(0, 30)}...</small>`;
                            }
                        } catch (e) {
                            console.error("Failed to fetch IPFS metadata:", e);
                        }
                    }

                    t += `<tr>
                        <td>${product.productId}</td>
                        <td>${sn}</td>
                        <td><div class="d-flex align-items-center">${metadataHtml}<span>${name}${tamperWarning}</span></div></td>
                        <td>${brand}</td>
                        <td>${product.productPrice}</td>
                        <td>${status}</td>
                    </tr>`;
                }
            }

            document.getElementById('logdata').innerHTML = t;
            document.getElementById('add').innerHTML = DApp.account;

        } catch (error) {
            console.error("Error fetching products from events:", error);
            alert("Failed to fetch products. Check console.");
        }
    }
};

window.addEventListener('load', () => {
    App.init();
});

export default App;