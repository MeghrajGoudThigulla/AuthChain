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
        const consumerCode = document.getElementById('consumerCode').value;

        if (!DApp.contract) {
            alert("Contract not loaded");
            return;
        }

        try {
            const cCodeHex = DApp.toHex(consumerCode);

            // Query ProductSoldToConsumer events filtered by consumerCode
            const events = await DApp.contract.getPastEvents('ProductSoldToConsumer', {
                filter: { consumerCode: cCodeHex },
                fromBlock: 0,
                toBlock: 'latest'
            });

            if (events.length === 0) {
                document.getElementById('logdata').innerHTML = '<tr><td colspan="3" class="text-center text-muted">No purchase history found for this consumer.</td></tr>';
                return;
            }

            let t = "";
            for (const event of events) {
                const productSN = event.returnValues.productSN;

                // Fetch related codes from contract mappings
                const sellerCodeHex = await DApp.contract.methods.productsForSale(productSN).call();
                const manufacturerIdHex = await DApp.contract.methods.productsManufactured(productSN).call();

                const sn = DApp.web3.utils.hexToAscii(productSN).replace(/\0/g, '');
                const sCode = DApp.web3.utils.hexToAscii(sellerCodeHex).replace(/\0/g, '');
                const mCode = DApp.web3.utils.hexToAscii(manufacturerIdHex).replace(/\0/g, '');

                let metadataHtml = "";
                try {
                    const productIdx = await DApp.contract.methods.productMap(productSN).call();
                    const product = await DApp.contract.methods.productItems(productIdx).call();

                    if (product.productMetadata) {
                        const metaUrl = `https://gateway.pinata.cloud/ipfs/${product.productMetadata}`;
                        const metaResponse = await fetch(metaUrl);
                        const metaData = await metaResponse.json();

                        if (metaData.image) {
                            metadataHtml = `<img src="${metaData.image}" style="width:40px; height:40px; object-fit:cover;" class="rounded shadow-sm me-2">`;
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch product metadata for history:", e);
                }

                t += `<tr>
                    <td><div class="d-flex align-items-center">${metadataHtml}<span>${sn}</span></div></td>
                    <td>${sCode}</td>
                    <td>${mCode}</td>
                </tr>`;
            }

            document.getElementById('logdata').innerHTML = t;
            document.getElementById('add').innerHTML = DApp.account;

        } catch (error) {
            console.error("Error fetching history from events:", error);
            alert("Failed to fetch history. Check console.");
        }
    }
};

window.addEventListener('load', () => {
    App.init();
});

export default App;