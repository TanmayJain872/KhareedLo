/* jshint esversion: 11 */

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
// const autoIncrement = require("mongoose-auto-increment");

// autoIncrement.initialize(mongoose.connection);

const ProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.Number,
        required: false
    },
    externalProductId: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: false,
        trim: true
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },
    category: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    status: {
        type: mongoose.Schema.Types.Number,
        required: true,
        default: 1
    },
    createdBy: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: Date.now
    }
});


// ProductSchema.plugin(autoIncrement.plugin, {
//     model: "Product",
//     field: "id",
//     startAt: 1,
//     incrementBy: 1
// });

ProductSchema.plugin(AutoIncrement, { inc_field: "productId", start_seq: 1, counter_name: "productCounter" });

ProductSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});
  

ProductSchema.post("save", async (doc, next) => {
    const calculatedId = doc.productId + 1000;
    doc.externalProductId = `KL-${calculatedId}`;
    doc.save()
        .then(() => next())
        .catch(error => {
            console.error("Failed to create External Product ID");
            next(error);
        });
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;