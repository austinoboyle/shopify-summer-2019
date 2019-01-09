/** @module mutations-users */
const User = require("../../../models/User");
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
 * delete a user by id
 *
 * @param {*} obj unused
 * @param {Object} user { user_id:String }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to deletion object {n:Int, ok:Int}
 */
exports.deleteMe = (obj, {}, context) => {
    return User.remove({ _id: context.user._id });
};
