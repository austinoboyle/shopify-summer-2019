/** @module resetDb*/

const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const data = require("./data");

/** Reset the database based on seed data */
module.exports = () => {
    return Promise.all([User.remove(), Product.remove(), Cart.remove()])
        .then(result => User.insertMany(data.users))
        .then(users => Product.insertMany(data.products))
        .then(products => Cart.insertMany(data.carts))
        .then(carts => {
            return data;
        })
        .catch(e => console.log(e));
};
