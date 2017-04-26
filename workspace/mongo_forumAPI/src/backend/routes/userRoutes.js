const express = require("express");
const passport = require("passport")

const deleteDoc = require("../modelFunctions/modelFunc").deleteDoc
const updateDoc = require("../modelFunctions/modelFunc").updateDoc
const findDocs = require("../modelFunctions/modelFunc").findDocs
const findOneDoc = require("../modelFunctions/modelFunc").findOneDoc

const userModel = require("../models/user").userModel

const ROLE_ADMIN = require("../helpers/constants").ROLE_ADMIN,
      ROLE_MODERATOR = require("../helpers/constants").ROLE_MODERATOR,
      ROLE_USER = require("../helpers/constants").ROLE_USER
      
const catchErrors = require("../helpers/helper_funcs").catchErrors
const registerController = require("../controllers/auth_controllers").register
const loginController = require("../controllers/auth_controllers").login
const roleAuth = require("../controllers/auth_controllers").roleAuthorization

const userFindCallback = require("../controllers/mongoose_controllers").userFindCallback
const userDeleteCallback = require("../controllers/mongoose_controllers").userUpdateCallback
const userUpdateCallback = require("../controllers/mongoose_controllers").userUpdateCallback

var userRoutes = express.Router();
var exportRoutes = express.Router();
const requireAuth = passport.authenticate('jwt', {session: false})


userRoutes.use(passport.initialize())
require("../config/passport")(passport)

//User registration
userRoutes.post("/register", registerController)

//User login: returns a web token on success
userRoutes.post("/login", loginController)

//Test authentication
userRoutes.get("/dashboard", requireAuth, function(req, res){
  res.send(`It worked yo! The userId is ${req.user._id}`)
})

//Get all users in the database, open to the public
userRoutes.get("/public", function(req,res){
  findDocs({}, "-password -__v -_id", userModel, userFindCallback(req, res, "Returning users"))
})

//APP_USE only: requires that the user is Authenticated
userRoutes.get("/authenticated", requireAuth, function(req,res){
  findDocs({}, "-__v -password", userModel, userFindCallback(req, res, "Returning all users"))
})

//Get a user by userId
.get("/:userId", requireAuth, function(req, res){
  findOneDoc({_id:req.params.userId}, "-__v -_id -password", userModel, userFindCallback(req, res, "Found user"))
})


//Delete a user given a userId, given authentication && (the user is itself || the user is an ADMIN)
//Example usage: Deleting a user given the user has been authenticated
/*.delete("/:userId", requireAuth, function(req, res, next){
  const userWhoSentAuth = req.user
  //If the user who sent the authorization header == the userId to be deleted, then delete it
  if(userWhoSentAuth._id == req.params.userId){
    deleteDoc(req.params.userId, userModel, function(results){
      results.error_code ? res.json({error : catchErrors(results.error_code)}) : res.json(results)
    })
  }
  else{
    //Otherwise authorize the role
    next();
  }
}, roleAuth(ROLE_ADMIN), function(req, res){
    //If the authorized role is ADMIN, then delete
    deleteDoc(req.params.userId, userModel, function(results){
      results.error_code ? res.json({error : catchErrors(results.error_code)}) : res.json(results)
    })
})*/

// .delete("/:userId", requireAuth, function(req, res){
//   if(req.user._id == req.params.userId || req.user.role == ROLE_ADMIN)
//     deleteDoc(req.params.userId, userModel, userDeleteCallback(req, res, null))
// })

//Updates a certain user properties given a certain user Id
//Example usage: Editing a user profile given that the user has been authenticated
// .put("/:userId",  requireAuth, function(req, res, next){
//   if(req.user._id == req.params.userId)
//     updateDoc(req.params.userId, { role : ROLE_ADMIN }, {  _id : 0, password : 0, __v : 0 }, userModel, userUpdateCallback(req, res, null))
//   else
//     next()
// }, roleAuth(ROLE_ADMIN), function(req,res){
//   updateDoc(req.params.userId, { role : ROLE_ADMIN }, {  _id : 0, password : 0, __v : 0 }, userModel, userUpdateCallback(req, res, null))
// })

.put("/:userId/setToAdmin", requireAuth, roleAuth(ROLE_ADMIN), function(req, res){
    updateDoc(req.params.userId, { role : ROLE_ADMIN }, { username : 1, _id : 0 }, userModel, userUpdateCallback(req, res, "User successfully promoted to Admin"))
})

.put("/:userId/setToUser", requireAuth, roleAuth(ROLE_ADMIN), function(req, res){
  updateDoc(req.params.userId, { role : ROLE_USER }, { role : 1, _id : 0 }, userModel, userUpdateCallback(req, res, "User successfully promoted to Moderator"))
})


exportRoutes.use("/user",userRoutes)
module.exports = exportRoutes