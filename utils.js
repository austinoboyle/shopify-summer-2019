/** @module utils */

const _ = require("lodash");

/**
 * Populate the totals of an order.  Does both per-item and entire-order totals
 *
 * @param {Order} order order to be populated
 * @returns {Object} Populated order
 */
exports.populateTotals = order => {
    if (_.isEmpty(order)) {
        return new Error("Cart/Order/Item Does not Exist");
    }
    order.items = order.items.map(i => {
        i.total = i.product.price * i.quantity;
        return i;
    });
    order.total = order.items.reduce((prev, curr) => prev + curr.total, 0);
    return order;
};

/**
 * Create a query from all defined properties of input object
 *
 * @param {Object} obj may have undefined/null properties
 * @returns {Object} with undefined/null properties deleted
 */
exports.createQuery = obj => {
    const result = _.pickBy(obj, val => val !== null && val !== undefined);
    return result;
};
