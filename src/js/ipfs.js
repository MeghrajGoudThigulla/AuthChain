const IPFS = {
    PinataApiKey: import.meta.env.VITE_PINATA_API_KEY,
    PinataSecretApiKey: import.meta.env.VITE_PINATA_SECRET_KEY,

    uploadFile: async function (file) {
        if (!this.PinataApiKey || !this.PinataSecretApiKey) {
            console.error("Pinata API keys not found in .env");
            return null;
        }

        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let data = new FormData();
        data.append('file', file);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'pinata_api_key': this.PinataApiKey,
                    'pinata_secret_api_key': this.PinataSecretApiKey
                },
                body: data
            });
            const result = await response.json();
            return result.IpfsHash;
        } catch (error) {
            console.error("Error uploading to IPFS:", error);
            return null;
        }
    },

    uploadJSON: async function (jsonData) {
        if (!this.PinataApiKey || !this.PinataSecretApiKey) {
            console.error("Pinata API keys not found in .env");
            return null;
        }

        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': this.PinataApiKey,
                    'pinata_secret_api_key': this.PinataSecretApiKey
                },
                body: JSON.stringify(jsonData)
            });
            const result = await response.json();
            return result.IpfsHash;
        } catch (error) {
            console.error("Error uploading JSON to IPFS:", error);
            return null;
        }
    }
};

export default IPFS;
