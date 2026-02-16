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
        const manufacturerCode = document.getElementById('manufacturerCode').value;

        if (!DApp.contract) {
            alert("Contract not loaded");
            return;
        }

        try {
            const mIdHex = DApp.toHex(manufacturerCode);

            // Query SellerAdded events filtered by manufacturerId
            const events = await DApp.contract.getPastEvents('SellerAdded', {
                filter: { manufacturerId: mIdHex },
                fromBlock: 0,
                toBlock: 'latest'
            });

            if (events.length === 0) {
                document.getElementById('logdata').innerHTML = '<tr><td colspan="7" class="text-center text-muted">No sellers found for this manufacturer.</td></tr>';
                return;
            }

            let t = "";
            for (const event of events) {
                const sellerCode = event.returnValues.sellerCode;

                // Fetch full details from contract using sellerMap
                const sellerIdx = await DApp.contract.methods.sellerMap(sellerCode).call();
                const seller = await DApp.contract.methods.sellers(sellerIdx).call();

                // Double check if code matches (robustness)
                if (seller.sellerCode === sellerCode) {
                    const name = DApp.web3.utils.hexToAscii(seller.sellerName).replace(/\0/g, '');
                    const brand = DApp.web3.utils.hexToAscii(seller.sellerBrand).replace(/\0/g, '');
                    const code = DApp.web3.utils.hexToAscii(seller.sellerCode).replace(/\0/g, '');
                    const manager = DApp.web3.utils.hexToAscii(seller.sellerManager).replace(/\0/g, '');
                    const address = DApp.web3.utils.hexToAscii(seller.sellerAddress).replace(/\0/g, '');

                    t += `<tr>
                        <td>${seller.sellerId}</td>
                        <td>${name}</td>
                        <td>${brand}</td>
                        <td>${code}</td>
                        <td>${seller.sellerNum}</td>
                        <td>${manager}</td>
                        <td>${address}</td>
                    </tr>`;
                }
            }

            document.getElementById('logdata').innerHTML = t;
            document.getElementById('add').innerHTML = DApp.account;

        } catch (error) {
            console.error("Error fetching sellers from events:", error);
            alert("Failed to fetch sellers. Check console.");
        }
    }
};

window.addEventListener('load', () => {
    App.init();
});

export default App;