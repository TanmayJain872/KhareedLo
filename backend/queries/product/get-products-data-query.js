/* jshint esversion: 11 */

const Product = require('models/Product.js');  // Assuming you have a Product model

module.exports.getProductsData = async ({ page = 1, limit = 10, productId = null }) => {
    try {

        let products, totalPages = 1, totalProducts = 1;

        if (productId) {
            products = await Product.findOne({ externalProductId: productId });
        } else {
            const skip = (page - 1) * limit;
            products = await Product.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            totalProducts = await Product.countDocuments();
            totalPages = Math.ceil(totalProducts / limit);
        }

        return {
            data: products,
            currentPage: page,
            totalPages,
            totalProducts
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return error;
    }
};
