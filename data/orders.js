const ObjectId = require("mongoose").Types.ObjectId;

module.exports = [
    {
        _id: ObjectId("411111111111111111111111"),
        user: ObjectId("111111111111111111111111"),
        shop: ObjectId("211111111111111111111111"),
        items: [
            {
                product: {
                    _id: ObjectId("311111111111111111111111"),
                    name: "Toilet Paper",
                    shop: ObjectId("211111111111111111111111"),
                    price: 4.5
                },
                quantity: 4
            },
            {
                product: {
                    _id: ObjectId("311111111111111111111112"),
                    name: "Shovel",
                    shop: ObjectId("211111111111111111111111"),
                    price: 12.99
                },
                quantity: 1
            }
        ]
    },
    {
        _id: ObjectId("411111111111111111111112"),
        user: ObjectId("111111111111111111111112"),
        shop: ObjectId("211111111111111111111112"),
        items: [
            {
                product: {
                    _id: ObjectId("311111111111111111111113"),
                    name: "Bananas",
                    shop: ObjectId("211111111111111111111112"),
                    price: 0.68
                },
                quantity: 9
            },
            {
                product: {
                    _id: ObjectId("311111111111111111111114"),
                    name: "Vector Cereal",
                    shop: ObjectId("211111111111111111111112"),
                    price: 8.99
                },
                quantity: 5
            }
        ]
    }
];
