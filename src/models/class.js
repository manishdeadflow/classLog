const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  discription: {
    type: String,
    trim: true,
  },
  teacher:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Teacher'
  }  
});

const Class=mongoose.model('Class',userSchema)

module.exports = Class 
