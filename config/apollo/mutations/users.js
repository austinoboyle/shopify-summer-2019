/** @module mutations-users */
const User = require("../../../models/User");
const Product = require("../../../models/Product");
const { mustBeLoggedIn } = require("../../authHelper");
/**
 * Create a new user
 *
 * @param {*} obj unused
 * @param {Object} user { username:String }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to new user
 */
exports.createUser = (obj, { username }) => User.create({ username });

/**
 * Delete a user by id.  Also deletes all of the product they own in the marketplace.
 *
 * @param {*} obj unused
 * @param {Object} fields unused
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to deletion object {n:Int, ok:Int}
 */
exports.deleteMe = (obj, {}, context) => {
    mustBeLoggedIn(context.user);
    return User.remove({ _id: context.user._id }).then(() =>
        Product.remove({ owner: context.user._id })
    );
};
