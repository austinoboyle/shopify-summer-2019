const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        items: [
            {
                product: {
                    id: Schema.Types.ObjectId,
                    title: String,
                    price: Number
                },
                quantity: {
                    type: Number,
                    required: true
                },
                total: {
                    type: Number,
                    required: true
                }
            }
        ],
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
