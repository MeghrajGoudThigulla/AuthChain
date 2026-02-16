import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { AMOY_RPC_URL, PRIVATE_KEY } = process.env;

if (!AMOY_RPC_URL || !PRIVATE_KEY) {
    console.error('Missing AMOY_RPC_URL or PRIVATE_KEY in .env file');
    process.exit(1);
}

const contractData = JSON.parse(fs.readFileSync(path.resolve('build', 'AuthChain.json'), 'utf8'));
const abi = contractData.abi;
const bytecode = contractData.evm.bytecode.object;

const provider = new HDWalletProvider({
    privateKeys: [PRIVATE_KEY],
    providerOrUrl: AMOY_RPC_URL,
});

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];

    console.log('Attempting to deploy from account:', deployer);

    const gasPrice = await web3.eth.getGasPrice();
    console.log('Current Gas Price:', gasPrice);

    // Increase by 20% (1.2x) to be safe but cost-effective
    const highGasPrice = (BigInt(gasPrice) * 120n) / 100n;
    console.log('Using Higher Gas Price:', highGasPrice.toString());

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({
            from: deployer,
            gas: '1500000',
            gasPrice: highGasPrice.toString()
        });

    console.log('Contract deployed to:', result.options.address);

    // Update .env with the new address
    let envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('VITE_CONTRACT_ADDRESS=')) {
        envContent = envContent.replace(/VITE_CONTRACT_ADDRESS=.*/, `VITE_CONTRACT_ADDRESS=${result.options.address}`);
    } else {
        envContent += `\nVITE_CONTRACT_ADDRESS=${result.options.address}`;
    }
    fs.writeFileSync('.env', envContent);

    provider.engine.stop();
};

deploy().catch((err) => {
    console.error('Deployment failed:', err);
    provider.engine.stop();
});
