const seedData = require("../data");
const {
    setup,
    end,
    graphQLQuery,
    mutation
} = require("../config/tests/testUtils.js");

const db = require("../config/mongoose");
db();

// beforeAll(setup);
afterAll(end);

describe("Create Product", () => {
    beforeEach(setup);

    it("Rejects if not logged in", done => {
        const q = mutation(
            `createProduct(title: "New Product", price: 100){id title price}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Sets owner correctly", done => {
        const q = mutation(
            `createProduct(title: "New Product", price: 100){id title price owner{id}}`
        );
        graphQLQuery(q, { user: seedData.users[0] }).then(res => {
            const newProduct = res.data.createProduct;
            expect(newProduct.owner.id).toBe(
                seedData.users[0]._id.toHexString()
            );
            done();
        });
    });
});

describe("Update Product", () => {
    beforeEach(setup);

    it("Rejects if not logged in", done => {
        const q = mutation(
            `updateProduct(id: "${seedData.products[0]._id.toHexString()}"){id name inventory_count price}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Rejects if logged into different account", done => {
        const q = mutation(
            `updateProduct(id: "${seedData.products[0]._id.toHexString()}"){id name inventory_count price}`
        );
        graphQLQuery(q, { user: seedData.users[1] }).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Works for product owner", done => {
        const newProduct = {
            title: "New Title",
            price: 1234,
            inventory_count: 111
        };
        const q = mutation(
            `updateProduct(id: "${seedData.products[0]._id.toHexString()}", price: ${
                newProduct.price
            }, inventory_count: ${newProduct.inventory_count}, title: "${
                newProduct.title
            }"){title inventory_count price}`
        );
        graphQLQuery(q, { user: seedData.users[0] }).then(res => {
            const updated = res.data.updateProduct;
            expect(res.errors).toBeUndefined();
            expect(updated).toEqual(newProduct);
            done();
        });
    });
});

describe("Delete Product", () => {
    beforeEach(setup);

    it("Rejects if not logged in", done => {
        const q = mutation(
            `deleteProduct(id: "${seedData.products[0]._id.toHexString()}"){n ok}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Rejects if not product owner", done => {
        const q = mutation(
            `deleteProduct(id: "${seedData.products[0]._id.toHexString()}"){n ok}`
        );
        graphQLQuery(q, { user: seedData.users[1] }).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Works for product owner", done => {
        const q = mutation(
            `deleteProduct(id: "${seedData.products[0]._id.toHexString()}"){n ok}`
        );
        graphQLQuery(q, { user: seedData.users[0] }).then(res => {
            expect(res.errors).toBeUndefined();
            expect(res.data.deleteProduct.n).toBeGreaterThan(0);
            done();
        });
    });
});
