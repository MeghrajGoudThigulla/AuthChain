import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                adminPortal: resolve(__dirname, 'src/admin-portal.html'),
                consumerPortal: resolve(__dirname, 'src/consumer-portal.html'),
                dispatchProduct: resolve(__dirname, 'src/dispatch-product.html'),
                finalizeSale: resolve(__dirname, 'src/finalize-sale.html'),
                manufacturerPortal: resolve(__dirname, 'src/manufacturer-portal.html'),
                productQuery: resolve(__dirname, 'src/product-query.html'),
                purchaseHistory: resolve(__dirname, 'src/purchase-history.html'),
                registerProduct: resolve(__dirname, 'src/register-product.html'),
                registerSeller: resolve(__dirname, 'src/register-seller.html'),
                sellerPortal: resolve(__dirname, 'src/seller-portal.html'),
                sellerQuery: resolve(__dirname, 'src/seller-query.html'),
                verifyProduct: resolve(__dirname, 'src/verify-product.html'),
            },
        },
    },
    server: {
        port: 3000,
    },
});
