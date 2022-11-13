const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
  },
  tokens: [
    {
      token: {
        type: String,
        reuired: true,
      },
    },
  ],
});

userSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "parents",
});

userSchema.methods.createToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "sweet choclate");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.checkCredentials = async (email, password) => {
  const user = await Parent.findOne({
    email,
  });
  if (!user) {
    throw new Error("unable to login");
  }
  const isUser = await bcryptjs.compare(password, user.password);

  if (!isUser) {
    throw new Error("unable to login");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
});


const Parent = mongoose.model("Parent", userSchema);

module.exports = Parent;
