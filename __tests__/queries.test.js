const seedData = require("../data");
const { setup, end, graphQLQuery } = require("../config/tests/testUtils.js");
const db = require("../config/mongoose");
db();

beforeAll(setup);
afterAll(end);

describe("User Queries", () => {
    it("Returns all users with no params passed", done => {
        const query = `query {
            users{
                username
                id
            }
        }`;
        graphQLQuery(query, { user: null }).then(res => {
            expect(res.data.users.length).toBe(seedData.users.length);
            done();
        });
    });
    it("Can be queried by username & ID", done => {
        const q1 = `query{users(id: "${seedData.users[0]._id.toHexString()}"){id}}`;
        const q2 = `query{users(username: "${
            seedData.users[0].username
        }"){id}}`;
        Promise.all([graphQLQuery(q1), graphQLQuery(q2)]).then(
            ([res1, res2]) => {
                expect(res1.data.users.length).toBe(1);
                expect(res2.data.users.length).toBe(1);
                done();
            }
        );
    });
});

describe("Cart Queries", () => {
    it("Rejects when user not logged in", done => {
        const query = `query {cart{id}}`;
        graphQLQuery(query).then(res => {
            expect(res.errors.length).toBe(1);
            done();
        });
    });
    it("Returns all orders by user", done => {
        const query = `query {cart{id}}`;
        graphQLQuery(query, { user: seedData.users[0] }).then(res => {
            expect(res.data.cart.id).toBe(
                seedData.carts
                    .filter(
                        c =>
                            c.user.toHexString() ===
                            seedData.users[0]._id.toHexString()
                    )[0]
                    ._id.toHexString()
            );
            done();
        });
    });
});

describe("Order Queries", () => {
    it("Rejects when user not logged in", done => {
        const query = `query {orders{id}}`;
        graphQLQuery(query).then(res => {
            expect(res.errors.length).toBe(1);
            done();
        });
    });
    it("Returns all orders by user", done => {
        const query = `query {orders{id}}`;
        graphQLQuery(query, { user: seedData.users[0] }).then(res => {
            expect(res.data.orders.length).toBe(
                seedData.orders.filter(
                    o =>
                        o.user.toHexString() ===
                        seedData.users[0]._id.toHexString()
                ).length
            );
            done();
        });
    });
    describe("Can Be Queried By...", () => {
        it("id", done => {
            const q = `query{orders(id: "${seedData.orders[0]._id.toHexString()}"){id}}`;
            graphQLQuery(q, { user: seedData.users[0] }).then(res => {
                expect(res.data.orders.length).toBe(1);
                done();
            });
        });
    });
});

describe("Product Queries", () => {
    it("Returns all products", done => {
        const query = `query {
            products{
                id
            }
        }`;
        graphQLQuery(query).then(res => {
            expect(res.data.products.length).toBe(seedData.products.length);
            done();
        });
    });
    describe("Can Be Queried By...", () => {
        it("id", done => {
            const q = `query{products(id: "${seedData.products[0]._id.toHexString()}"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.products.length).toBe(1);
                done();
            });
        });
        it("title", done => {
            const q = `query{products(title: "${
                seedData.products[0].title
            }"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.products.length).toBe(1);
                done();
            });
        });
        it("Availability", done => {
            const q1 = `query{products(available: true){id}}`;
            const q2 = `query{products(available: false){id}}`;
            Promise.all([graphQLQuery(q1), graphQLQuery(q2)]).then(
                ([available, unavailable]) => {
                    expect(available.data.products.length).toBe(
                        seedData.products.filter(p => p.inventory_count > 0)
                            .length
                    );
                    expect(unavailable.data.products.length).toBe(
                        seedData.products.filter(p => p.inventory_count === 0)
                            .length
                    );
                    done();
                }
            );
        });
    });
});
