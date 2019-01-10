// const { setup } = require("./testUtils");
// const db = require("../mongoose");
// db();
const TIMEOUT = process.env.CI ? 10000 : 3000;
jest.setTimeout(TIMEOUT);
