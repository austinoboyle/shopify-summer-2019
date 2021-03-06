/**
 * Custom GraphQL Query Types and Resolvers
 * @module queries
 */

const { mustBeLoggedIn } = require("../../utils/authHelper");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");

const { createQuery, populateTotals } = require("../../utils/utils");

/**
 * Documentation/Definitions for Query Types
 * @type {String}
 */
exports.queryTypes = `
type Query {
    """
    Get users by username or id"

    Access Required: NONE
    """
    users(id: ID, username: String): [User!]

    """
    Get products by id, title, owner, or availability.  Set the 'inStockOnly'
    flag to true to only get items that are available for purchase.
    
    Access Required: NONE
    """
    products(id: ID, title: String, owner: ID, inStockOnly: Boolean=false): [Product!]

    """
    Get your active cart, if any.  Can only have one active cart at a time
    
    Access Required: USER
    """
    cart: Cart

    """
    Get your past orders

    Access Required: USER
    """
    orders(id: ID): [Order!]
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
 * @param {*} query { id:String, title:String, owner:String, inStockOnly: Boolean }
 * @returns {Promise} resolves to array of Products
 */
const products = (obj, { id, title, owner, inStockOnly }, context, info) => {
    let query = createQuery({ _id: id, title, owner });

    if (inStockOnly) {
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
 * @param {*} query { id:String}
 * @returns {Promise} resolves to a single Cart or null
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
 * @param {*} query {id: order id}
 * @returns {Promise} resolves to array of Orders made by the user
 */
const orders = (obj, { id }, context) => {
    mustBeLoggedIn(context.user);
    const query = createQuery({ _id: id, user: context.user._id });
    return Order.find(query)
        .populate("user")
        .exec();
};

/**
 * Exported object containing all query Resolvers
 * {users, products, cart, orders}
 * @type {Object}
 */
exports.queryResolvers = {
    users,
    products,
    cart,
    orders
};
