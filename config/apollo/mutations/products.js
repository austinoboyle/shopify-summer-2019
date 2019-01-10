/** @module mutations-products */

const Product = require("../../../models/Product");
const { createQuery } = require("../../../utils");
const { mustBeLoggedIn } = require("../../authHelper");
const { DoesNotExistError } = require("../../../errors");

/**
 * Create a new Product
 *
 * @param {*} obj unused
 * @param {Object} product { title:String, price:Number, inventory_count:Number }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolve to new Product
 */
exports.createProduct = (obj, { title, price, inventory_count }, context) => {
    mustBeLoggedIn(context.user);
    return Product.create({
        title,
        price,
        inventory_count,
        owner: context.user._id
    }).then(p => {
        return Product.populate(p, "owner");
    });
};

/**
 * Update Existing Product
 *
 * @param {*} obj unused
 * @param {Object} product { id:String, title:String,
 * price:Number, inventory_count:Number }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to updated Product
 */
exports.updateProduct = (
    obj,
    { id, title, price, inventory_count },
    context
) => {
    mustBeLoggedIn(context.user);
    return Product.findOneAndUpdate(
        { _id: id, owner: context.user._id },
        createQuery({ title, price, inventory_count }),
        { new: true }
    )
        .exec()
        .then(updated => {
            if (updated === null) {
                throw new DoesNotExistError(
                    "You do not own a product with that ID"
                );
            }
            return Product.populate(updated, "owner");
        });
};

/**
 * Remove a product.  Deletes product item and removes item Shop.products of
 * shop it belongs to.
 *
 * @param {*} obj unused
 * @param {Object} product { id:String}
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to {n:Int, ok:Int}
 */
exports.deleteProduct = (obj, { id }, context) => {
    mustBeLoggedIn(context.user);
    return Product.remove({ _id: id, owner: context.user._id }).then(resp => {
        if (resp.n === 0) {
            throw new DoesNotExistError(
                "You do not own a product with that ID"
            );
        }
        return resp;
    });
};
