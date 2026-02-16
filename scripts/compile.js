import fs from 'fs';
import path from 'path';
import solc from 'solc';

const contractPath = path.resolve('contracts', 'AuthChain.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'AuthChain.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode'],
            },
        },
        optimizer: {
            enabled: true,
            runs: 200
        },
        viaIR: true
    },
};

console.log('Compiling AuthChain.sol...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach((err) => {
        console.error(err.formattedMessage);
    });
    if (output.errors.some(err => err.severity === 'error')) {
        process.exit(1);
    }
}

const contract = output.contracts['AuthChain.sol']['AuthChain'];

if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
}

fs.writeFileSync(
    path.resolve('build', 'AuthChain.json'),
    JSON.stringify(contract, null, 2)
);

console.log('Compilation successful. Metadata saved to build/AuthChain.json');
