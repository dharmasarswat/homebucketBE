const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql")

const { User, Room, Item, Category } = require("../models")

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    rooms: { 
      type: RoomType,
      resolve(parent, args){
        return Room.find({userId: parent.id})
      } 
    },
  }),
})

const RoomType = new GraphQLObjectType({
  name: "Room",
  description: "Room type",
  fields: () => ({
    id: { type: GraphQLID },
    roomName: { type: GraphQLString },
    description: { type: GraphQLString },
    items: { 
      type: ItemType,
      resolve(parent, args){
        return Item.find({ roomId: parent.roomId })
      } 
    },
    user: {
      type: UserType,
      resolve(parent, args){
        return User.findById(parent.userId)
      }
    }
  }),
})

const ItemType = new GraphQLObjectType({
  name: "Item",
  description: "Item type",
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    price: { type: GraphQLString },
    quantity: { type: GraphQLString },
    room: { 
      type: RoomType,
      resolve(parent, args){
        return Room.findById(parent.roomId)
      } 
    },
    category: {
      type: CategoryType,
      resolve(parent, args){
        return Category.findById(parent.categoryId)
      }
    }
  }),
})

const CategoryType = new GraphQLObjectType({
  name: "Category",
  description: "Category type",
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    type: { type: GraphQLString },
  }),
})

const AuthPayloadType = new GraphQLObjectType({
  name: "Auth_Payload",
  description: "Auth payload type",
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: UserType },
  }),
})

module.exports = { UserType, RoomType, ItemType, CategoryType, AuthPayloadType }
