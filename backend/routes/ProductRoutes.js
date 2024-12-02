/* jshint esversion: 11 */

const express = require("express");
const router = express.Router();

const authenticateToken = require("utilities/authenticate-token.js");

const CreateProductQuery = require("queries/product/create-product-query.js");
const UpdateProductQuery = require("queries/product/update-product-query.js");
const GetProductsDataQuery = require("queries/product/get-products-data-query.js");
const DeleteProductQuery = require("queries/product/delete-product-query.js");

// POST /api/products
router.post("/", authenticateToken, async (request, response) => {
    try {
        const product = await CreateProductQuery.createProduct(request.body);
        await product.save();
        response.status(201).json({
            message: "Created Product Successfully!",
            status: true,
            statusCode: 201,
            data: product
        });
    } catch (error) {
        response.status(500).json({
            error: "InternalServerError",
            status: false,
            statusCode: 500,
            message: "Error in adding a product."
        });
    }
});

// GET /api/products
router.get("/", async (request, response) => {
    try {
        const { page, limit } = request?.query;
        const products = await GetProductsDataQuery.getProductsData({ page, limit });
        response.status(200).json({
            message: "Successfully fetched Products List!",
            status: true,
            statusCode: 200,
            data: JSON.parse(JSON.stringify(products)),
        });
    } catch (error) {
        return response.status(500).json({
            error: "InternalServerError",
            status: false,
            statusCode: 500,
            message: "Error in fetching products data."
        });
    }
});

// GET /api/products/:id
router.get("/:id", async (request, response) => {
    try {
        const product = await GetProductsDataQuery.getProductsData({ productId: request.params.id });
        if (!product) return response.status(404).json({
            error: "BusinessValidationError",
            status: false,
            statusCode: 404,
            message: "Product not found."
        });
        response.send(product);
    } catch (error) {
        return response.status(500).json({
            error: "InternalServerError",
            status: false,
            statusCode: 500,
            message: "Error in fetching a product."
        });
    }
});

// PUT /api/products/:id
router.put("/:id", authenticateToken, async (request, response) => {
    try {
        const product = await UpdateProductQuery.updateProduct({
            productId: request.params.id,
            ...request.body,
        });
        if (!product) return response.status(404).json({
            error: "BusinessValidationError",
            status: false,
            statusCode: 404,
            message: "Product not found."
        });
        response.status(200).json({
            message: "Updated Product Successfully!",
            status: true,
            statusCode: 200,
            data: product
        });
    } catch (error) {
        return response.status(500).json({
            error: "InternalServerError",
            status: false,
            statusCode: 500,
            message: "Error in updating a product."
        });
    }
});

// DELETE /api/products/:id
router.delete("/:id", authenticateToken, async (request, response) => {
    try {
        const product = await DeleteProductQuery.deleteProduct({ productId: request.params.id });
        if (!product) return response.status(404).send({
            error: "BusinessValidationError",
            status: false,
            statusCode: 404,
            message: "Product not found."
        });
        response.status(200).json({
            message: "Deleted Product Successfully!",
            status: true,
            statusCode: 200,
            data: product
        });
    } catch (error) {
        return response.status(500).json({
            error: "InternalServerError",
            status: false,
            statusCode: 500,
            message: "Error in deleting a product."
        });
    }
});

module.exports = router;
