const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const types = require("./types");
const { queryTypes, queryResolvers } = require("./queries");
const { mutationTypes, mutationResolvers } = require("./mutations");

// Construct a schema, using GraphQL schema language
const typeDefs = gql(types + queryTypes + mutationTypes);

// Provide resolver functions for your schema fields
const resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers
};

exports.schema = makeExecutableSchema({ typeDefs, resolvers });
