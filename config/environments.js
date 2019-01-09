require("dotenv-flow").config();

const MONGO_CONNECTION_STRING =
    process.env.MONGO_URL === undefined
        ? "mongodb://127.0.0.1/graphql"
        : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${
              process.env.MONGO_URL
          }`;

const baseConfig = {
    app: { name: "graphql-api" },
    db: MONGO_CONNECTION_STRING
};
module.exports = {
    //MongoDB configuration
    development: baseConfig,
    test: Object.assign({}, baseConfig, {
        db: process.env.CI
            ? MONGO_CONNECTION_STRING
            : "mongodb://127.0.0.1/graphql-test"
    }),
    production: baseConfig
};
