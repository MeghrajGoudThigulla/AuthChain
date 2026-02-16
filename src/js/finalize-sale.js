import DApp from './dapp.js';

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
    },

    registerProduct: async function (event) {
        event.preventDefault();

        const productSN = document.getElementById('productSN').value;
        const consumerCode = document.getElementById('consumerCode').value;

        if (!DApp.contract) {
            alert("Contract not loaded");
            return;
        }

        try {
            await DApp.contract.methods.sellerSellProduct(
                DApp.toHex(productSN),
                DApp.toHex(consumerCode)
            ).send({ from: DApp.account });

            alert("Product sold to consumer successfully!");
            window.location.reload();

        } catch (error) {
            console.error(error.message);
            alert("Error: " + error.message);
        }
    }
};

window.addEventListener('load', () => {
    App.init();
});

export default App;