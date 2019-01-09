const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
