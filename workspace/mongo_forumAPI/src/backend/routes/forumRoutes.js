const express = require("express");
const passport = require("passport")

const deleteDoc = require("../modelFunctions/modelFunc").deleteDoc
const findDocs = require("../modelFunctions/modelFunc").findDocs
const findOneDoc = require("../modelFunctions/modelFunc").findOneDoc
const updateDoc = require("../modelFunctions/modelFunc").updateDoc
const updatePushDoc = require("../modelFunctions/modelFunc").updatePushDoc
const populateDoc = require("../modelFunctions/modelFunc").populateDoc
const populateOneDoc = require("../modelFunctions/modelFunc").populateOneDoc
const createDoc = require("../modelFunctions/modelFunc").createDoc

const forumModel = require("../models/forums").forumModel, commentModel = require("../models/comment").commentModel

const ROLE_ADMIN = require("../helpers/constants").ROLE_ADMIN,
      ROLE_USER = require("../helpers/constants").ROLE_USER
      
const catchErrors = require("../helpers/helper_funcs").catchErrors
const roleAuth = require("../controllers/auth_controllers").roleAuthorization

const forumFindCallback = require("../controllers/mongoose_controllers").forumFindCallback
const forumDeleteCallback = require("../controllers/mongoose_controllers").forumUpdateCallback
const forumUpdateCallback = require("../controllers/mongoose_controllers").forumUpdateCallback
const forumCreateCallback = require("../controllers/mongoose_controllers").forumCreateCallback

const requireAuth = passport.authenticate('jwt', {session: false})
const populateQuery = [
    { path: 'comments', select: "-__v", populate: { path: 'user', select: "-_id -__v -password -updatedAt" } },
    { path : 'createdBy', select: "-_id -__v -password -updatedAt" }
  ]

const forumRoutes = express.Router(), exportRoutes = express.Router()

forumRoutes.use(passport.initialize())
require("../config/passport")(passport)

forumRoutes.get("", requireAuth, function(req,res){
  //Populate the comments' user reference
  populateDoc({},"-__v", populateQuery, forumModel, forumFindCallback(req,res,null))
})

//Gets a list of forum Topics and their IDs
.get("/topics",  requireAuth, function(req,res){
  //Populate the comments' user reference
  findDocs({},"topic", forumModel, forumFindCallback(req,res,null))
})

//Get a specific forum
.get("/:forumId",  requireAuth, function(req,res){                                             //Populate the comments' user reference
  populateOneDoc({_id:req.params.forumId},"-__v", populateQuery, forumModel, forumFindCallback(req,res,null))
})

//Get all of the comments in a specific forum
//Returns all of the comments as JSON
.get("/:forumId/comments", requireAuth, function(req,res){
  populateOneDoc({ _id:req.params.forumId }, {comments : 1, _id : 0}, { path: 'comments', select: {comment : 1, user : 1, _id : 0}, populate: { path: 'user', select: {username : 1, createdAt : 1, role: 1, _id : 0} } }, forumModel, forumFindCallback(req,res,null))
})

//Post a new forum topic given the user has been authenticated
//Example usage: Creating a new forum given the user is authenticated
.post("",  requireAuth, function(req,res){
  createDoc(req.body, forumModel, forumCreateCallback(req,res,null))
})

//Add new comment to a forum given a forum Id
//Example usage: Adding a comment on the forum as a particular user given the user is authenticated
.post("/:forumId/newComment",  requireAuth, function(req,res){
  var newComment = new commentModel(req.body)//Create a new instance of the comment object using the model
  newComment.save(function(err,newComment){//Save this instance
    "use strict";
    if(err){//If an error was thrown, respond with the error message
      res.json({success:false, message: err.message})
    }else {
      //Otherwise push this new comment's id to the comment array of this forum
      let updateCallback = function(err, comments){
        if(err){
          res.json({success:false, message: err.message})
        }
        else if(comments.length == 0){
          res.json({success:false, message: "The comments array is somehow empty"})
        }
        else{
          populateDoc({_id:newComment._id},"comment createdAt user",{ path: 'user', select: "-_id -__v -password -updatedAt" },commentModel,function(err, commentArr){
            if(err){
              res.json({success:false, message: err.message})
            }
            else{
              let popComment = commentArr[0]
              res.json({success:true, message: "The comments array has been appended", results: popComment })
            }
          })
          
        }
      }
      updatePushDoc(req.params.forumId, {"comments":newComment._id}, "comments", forumModel, updateCallback)
    }
  })
})

//Delete a forum given a forum Id
//Example usage: Deleting the forum given the user who created or is moderating the forum has been authenticated
.delete("/:forumId",  requireAuth, function(req,res, next){
  findOneDoc({_id:req.params.forumId, createdBy : req.user._id},"createdBy", forumModel, function(err,forum){
    if(err){
      res.status(500).json({success : false, message : err.message})
    }
    else if(!forum){
      next();
    }
    else{
      deleteDoc(req.params.forumId, forumModel, forumDeleteCallback(req,res,null))
    }
  })
}, roleAuth(ROLE_ADMIN), function(req,res){
  deleteDoc(req.params.forumId, forumModel, forumDeleteCallback(req,res,null))
})


.delete("/:forumId/comment/:commentId", requireAuth, function(req, res, next){
  findOneDoc({_id:req.params.forumId},"comments",forumModel, function(err, comments){
    'use strict'
    if(err){
      res.status(401).json({success:false,message:"Error thrown"})
    }
    else if(!comments){
      res.status(401).json({success:false,message:"Object not found"})
    }
    else{
      if(comments.comments.indexOf(req.params.commentId) < 0){
        res.status(500).json({success:false,message:"Given comment Id not within this forum"})
      }
      else{
        let foundComment = function(err,obj){
          if(err){
            res.status(401).json({success:false,message:"Error thrown"})
          }
          else if(!obj){
            next()
          }
          else{
            deleteDoc(req.params.commentId,commentModel,function(err,comment){
              if(err){
                res.status(401).json({success:false,message:"Error thrown"})
              }
              else if(!comment){
                res.status(401).json({success:false,message:"Object not found"})
              }
              else{
                res.status(200).json({success:true, message:"Comment Deleted from forum"})
              }
            })
          }
        };
        findOneDoc({_id: req.params.commentId, user : req.user._id}, "", commentModel, foundComment)
      }
    }
  })}, roleAuth(ROLE_ADMIN), function(req, res){
  deleteDoc(req.params.commentId,commentModel,function(err,comment){
    if(err){
      res.status(401).json({success:false,message:"Error thrown"})
    }
    else if(!comment){
      res.status(401).json({success:false,message:"Object not found"})
    }
    else{
      res.status(200).json({success:true, message:"Comment Deleted from forum"})
    }
  })
})

//Updates the forum properties given a forum Id
//Example usage: Editing the forum topic given the user who created or is moderating the forum has been authenticated
.put("/:forumId",  requireAuth, function(req, res, next){
  forumModel.findOneDoc({_id:req.params.forumId, createdBy : req.user._id}, "createdBy -_id").exec(function(err, forum){
    if(err){
      res.status(401).json({success:false,message:"Error thrown"})
    }
    else if(!forum){
      next()
    }
    else{
      updateDoc( req.params.forumId, {topic:req.body.topic}, "-_id topic", forumModel, forumUpdateCallback(req,res,null))
    }
    })
}, roleAuth(ROLE_ADMIN), function(req, res){
  updateDoc( req.params.forumId, {topic:req.body.topic}, "-_id topic", forumModel, forumUpdateCallback(req,res,null))
})

exportRoutes.use("/forum", forumRoutes)

module.exports = exportRoutes