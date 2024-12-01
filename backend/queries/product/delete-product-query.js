/* jshint esversion: 11 */

const Product = require("models/Product.js");

module.exports.deleteProduct = async ({ productId }) => {
    try {
        const product = await Product.deleteOne({ productId });
        console.log("Product deleted successfully:", product);
        return product;
    } catch (error) {
        console.error("Error deleting product:", error);
        return error;
    }
};
