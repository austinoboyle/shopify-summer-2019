const seedData = require("../data");
const {
    setup,
    end,
    graphQLQuery,
    mutation
} = require("../config/tests/testUtils.js");
const Product = require("../models/Product");
const db = require("../config/mongoose");
db();

afterAll(end);

describe("Add Item", () => {
    beforeEach(setup);

    it("Rejects if not logged in", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 5){id total}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Rejects if quantity is too high", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: ${seedData
                .products[0].inventory_count + 1}){id total}`
        );
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Creates new cart if one doesn't exist", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: ${
                seedData.products[0].inventory_count
            }){items{quantity}}`
        );
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeUndefined();
            expect(res.data.addToCart.items.length).toBe(1);
            expect(res.data.addToCart.items[0].quantity).toBe(
                seedData.products[0].inventory_count
            );
            done();
        });
    });
    it("Adds to quantity if item in cart", done => {
        const q = mutation(
            `first: addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 1){items{quantity}}
            second: addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 1){items{quantity}}
            `
        );
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeUndefined();
            expect(res.data.first.items.length).toBe(1);
            expect(res.data.second.items.length).toBe(1);
            expect(res.data.first.items[0].quantity).toBe(1);
            expect(res.data.second.items[0].quantity).toBe(2);
            done();
        });
    });
    it("Adds new item if not in cart", done => {
        const q = mutation(
            `first: addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 1){items{quantity}}
            second: addToCart(product_id: "${seedData.products[1]._id.toHexString()}", quantity: 1){items{quantity}}
            `
        );
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeUndefined();
            expect(res.data.first.items.length).toBe(1);
            expect(res.data.second.items.length).toBe(2);
            expect(res.data.first.items[0].quantity).toBe(1);
            expect(res.data.second.items[0].quantity).toBe(1);
            done();
        });
    });
    it("Rejects quantities <= 0", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 0){items{quantity}}`
        );
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
});

describe("Update Item Quantity", () => {
    beforeEach(setup);
    it("Rejects if not logged in", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 100){items{quantity}}
            updateItemQuantity(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 10){items{quantity}}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Rejects if item not in cart", done => {
        const q = mutation(
            `updateItemQuantity(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 10){items{quantity}}`
        );
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Rejects if value too high", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: ${
                seedData.products[0].inventory_count
            }){items{quantity}}
            updateItemQuantity(product_id: "${seedData.products[0]._id.toHexString()}", quantity: ${seedData
                .products[0].inventory_count + 1}){items{quantity}}`
        );
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Basic Functionality works", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 100){items{quantity}}
            updateItemQuantity(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 10){items{quantity}}`
        );
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeUndefined();
            expect(res.data.addToCart.items[0].quantity).toBe(100);
            expect(res.data.updateItemQuantity.items[0].quantity).toBe(10);
            done();
        });
    });
    it("Removes item if updated to 0", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 100){items{quantity}}
            updateItemQuantity(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 0){items{quantity}}`
        );
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeUndefined();
            expect(res.data.addToCart.items[0].quantity).toBe(100);
            expect(res.data.updateItemQuantity.items.length).toBe(0);
            done();
        });
    });
});

describe("Create Order", () => {
    beforeEach(setup);
    it("Rejects if not logged in", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 100){items{quantity}}
            submitOrder{items{quantity}}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Rejects if cart doesn't exist", done => {
        const q = mutation(`submitOrder{items{quantity}}`);
        graphQLQuery(q, { user: seedData.users[2] }).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Rejects if cart empty", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 100){items{quantity}}
            updateItemQuantity(product_id: "${seedData.products[0]._id.toHexString()}", quantity: 0){items{quantity}}
            submitOrder{items{quantity}}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Rejects if product removed before purchase", done => {
        const q = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: ${
                seedData.products[0].inventory_count
            }){items{quantity}}`
        );
        const q2 = mutation(`submitOrder{id}`);
        graphQLQuery(q, { user: seedData.users[2] })
            .then(res => {
                expect(res.data.addToCart).toBeDefined();
                return Product.remove({});
            })
            .then(removed => {
                return graphQLQuery(q2, { user: seedData.users[2] });
            })
            .then(res => {
                console.log(res.errors);
                expect(res.errors).toBeDefined();
                done();
            })
            .catch(e => done(e));
    });
    it("Rejects if not enough stock", done => {
        const q1 = mutation(
            `addToCart(product_id: "${seedData.products[0]._id.toHexString()}", quantity: ${
                seedData.products[0].inventory_count
            }){items{quantity}}`
        );
        const q2 = mutation(`submitOrder{id}`);
        // First three queries should work.  1. user1 adds to cart, 2. user2
        // adds to cart, 3. user 1 purchases.  After user 1 purchases, user2 now
        // has more than there is stock, so it should fail the 4th query.
        graphQLQuery(q1, { user: seedData.users[2] })
            .then(res => {
                expect(res.data.addToCart.items[0].quantity).toBe(
                    seedData.products[0].inventory_count
                );
                return graphQLQuery(q1, { user: seedData.users[3] });
            })
            .then(res => {
                expect(res.data.addToCart.items[0].quantity).toBe(
                    seedData.products[0].inventory_count
                );
                return graphQLQuery(q2, { user: seedData.users[2] });
            })
            .then(res => {
                expect(res.data.submitOrder).toBeDefined();
                return graphQLQuery(q2, { user: seedData.users[3] });
            })
            .then(res => {
                expect(res.errors).toBeDefined();
                done();
            })
            .catch(e => {
                done(e);
            });
    });
});
