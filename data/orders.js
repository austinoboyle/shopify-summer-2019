const ObjectId = require("mongoose").Types.ObjectId;

module.exports = [
    {
        _id: ObjectId("411111111111111111111111"),
        user: ObjectId("111111111111111111111111"),
        items: [
            {
                product: {
                    id: ObjectId("311111111111111111111111"),
                    title: "Toilet Paper",
                    price: 4.5
                },
                quantity: 4,
                total: 18
            },
            {
                product: {
                    id: ObjectId("311111111111111111111112"),
                    title: "Shovel",
                    price: 12.99
                },
                quantity: 1,
                total: 12.99
            }
        ],
        total: 30.99
    },
    {
        _id: ObjectId("411111111111111111111112"),
        user: ObjectId("111111111111111111111112"),
        items: [
            {
                product: {
                    id: ObjectId("311111111111111111111113"),
                    title: "Bananas",
                    price: 0.68
                },
                quantity: 9,
                total: 6.12
            },
            {
                product: {
                    id: ObjectId("311111111111111111111114"),
                    title: "Vector Cereal",
                    price: 8.99
                },
                quantity: 5,
                total: 44.95
            }
        ],
        total: 51.07
    }
];
