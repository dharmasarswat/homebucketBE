const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    rooms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    }],
  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});


// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password = "") {
  return bcrypt.compare(password, this.password);
};


module.exports = mongoose.model("user", userSchema)
