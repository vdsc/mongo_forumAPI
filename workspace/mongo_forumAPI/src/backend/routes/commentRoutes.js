const express = require("express");
const passport = require("passport")

//Model Function imports
const deleteDoc = require("../modelFunctions/modelFunc").deleteDoc
const updateDoc = require("../modelFunctions/modelFunc").updateDoc
const populateDoc = require("../modelFunctions/modelFunc").populateDoc
const populateOneDoc = require("../modelFunctions/modelFunc").populateOneDoc

//The comment model
const commentModel = require("../models/comment").commentModel

//The MAC roles
const ROLE_ADMIN = require("../helpers/constants").ROLE_ADMIN,
      ROLE_MODERATOR = require("../helpers/constants").ROLE_MODERATOR,
      ROLE_USER = require("../helpers/constants").ROLE_USER
      
//Helper stuff
const catchErrors = require("../helpers/helper_funcs").catchErrors
const roleAuth = require("../controllers/auth_controllers").roleAuthorization
const requireAuth = passport.authenticate('jwt', {session: false})

//Necessary callback generators
const commentFindCallback = require("../controllers/mongoose_controllers").commentFindCallback
const commentDeleteCallback = require("../controllers/mongoose_controllers").commentDeleteCallback
const commentUpdateCallback = require("../controllers/mongoose_controllers").commentUpdateCallback

//Routers Declaration
const commentRoutes = express.Router(), exportRoutes = express.Router()

//populateQuery global const
const populateUserQuery = { path:"user", select:"-_id -__v -password"}

//Get all comments by a given user
// commentRoutes.get("/user/:userId", requireAuth, function(req,res){
//   populateDoc({ user:req.params.userId }, "-__v", populateUserQuery, commentFindCallback(req,res, `Found comments by user ${req.params.userId}`))
// })

// //Get a comment by commentId
// .get("/:commentId", requireAuth, function(req,res){
//   populateOneDoc({_id:req.params.commentId}, "-__v", populateUserQuery, commentModel, commentFindCallback(req,res,null))
// })


// //Delete a comment given a comment Id
// //Example usage: Deleting a comment given the user who made the comment has been authenticated
// .delete("/:commentId", requireAuth, function(req,res){
//   deleteDoc(req.params.commentId, commentModel, commentDeleteCallback(req,res,null))
// })

// //Updates the comment properties given a certain comment Id
// //Example usage: Editing a comment, given that the user who made the comment has been authenticated
// .put("/:commentId", requireAuth, function(req, res){
//   updateDoc(req.params.commentId, {comment:req.body.comment}, "comment -_id", commentModel, commentUpdateCallback(req,res,null))
// })

exportRoutes.use("/comment",commentRoutes)
module.exports = exportRoutes