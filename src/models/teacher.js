const mongoose = require("mongoose");

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
});

userSchema.virtual("classes", {
  ref: "Class",
  localField: "_id",
  foreignField: "teacher",
});

const Teacher = mongoose.model("Teacher", userSchema);

module.exports = Teacher;
