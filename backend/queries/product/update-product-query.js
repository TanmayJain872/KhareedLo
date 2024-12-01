/* jshint esversion: 11 */

const Product = require("models/Product.js");

module.exports.updateProduct = async ({ name = null, description = null, category = null, price = null, updatedBy, productId }) => {
    try {
        const product = await Product.findOneAndUpdate(
            { productId },
            {
                ...(name ? { name } : {}),
                ...(description ? { description } : {}),
                ...(category ? { category } : {}),
                ...(price ? { price } : {}),
                ...(updatedBy ? { updatedBy } : {}),
            },
            {
                new: true
            }
        );
        console.log("Product updated successfully:", product);
        return product;
    } catch (error) {
        console.error("Error updating product:", error);
        return error;
    }
};
