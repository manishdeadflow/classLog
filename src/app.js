const express = require("express");
require("./db/mongoose.js");
const cors = require("cors");
const Teacher = require("./models/teacher.js");
const Student = require("./models/student.js");
const Parent = require("./models/parent.js");
const Course = require("./models/course.js");
const CourseStudent = require("./models/courseStudent.js");
const Assigment = require("./models/assigment");
const SolvedAssigment = require("./models/solvedAssigment");
const authTeacher = require("./middleware/authTeacher");
const authStudent = require("./middleware/authStudent");
const authParent = require("./middleware/authParent");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/createUser", async (req, res) => {
  const userOb = { ...req.body };
  const role = req.body.role;
  delete userOb.role;
  try {
    if (role === "teacher") {
      const user = new Teacher(userOb);
      await user.save();
      const token = await user.createToken();
      res.status(201).send({ user, token, role });
    } else if (role === "student") {
      const user = new Student(userOb);
      await user.save();
      const token = await user.createToken();
      res.status(201).send({ user, token, role });
    } else {
      const user = new Parent(userOb);
      await user.save();
      const token = await user.createToken();
      res.status(201).send({ user, token, role });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/teacher/createCourse", authTeacher, async (req, res) => {
  const course = new Course({ ...req.body, teacher: req.user._id });
  try {
    await course.save();
    res.status(201).send(course);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/student/joinClass", authStudent, async (req, res) => {
  const join = new CourseStudent({
    student: req.user._id,
    course: req.body.id,
  });
  try {
    await join.save();
    res.status(201).send(join);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.patch("/parent/addStudent", authParent, async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.body.email });
    if (!student) throw new Error("cant find the student with the given id!");
    student.parents = req.user._id;
    await student.save();
    res.status(200).send(student);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/teacher/courses", authTeacher, async (req, res) => {
  try {
    await req.user.populate({ path: "courses" });
    res.status(200).send(req.user.courses);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/student/courses", authStudent, async (req, res) => {
  try {
    const courses = await CourseStudent.find({
      student: req.user._id,
    }).populate("course");
    res.status(200).send(courses);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/parent/students", authParent, async (req, res) => {
  try {
    await req.user.populate({ path: "students" });
    res.status(200).send(req.user.students);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/parent/student/:id",authParent,async (req,res) => {
  try{
     const courses = await CourseStudent.find({
      student: req.params['id'],
    }).populate("course");
    res.status(200).send(courses);
  }catch(e){
    res.status(400).send(e)
  }
})

app.post("/userLogin", async (req, res) => {
  const role = req.body.role;
  try {
    if (role === "teacher") {
      const user = await Teacher.checkCredentials(
        req.body.email,
        req.body.password
      );
      const token = await user.createToken();
      res.status(200).send({ user, token, role });
    } else if (role === "student") {
      const user = await Student.checkCredentials(
        req.body.email,
        req.body.password
      );
      const token = await user.createToken();
      res.status(200).send({ user, token, role });
    } else {
      const user = await Parent.checkCredentials(
        req.body.email,
        req.body.password
      );
      const token = await user.createToken();
      res.status(200).send({ user, token, role });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.patch("/teacher/course/addNotes", authTeacher, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.body.courseId });
    course.notes = course.notes.concat({notes:{name:req.body.note,link:req.body.link}});
    await course.save();
    res.status(201).send(course);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/teacher/course/addAssigment", authTeacher, async (req, res) => {
  try {
    const assigment = new Assigment({
      name: req.body.name,
      link: req.body.link,
      course: req.body.courseId,
    });
    await assigment.save();
    res.status(200).send(assigment);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post(
  "/student/course/addSolvedAssigment",
  authStudent,
  async (req, res) => {
    try {
      const assigment = new SolvedAssigment({
        link: req.body.link,
        course: req.body.courseId,
        student: req.user._id,
      });
      await assigment.save();
      res.status(200).send(assigment);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

app.get("/courseData/:id", async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params['id'] }).populate({path:'assigments'});
    const students = await CourseStudent.find({
      course: req.params['id'],
    }).populate("student");
    // course.populate('assigments')
    res.status(200).send({course,assigments:course.assigments,students})
  } catch (e) {
    res.status(400).send(e)
  }
});

app.post("/teacher/logout", authTeacher, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

app.post("/student/logout", authStudent, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

app.post("/parent/logout", authParent, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

app.listen(PORT, () => {
  console.log("server started...");
});
