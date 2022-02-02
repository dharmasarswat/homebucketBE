const { GraphQLList, GraphQLID } = require("graphql")
const { UserType, RoomType, CategoryType, ItemType } = require("./types")
const { User, Item, Category, Room } = require("../models")

const users = {
  type: new GraphQLList(UserType),
  description: "Retrieves list of users",
  resolve(parent, args) {
    return User.find()
  },
}

const user = {
  type: UserType,
  description: "Retrieves one user",
  args: { id: { type: GraphQLID } },

  resolve(parent, args) {
    return User.findById(args.id)
  },
}

const rooms = {
  type: new GraphQLList(RoomType),
  description: "Retrieves list of rooms",
  resolve() {
    return Room.find()
  },
}

const roomsForUser = {
  type: new GraphQLList(RoomType),
  description: "Retrieves list of rooms for user",
  args: { userId: { type: GraphQLID } },
  resolve(_, args) {
    return Room.find({ user: args.userId })
  },
}

const room = {
  type: RoomType,
  description: "Retrieves one room",
  args: { id: { type: GraphQLID } },
  resolve(_, args) {
    return Room.findById(args.id)
  },
}

const categories = {
  type: new GraphQLList(CategoryType),
  description: "Retrieves list of categories",
  resolve() {
    return Category.find()
  },
}

const category = {
  type: CategoryType,
  description: "Retrieves one category",
  args: { id: { type: GraphQLID } },
  resolve() {
    return Category.find(args.id)
  },
}

const item = {
  type: ItemType,
  description: "Retrieves one comment",
  args: { id: { type: GraphQLID } },
  resolve(_, args) {
    return Item.findById(args.id)
  },
}

const items = {
  type: new GraphQLList(ItemType),
  description: "Retrieves list of items",
  resolve() {
    return Item.find()
  },
}

const itemForRoom = {
  type: ItemType,
  description: "Retrieves list of item for rooms",
  args: { roomId: { type: GraphQLID } },
  resolve() {
    return Item.find({ room: args.roomId })
  },
}

module.exports = { users, user, items, item, rooms, room, category, categories, roomsForUser, itemForRoom }
