const ObjectId = require("mongoose").Types.ObjectId;

module.exports = [
    {
        _id: ObjectId("311111111111111111111111"),
        title: "Toilet Paper",
        owner: ObjectId("111111111111111111111111"),
        price: 4.5,
        inventory_count: 100
    },
    {
        _id: ObjectId("311111111111111111111112"),
        title: "Shovel",
        owner: ObjectId("111111111111111111111111"),
        price: 12.99,
        inventory_count: 100
    },
    {
        _id: ObjectId("311111111111111111111113"),
        title: "Bananas",
        owner: ObjectId("111111111111111111111112"),
        price: 0.68,
        inventory_count: 2000
    },
    {
        _id: ObjectId("311111111111111111111114"),
        title: "Vector Cereal",
        owner: ObjectId("111111111111111111111112"),
        price: 8.99,
        inventory_count: 0
    }
];
