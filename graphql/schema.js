// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql")

// Import queries
const { users, user, items, item, rooms, room, category, categories, roomsForUser, itemForRoom } = require("./queries")

// Import mutations
const {
  register,
  login,
  auth,
  addCategory,
  addItem,
  addRoom,
} = require("./mutations")

// Define QueryType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: { users, user, items, item, rooms, room, category, categories, roomsForUser, itemForRoom },
})

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {
    register,
    login,
    auth,
    addCategory,
    addItem,
    addRoom
  },
})

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})
