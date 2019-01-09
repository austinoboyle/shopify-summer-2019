/** @module mutations-carts */

const Cart = require("../../../models/Cart");
const Product = require("../../../models/Product");
const Order = require("../../../models/Order");
const {
    InventoryError,
    DoesNotExistError,
    AppError,
    OrderError
} = require("../../../errors");
const { mustBeLoggedIn } = require("../../authHelper");
const { populateTotals } = require("../../../utils");

function handleOrderError(cart, itemStatus) {
    let promises = [];
    let invalidFields = {};
    for (let item of cart.items) {
        const itemID = item.product.toString();
        if (itemStatus[itemID].success) {
            promises.push(
                Product.findOneAndUpdate(
                    {
                        _id: itemID
                    },
                    { $inc: { inventory_count: item.quantity } }
                )
            );
        } else {
            invalidFields[itemID] = itemStatus[itemID].error;
        }
    }
    return Promise.all(promises).then(() => {
        return new OrderError(null, invalidFields);
    });
}

/**
 * Submit an order
 *
 * @param {*} obj unused
 * @param {Object} item { user_id: submit this user's order }
 * @param {Object} context {user: user making request}
 * @returns {Promise} resolves to updated cart
 */
exports.submitOrder = (obj, {}, context) => {
    mustBeLoggedIn(context.user);
    let itemStatus = {};
    return Cart.findOne({ user: context.user._id }).then(c => {
        if (c === null) {
            throw new DoesNotExistError("No Order To Submit.");
        }
        for (let item of c.items) {
            itemStatus[item.product.toString()] = { success: false, error: "" };
        }
        const promises = [
            c.items.map(i =>
                Product.findOneAndUpdate(
                    { _id: i.product.toString() },
                    { $inc: { inventory_count: -i.quantity } }
                )
                    .then(updated => {
                        itemStatus[i.product.toString()] = {
                            success: true,
                            error: ""
                        };
                    })
                    .catch(e => {
                        itemStatus[i.product.toString()] = {
                            success: false,
                            error: e.message
                        };
                    })
            )
        ];
        return Promise.all(promises)
            .then(() => {
                let orderObj;
                return Cart.populate(c, ["user", "items.product"])
                    .then(populated => populateTotals(populated.toJSON()))
                    .then(totalled => {
                        orderObj = totalled;
                        return Cart.remove({ user: context.user._id });
                    })
                    .then(() => Order.create(orderObj));
            })
            .catch(e => {
                console.log(e);
                return handleOrderError(c, itemStatus);
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
    mustBeLoggedIn(context.user);
    let activeCart;
    let activeProduct;

    return Promise.all([
        Cart.findOne({ user: context.user._id }),
        Product.findOne({ _id: product_id })
    ])
        .then(([cart, product]) => {
            if (product === null) {
                throw new DoesNotExistError();
            }
            activeProduct = product;
            if (cart === null) {
                return Cart.create({ user: context.user._id }).then(newCart => {
                    activeCart = newCart;
                    return 0;
                });
            } else {
                activeCart = cart;
                const item = activeCart.items.filter(
                    i => i.product.toString() === product_id
                );
                return item.length === 0 ? 0 : item[0].quantity;
            }
        })
        .then(currentQuantity => {
            const totalQuantity = currentQuantity + quantity;
            if (totalQuantity > activeProduct.inventory_count) {
                throw new InventoryError(activeProduct);
            }
            if (currentQuantity > 0) {
                // User has item in their cart already, update the quantity
                activeCart.items = activeCart.items.map(i => {
                    if (i.product.toString() === product_id) {
                        i.quantity = totalQuantity;
                    }
                    return i;
                });
            } else {
                activeCart.items.push({ product: product_id, quantity });
            }

            return activeCart.save().then(c => {
                return Cart.populate(activeCart, [
                    "user",
                    "items.product"
                ]).then(c => populateTotals(c));
            });
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
    mustBeLoggedIn(context.user);
    return Promise.all([
        Product.findOne({ _id: product_id }),
        Cart.findOne({ user: context.user._id })
    ]).then(([product, cart]) => {
        if (!product) {
            throw new DoesNotExistError();
        }
        if (!cart) {
            throw new DoesNotExistError("Cart Does Not Exist");
        }
        if (quantity > product.inventory_count) {
            throw new InventoryError(product);
        }
        const matchingItems = cart.items.filter(
            i => i.product.toString() === product_id
        );
        if (matchingItems.length === 0) {
            return new DoesNotExistError("Product Not in Cart");
        } else if (quantity <= 0) {
            cart.items = cart.items.filter(
                i => i.product.toString() !== product_id
            );
        } else {
            cart.items = cart.items.map(i => {
                if (i.product.toString() === product_id) {
                    i.quantity = quantity;
                }
                return i;
            });
        }
        return cart
            .save()
            .then(c =>
                Cart.populate(c, ["user", "items.product"]).then(populateTotals)
            );
    });
};
