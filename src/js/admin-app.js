import DApp from './dapp.js';

const App = {
    init: async function () {
        await DApp.init();
        this.bindEvents();
        this.listManufacturers();
    },

    bindEvents: function () {
        const addBtn = document.querySelector('.btn-add-manufacturer');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => this.addManufacturer(e));
        }
    },

    addManufacturer: async function (event) {
        event.preventDefault();
        const address = document.getElementById('manufacturerAddress').value;

        if (!DApp.contract) {
            alert("Contract not loaded");
            return;
        }

        try {
            await DApp.contract.methods.addManufacturer(address).send({ from: DApp.account });
            alert("Manufacturer authorized successfully!");
            location.reload();
        } catch (error) {
            console.error("Error authorizing manufacturer:", error);
            alert("Failed to authorize manufacturer. Only the owner can do this.");
        }
    },

    listManufacturers: async function () {
        try {
            const events = await DApp.contract.getPastEvents('ManufacturerAdded', {
                fromBlock: 0,
                toBlock: 'latest'
            });

            let t = "";
            events.forEach(event => {
                t += `<tr><td>${event.returnValues.manufacturer}</td></tr>`;
            });

            document.getElementById('manufacturerList').innerHTML = t;
            document.getElementById('ownerAdd').innerHTML = await DApp.contract.methods.owner().call();
            document.getElementById('currentAdd').innerHTML = DApp.account;

        } catch (error) {
            console.error("Error listing manufacturers:", error);
        }
    }
};

window.addEventListener('load', () => {
    App.init();
});

export default App;
