import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                addSeller: resolve(__dirname, 'src/addSeller.html'),
                addProduct: resolve(__dirname, 'src/addProduct.html'),
                consumer: resolve(__dirname, 'src/consumer.html'),
                manufacturer: resolve(__dirname, 'src/manufacturer.html'),
                seller: resolve(__dirname, 'src/seller.html'),
                queryProducts: resolve(__dirname, 'src/queryProducts.html'),
                querySeller: resolve(__dirname, 'src/querySeller.html'),
                verifyProducts: resolve(__dirname, 'src/verifyProducts.html'),
                sellProductManufacturer: resolve(__dirname, 'src/sellProductManufacturer.html'),
                sellProductSeller: resolve(__dirname, 'src/sellProductSeller.html'),
                consumerPurchaseHistory: resolve(__dirname, 'src/consumerPurchaseHistory.html'),
                admin: resolve(__dirname, 'src/admin.html'),
            },
        },
    },
    server: {
        port: 3000,
    },
});
