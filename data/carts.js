const ObjectId = require("mongoose").Types.ObjectId;

module.exports = [
    {
        _id: ObjectId("511111111111111111111111"),
        user: ObjectId("111111111111111111111111"),
        items: [
            {
                product: ObjectId("311111111111111111111111"),
                quantity: 4
            }
        ]
    },
    {
        _id: ObjectId("511111111111111111111112"),
        user: ObjectId("111111111111111111111112"),
        items: [
            {
                product: ObjectId("311111111111111111111113"),
                quantity: 9
            }
        ]
    }
];
