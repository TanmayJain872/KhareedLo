/* jshint esversion: 11 */

const Product = require("models/Product.js");

module.exports.createProduct = async ({ name, description, category, price, createdBy }) => {
    const newProduct = new Product({
        name,
        description,
        category,
        price,
        createdBy,
        updatedBy: createdBy
    });
    console.log("🚀 ~ module.exports.createProduct= ~ newProduct:", newProduct)

    try {
        await newProduct.save();
        console.log("Product created successfully:", newProduct);
        return newProduct;
    } catch (error) {
        console.error("Error creating product:", error);
        return error;
    }
};