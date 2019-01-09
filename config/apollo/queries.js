/**
 * Custom GraphQL Query Types and Resolvers
 * @module queries
 */

const { mustBeLoggedIn } = require("../authHelper");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");

const { createQuery, populateTotals } = require("../../utils");

/**
 * Documentation/Definitions for Query Types
 * @type {String}
 */
exports.queryTypes = `
type Query {
    "Get users by username or id"
    users(id: ID, username: String): [User!]

    "Get products by id, title, owner, or availability"
    products(id: ID, title: String, owner: String, available: Boolean): [Product!]

    "Get your active cart, if any.  Can only have one active cart at a time"
    cart: Cart

    "Get your past orders"
    orders: [Order!]
}
`;

/**
 * Query Users
 *
 * @param {*} obj unused
 * @param {*} query { id:String, username:String }
 * @returns {Promise} resolves to array of Users
 */
const users = (obj, { id, username }, context, info) => {
    return User.find(createQuery({ _id: id, username }));
};

/**
 * Query products
 *
 * @param {*} obj unused
 * @param {*} query { id:String, name:String, owner:String, available: Boolean }
 * @returns {Promise} resolves to array of Products
 */
const products = (obj, { id, title, owner, available }, context, info) => {
    let query = createQuery({ _id: id, title, owner });
    if (available) {
        query.inventory_count = { $gt: 0 };
    }
    return Product.find(query)
        .populate("owner")
        .exec();
};

/**
 * Query carts
 *
 * @param {*} obj unused
 * @param {*} query { id:String, user_id:String, active:Boolean }
 * @returns {Promise} resolves to array of Carts
 */
const cart = (obj, { id }, context) => {
    mustBeLoggedIn(context.user);
    return Cart.findOne({ user: context.user._id })
        .populate("items.product")
        .populate("user")
        .exec()
        .then(populateTotals);
};

/**
 * Query orders
 *
 * @param {*} obj unused
 * @param {*} query {}
 * @returns {Promise} resolves to array of Orders made by the user
 */
const orders = (obj, {}, context) => {
    mustBeLoggedIn(context.user);
    return Order.find({ user: context.user._id })
        .populate("user")
        .exec()
        .then(o => {
            console.log("ORDERS", o);
            return o;
        });
};

/**
 * Exported object containing all query Resolvers
 * {users, shops, products, carts, orders}
 * @type {Object}
 */
exports.queryResolvers = {
    users,
    products,
    cart,
    orders
};
