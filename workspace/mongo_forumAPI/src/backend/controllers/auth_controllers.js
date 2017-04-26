//Imports from local files
const userModel = require("../models/user").userModel
const genToken = require('../helpers/helper_funcs').genToken
const getPriority = require("../helpers/constants").getPriority

//This is the registration controller
const register = function (req, res){
  //If the request did not contain a username or a password field return an error
  if(!req.body.username || !req.body.password){
    res.json({success:false, message: "Please enter a username & password"})
  }
  //Otherwise create the user instance and attempt to save it
  else{
    var newUser;
    newUser = new userModel({
      username: req.body.username,
      password : req.body.password
    })
    newUser.save(function(err, user){
      //If an error was returned [Although, unlikely] report it
      if(err){
        console.log(err.message)
        res.status(405).json({success: false, message : err.message})
      }
      //Otherwise return it succeeded, the message and this userId
      //Note: Here might be where I redirect you to the login page
      else{
        res.status(200).json({success : true, message : "User has been successfully added" })
      }
    })
  }
}

//This is the login controller
const login = function(req, res){
  //Try to find the user with the credentials that were sent to it
  userModel.findOne({
    username: req.body.username
  }, function(err, user){
    if(err){
      console.log(err.message)
      res.status(405).json({success: false, message : err.message})
    }
    if(!user){
      res.status(404).send({success : false, message: "Auth failed, User not found"});
    }
    else{
      user.comparePassword(req.body.password, function(err, isMatch){
        if(!err && isMatch){
            res.status(200).json({success: true, token: genToken(user), role : user.role, id : user._id })
        }else{
            res.status(401).json({success: false, message: 'Authentication failed. Passwords did not match'})
        }
      })
    }
  })
}

//Note: This controller requires authorization
//This controller checks the authorized user's role and ensures it is >= the role requirement
//Generic Mandatory Access Control
const roleAuthorization = function(required_role){
  return function(req, res, next){
    userModel.findById(req.user._id, function(err, user){
      if(err){
        res.status(405).json({success: false, message : "An error was thrown"})
        return next(err);
      }
      if(getPriority(user.role) >= getPriority(required_role)){
        return next();
      }
      else{
        res.status(401).json({success: false, message : "Unauthorized role"})
      }
    })
  }
}

module.exports = {
    register : register,
    login : login,
    roleAuthorization : roleAuthorization
}