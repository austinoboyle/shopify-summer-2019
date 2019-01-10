const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    inventory_count: {
        type: Number,
        required: true,
        default: 1,
        min: [0, "Not Enough Stock"]
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
