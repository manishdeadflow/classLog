const express = require("express");
require("./db/mongoose.js");
const Teacher = require("./models/teacher.js");
const Student = require("./models/student.js");
const Parent = require("./models/parent.js");
const Class = require("./models/class.js");
const {findOne} = require("./models/teacher.js");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/", async (req, res) => {
  const role = req.body.role;
  const userOb = { ...req.body };
  delete userOb.role;
  let user;
  if (role === "teacher") {
    user = new Teacher(userOb);
  } else if (role === "student") {
    user = new Student(userOb);
  } else {
    user = new Parent(userOb);
  }

  try {
    await user.save();
    res.status(201).send({
      user,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});


app.listen(PORT, () => {
  console.log("server started...");
});
