import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { AMOY_RPC_URL, PRIVATE_KEY } = process.env;

if (!AMOY_RPC_URL || !PRIVATE_KEY) {
    console.error('Missing env vars');
    process.exit(1);
}

const provider = new HDWalletProvider({
    privateKeys: [PRIVATE_KEY],
    providerOrUrl: AMOY_RPC_URL,
});

const web3 = new Web3(provider);

const check = async () => {
    try {
        const contractData = JSON.parse(fs.readFileSync(path.resolve('build', 'AuthChain.json'), 'utf8'));
        const bytecode = contractData.evm.bytecode.object;
        const abi = contractData.abi;

        const accounts = await web3.eth.getAccounts();
        const deployer = accounts[0];
        const balance = await web3.eth.getBalance(deployer);

        console.log(`Account: ${deployer}`);
        console.log(`Balance: ${web3.utils.fromWei(balance, 'ether')} POL`);

        const gasPrice = await web3.eth.getGasPrice();
        console.log(`Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} gwei`);

        // Estimate gas
        const estimatedGas = await new web3.eth.Contract(abi)
            .deploy({ data: bytecode })
            .estimateGas({ from: deployer });

        console.log(`Estimated Gas Limit: ${estimatedGas}`);

        const cost = BigInt(gasPrice) * BigInt(estimatedGas);
        console.log(`Total Cost: ${web3.utils.fromWei(cost.toString(), 'ether')} POL`);

        if (BigInt(balance) < cost) {
            console.error('INSUFFICIENT FUNDS');
        } else {
            console.log('FUNDS OK');
        }

    } catch (error) {
        console.error(error);
    } finally {
        provider.engine.stop();
    }
};

check();
