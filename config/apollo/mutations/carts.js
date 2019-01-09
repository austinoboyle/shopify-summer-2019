/** @module mutations-carts */

const Cart = require("../../../models/Cart");
const User = require("../../../models/User");
const Product = require("../../../models/Product");
const { populateTotals } = require("../../../utils");

/**
 * Submit an order
 *
 * @param {*} obj unused
 * @param {Object} item { user_id: submit this user's order }
 * @param {Object} context {user: user making request}
 * @returns {Promise} resolves to updated cart
 */
exports.submitOrder = (obj, {}, context) => {
    return Cart.findOne({ user: context.user._id }).then(c => {
        console.log(c);
        let query = { $inc: {} };
        for (let item of c.items) {
            query.$inc[item.product] = -item.quantity;
        }
        console.log("QUERY", query);
        return Product.update(query, { new: true }).then(() => {
            return Cart.findOneAndUpdate(
                { user: context.user._id, purchased: false },
                { $set: { purchased: true } },
                { new: true }
            )
                .populate("user")
                .populate("items.product")
                .exec()
                .then(c => {
                    console.log("SUBMITTED", c);
                    return c;
                });
        });
    });
};

/**
 * Add an item to a cart
 *
 * @param {*} obj unused
 * @param {Object} item { product_id: id of product to add, quantity: number of said item }
 * @param {Object} context {user: user making request}
 * @returns {Promise} resolves to updated cart
 */
exports.addToCart = (obj, { product_id, quantity }, context) => {
    let activeCart = null;
    return Promise.all([
        Cart.find({ user: context.user._id }),
        User.count({ _id: context.user._id })
    ])
        .then(([cart, userCount]) => {
            if (!userCount) {
                return new Error(`User ${user_id} does not exist`);
            } else if (cart !== null) {
                return Cart.count({
                    user: context.user._id,
                    "items.product": product_id
                }).then(count => count !== 0);
            } else {
                return Cart.create({ user: context.user._id }).then(
                    () => false
                );
            }
        })
        .then(alreadyHasItem => {
            if (alreadyHasItem) {
                // User has item in their cart already, update the quantity
                return Cart.findOne({
                    user: context.user._id,
                    "items.product": product_id
                }).then(c => {
                    return Cart.findOneAndUpdate(
                        { _id: c._id, "items.product": product_id },
                        {
                            $inc: {
                                "items.$.quantity": quantity
                            }
                        },
                        { new: true }
                    )
                        .populate("items.product")
                        .then(c => populateTotals(c));
                });
            } else {
                // User does not have that item in their cart at that store,
                // push new LineItem to the cart.
                return Cart.findOneAndUpdate(
                    { user: context.user._id },
                    {
                        $push: {
                            items: { product: product_id, quantity }
                        }
                    },
                    { upsert: true, new: true }
                )
                    .populate("items.product")
                    .exec()
                    .then(o => populateTotals(o));
            }
        });
};

/**
 * Update quantity of specific item in cart
 *
 * @param {*} obj unused
 * @param {Object} item { user_id: modify this user's cart, shop_id: add item from
 * this store, product_id: id of product to add, quantity: change quantity to... }
 * @param {Object} context {user: user making request}
 * @returns {Promise} resolves to updated cart
 */
exports.updateItemQuantity = (obj, { product_id, quantity }, context) => {
    if (quantity <= 0) {
        return Cart.findOneAndUpdate(
            { user: context.user._id },
            {
                $pull: { items: { product: product_id } }
            },
            { new: true }
        )
            .populate("items.product")
            .exec()
            .then(c => populateTotals(c));
    } else {
        return Cart.findOneAndUpdate(
            {
                user: context.user._id,
                "items.product": product_id
            },
            { $set: { "items.$.quantity": quantity } },
            { new: true }
        )
            .populate("items.product")
            .exec()
            .then(c => populateTotals(c));
    }
};
