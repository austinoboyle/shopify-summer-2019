const mongoose = require("mongoose");
const resetDb = require("../../utils/resetDb");
const { schema } = require("../apollo");
const { graphql } = require("graphql");

exports.setup = done => {
    resetDb().then(() => done());
};

exports.end = done => {
    resetDb()
        .then(() => mongoose.disconnect())
        .then(() => done());
};

exports.graphQLQuery = (query, context = { user: null }) => {
    return graphql(schema, query, null, context);
};

exports.mutation = q => `mutation{${q}}`;
exports.query = q => `query{${q}}`;

exports.uid1 = "111111111111111111111111";
exports.uid2 = "111111111111111111111112";
