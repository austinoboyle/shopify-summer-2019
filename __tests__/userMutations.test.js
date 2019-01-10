const seedData = require("../data");
const {
    setup,
    end,
    graphQLQuery,
    mutation,
    uid1
} = require("../config/tests/testUtils.js");
const db = require("../config/mongoose");
db();
// beforeAll(setup);
afterAll(end);

describe("Create User", () => {
    beforeEach(setup);
    it("Rejects Duplicate Usernames", done => {
        const q = mutation(
            `createUser(username: "${seedData.users[0].username}"){id username}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Works", done => {
        const q = mutation(`createUser(username: "mytestuser"){id username}`);
        graphQLQuery(q).then(res => {
            expect(res.data.createUser).toBeDefined();
            done();
        });
    });
});

describe("Delete Me", () => {
    beforeEach(setup);
    it("Rejects when not logged in.", done => {
        const q = mutation(`deleteMe{n ok}`);
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Allows account owner", done => {
        const q = mutation(`deleteMe{n ok}`);
        graphQLQuery(q, { user: seedData.users[0] }).then(res => {
            expect(res.data.deleteMe.n).toBeGreaterThan(0);
            done();
        });
    });
});
