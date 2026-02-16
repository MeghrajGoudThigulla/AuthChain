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
        const sellerCode = document.getElementById('sellerCode').value;

        if (!DApp.contract) {
            alert("Contract not loaded");
            return;
        }

        try {
            await DApp.contract.methods.manufacturerSellProduct(
                DApp.toHex(productSN),
                DApp.toHex(sellerCode)
            ).send({ from: DApp.account });

            alert("Product sold to seller successfully!");
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