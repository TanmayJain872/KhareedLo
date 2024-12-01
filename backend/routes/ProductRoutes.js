/* jshint esversion: 11 */

const express = require("express");
const router = express.Router();

const CreateProductQuery = require("queries/product/create-product-query.js");
const UpdateProductQuery = require("queries/product/update-product-query.js");
const GetProductsDataQuery = require("queries/product/get-products-data-query.js");
const DeleteProductQuery = require("queries/product/delete-product-query.js");

// POST /api/products
router.post("/", async (request, response) => {
    try {
        console.log("🚀 ~ router.post ~ request.body:", request.body);
        const product = await CreateProductQuery.createProduct(request.body);
        await product.save();
        response.status(201).send(product);
    } catch (error) {
        response.status(400).send(error);
    }
});

// GET /api/products
router.get("/", async (request, response) => {
    const { page, limit } = request?.query;
    const products = await GetProductsDataQuery.getProductsData({ page, limit });
    response.status(200).send(products);
});

// GET /api/products/:id
router.get("/:id", async (request, response) => {
    const product = await GetProductsDataQuery.getProductsData({ productId: request.params.id });
    if (!product) return response.status(404).send("Product not found!");
    response.send(product);
});

// PUT /api/products/:id
router.put("/:id", async (request, response) => {
    // const { name, description, category, price, updatedBy } = request.body;
    const product = await UpdateProductQuery.updateProduct({
        productId: request.params.id,
        ...request.body,
    });
    if (!product) return response.status(404).send("Product not found");
    response.send(product);
});

// DELETE /api/products/:id
router.delete("/:id", async (request, response) => {
    const product = await DeleteProductQuery.deleteProduct({ productId: request.params.id });
    if (!product) return response.status(404).send("Product not found");
    response.send("Product deleted");
});

module.exports = router;
