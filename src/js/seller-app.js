import DApp from './dapp.js';

const App = {
    init: async function () {
        await DApp.init();
        this.bindEvents();
    },

    bindEvents: function () {
        const registerBtn = document.querySelector('.btn-register');
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => this.registerSeller(e));
        }
    },

    registerSeller: async function (event) {
        event.preventDefault();

        const manufacturerId = document.getElementById('ManufacturerId').value;
        const sellerName = document.getElementById('SellerName').value;
        const sellerBrand = document.getElementById('SellerBrand').value;
        const sellerCode = document.getElementById('SellerCode').value;
        const sellerPhoneNumber = document.getElementById('SellerPhoneNumber').value;
        const sellerManager = document.getElementById('SellerManager').value;
        const sellerAddress = document.getElementById('SellerAddress').value;

        if (!DApp.contract) {
            alert("Contract not loaded");
            return;
        }

        try {
            await DApp.contract.methods.addSeller(
                DApp.toHex(manufacturerId),
                DApp.toHex(sellerName),
                DApp.toHex(sellerBrand),
                DApp.toHex(sellerCode),
                sellerPhoneNumber, // uint256
                DApp.toHex(sellerManager),
                DApp.toHex(sellerAddress)
            ).send({ from: DApp.account });

            // Clear inputs
            document.getElementById('ManufacturerId').value = '';
            document.getElementById('SellerName').value = '';
            document.getElementById('SellerBrand').value = '';
            document.getElementById('SellerCode').value = '';
            document.getElementById('SellerPhoneNumber').value = '';
            document.getElementById('SellerManager').value = '';
            document.getElementById('SellerAddress').value = '';

            alert("Seller registered successfully!");

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