const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  discription: {
    type: String,
    trim: true,
  },
  notes:[
    {
      notes:{
        type: String,
      }
    }
  ]
  ,
  teacher:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Teacher'
  },
});

courseSchema.virtual('assigments',{
  ref: 'Assigment',
  localField: '_id',
  foreignField: 'course' 
})

const Course=mongoose.model('Course',courseSchema)

module.exports = Course 
