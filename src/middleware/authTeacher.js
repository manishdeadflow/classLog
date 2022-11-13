const jwt = require('jsonwebtoken')
const Teacher = require('../models/teacher.js')

const authTeacher = async (req,res,next) => {
  try{
    const token = req.header('Authorization').replace('Bearer ','')
    const decoded = jwt.verify(token,'sweet choclate')
    const user = await Teacher.findOne({_id: decoded._id,'tokens.token': token})

    if(!user)  throw new Error('please authenticate')
    req.token = token
    req.user = user
    next()
  }catch(e){
    res.status(401).send({error :'please authenticate !'})
  }
}

module.exports = authTeacher
