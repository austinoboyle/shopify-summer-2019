/** @module mutations-products */

const Product = require("../../../models/Product");
const { createQuery } = require("../../../utils");

/**
 * Create a new Product
 *
 * @param {*} obj unused
 * @param {Object} product { name:String, price:Number, shop_id:String }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolve to new Product
 */
exports.createProduct = (obj, { title, price, inventory_count }, context) => {
    return Product.create({
        title,
        price,
        inventory_count,
        owner: context.user._id
    });
};

/**
 * Update Existing Product
 *
 * @param {*} obj unused
 * @param {Object} product { product_id:String, title:String,
 * price:Number, inventory_count:Number }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to updated Product
 */
exports.updateProduct = (
    obj,
    { product_id, title, price, inventory_count },
    context
) => {
    return Product.findOneAndUpdate(
        { _id: product_id, owner: context.user._id },
        createQuery({ title, price, inventory_count }),
        { new: true }
    )
        .exec()
        .then(updated => {
            if (updated === null) {
                throw new Error(
                    "Product does not exist/logged in user is not owner."
                );
            }
            return updated;
        });
};

/**
 * Remove a product.  Deletes product item and removes item Shop.products of
 * shop it belongs to.
 *
 * @param {*} obj unused
 * @param {Object} product { shop_id:String, product_id:String, name:String, price:Number }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to {n:Int, ok:Int}
 */
exports.deleteProduct = (obj, { shop_id, product_id }, context) => {
    return Product.remove({ _id: product_id, owner: context.user._id });
};
