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

courseStudentSchema.index({course:1,student:1},{unique:true})

const CourseStudent = mongoose.model('CourseStudent',courseStudentSchema)

module.exports = CourseStudent
