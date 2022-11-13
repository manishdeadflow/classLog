const mongoose = require('mongoose')

const solved = new mongoose.Schema({
  link:String,
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Assigment'
  },
  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }
})

const SolvedAssigment = mongoose.model('SolvedAssigment',solved)

module.exports = SolvedAssigment
