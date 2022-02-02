const { RoomType, ItemType, CategoryType, UserType, AuthPayloadType } = require("./types")

const { User, Room, Item, Category } = require("../models")
const { GraphQLString, GraphQLObjectType } = require("graphql")

const { createJwtToken } = require("../util/auth")


const register = {
  type: AuthPayloadType,
  description: "Register new user",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { username, email, password } = args

    const existingUser = await User.findOne({ email })

    if(!!existingUser)  throw new Error("User exists with these credentials.")
    const user = new User({ username, email, password })

    await user.save()
    const token = createJwtToken(user)
    return {token, user}
  },
}

const login = {
  type: AuthPayloadType,
  description: "Login user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const user = await User.findOne({ email: args.email })
    
    if(!user) throw new Error("User not found.")

    if (user && !user.isCorrectPassword(args.password)) {
      throw new Error("Invalid credentials")
    }

    const token = createJwtToken(user)
    return {token, user}
  },
}

const auth = {
  type: AuthPayloadType,
  description: "Authenticate user",
  async resolve(parent, args, context) {
    const user = context.verifiedUser
    user.id = user._id
    
    if(!user) throw new Error("Unauthorized.")

    const token = createJwtToken(user)
    return {token, user}
  },
}

const addRoom = {
  type: RoomType,
  description: "Create new Room",
  args: {
    roomName: { type: GraphQLString },
    description: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    console.log("Verified User: ", verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthorized")
    }

    const room = new Room({
      user: verifiedUser._id,
      roomName: args.roomName,
      description: args.description,
    })

    return room.save()
  },
}

const addItem = {
  type: ItemType,
  description: "Create new Item",
  args: {
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    price: { type: GraphQLString },
    quantity: { type: GraphQLString },
    category: { type: GraphQLString },
    room:  { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    console.log("Verified User: ", verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthorized")
    }

    const item = new Item({
      description: args.description,
      image: args.image,
      price: args.price,
      quantity: args.quantity,
      category: args.category,
      room: args.room,
    })

    const room = await Room.findById(args.room)
    room.items.push(item)

    return {item: await item.save(), room: await room.save()}
  },
}

const addCategory = {
  type: CategoryType,
  description: "Create new Category",
  args: {
    type: { type: GraphQLString },
    description: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    console.log("Verified User: ", verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthorized")
    }

    const category = new Category({
      tyoe: args.type,
      description: args.description,
    })

    return category.save()
  },
}

module.exports = {
  register,
  login,
  auth,
  addCategory,
  addItem,
  addRoom
}
