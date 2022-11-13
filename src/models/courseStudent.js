const mongoose = require('mongoose')

const courseStudentSchema = new mongoose.Schema({
  course:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Course"
  },
  student:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }
})

const CourseStudent = mongoose.model('CourseStudent',courseStudentSchema)

module.exports = CourseStudent
