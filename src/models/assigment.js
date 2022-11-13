const mongoose = require('mongoose')

const assigmentSchema = new mongoose.Schema({
  link:String,
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
})

const Assigment = mongoose.model('Assigment',assigmentSchema)

module.exports = Assigment
