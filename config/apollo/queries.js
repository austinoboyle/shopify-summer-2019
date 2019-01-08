/**
 * Custom GraphQL Query Types and Resolvers
 * @module queries
 */

const User = require("../../models/User");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");

const { createQuery } = require("../../utils");

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
    "Get carts by id or user_id"
    carts(id: ID, user_id: ID): [Cart!]
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
    return Product.find(query);
};

/**
 * Query carts
 *
 * @param {*} obj unused
 * @param {*} query { id:String, user_id:String, active:Boolean }
 * @returns {Promise} resolves to array of Carts
 */
const carts = (obj, { id, user_id, active }) => {
    return Cart.find(createQuery({ _id: id, user_id }))
        .populate("items.product")
        .exec();
};

/**
 * Exported object containing all query Resolvers
 * {users, shops, products, carts, orders}
 * @type {Object}
 */
exports.queryResolvers = {
    users,
    products,
    carts
};
