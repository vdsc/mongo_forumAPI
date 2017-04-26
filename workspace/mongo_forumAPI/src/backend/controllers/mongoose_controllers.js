//Aside
/*
All of the closures in this file essentially do the same thing with different default status messages.
The status messages are a function of objectName and HTTP method invoked
If inclined I couldv'e made a more generic closure that would've even created the default status messages. 
For clarity's sake I just create a whole bunch of them.
*/

//Closure for deleting a user
const userDeleteCallback = function(req, res, customSuccessMessage){
  return function(err, user){
    if(err){
      res.json({success : false, message : err.message})
    }
    else if(!user || user.length == 0){
      res.json({success : false, message : "User(s) not found"})
    }
    else{
      if(!customSuccessMessage)
        res.json({success : true, message : "User(s) successfully deleted", userId : user._id})
      else
        res.json({success : true, message : customSuccessMessage, userId : user._id})
    }
  }
}

//Closure for updating a user
const userUpdateCallback = function(req, res, customSuccessMessage){
  return function(err, user){
    if(err){
      res.json({success : false, message : err.message})
    }
    else if(!user || user.length == 0){
      res.json({success : false, message : "User(s) not found"})
    }
    else{
      if(!customSuccessMessage)
        res.json({success : true, message : "User(s) successfully updated", results : user })
      else
        res.json({success : true, message : customSuccessMessage, results : user })
    }
  }
}

//Closure for finding a user
const userFindCallback = function(req, res, customSuccessMessage){
  return function(err, user){
    if(err){
      res.json({success : false, message : err.message})
      console.log("Error",err.message);
    }
    else if(!user || user.length == 0){
      res.json({success : false, message : "User(s) not found"})
      console.log("User(s) not found")
    }
    else{
      if(!customSuccessMessage){
        res.json({success : true, message : "User(s) successfully found", results : user })
        console.log("Found with no custom message")
      }
      else{
        res.json({success : true, message : customSuccessMessage, results : user })
        console.log("Found with custom message")
      }
        
    }
  }
}

//Closure for finding a forum
const forumFindCallback = function(req, res, customSuccessMessage){
  return function(err, forum){
    if(err){
      res.json({success : false, message : err.message})
      console.log("Error",err.message);
    }
    else if(!forum || forum.length == 0){
      res.json({success : false, message : "Forum(s) not found"})
      console.log("Forum(s) not found")
    }
    else{
      if(!customSuccessMessage){
        res.json({success : true, message : "Forum(s) successfully found", results : forum })
        console.log("Found with no custom message")
      }
      else{
        res.json({success : true, message : customSuccessMessage, results : forum })
        console.log("Found with custom message")
      }
    }
  }
}

//Closure for updating a forum
const forumUpdateCallback = function(req, res, customSuccessMessage){
  return function(err, forum){
    if(err){
      res.json({success : false, message : err.message})
    }
    else if(!forum || forum.length == 0){
      res.json({success : false, message : "Forum(s) not found"})
    }
    else{
      if(!customSuccessMessage)
        res.json({success : true, message : "Forum(s) successfully updated", results : forum })
      else
        res.json({success : true, message : customSuccessMessage, results : forum })
    }
  }
}

//Closure for deleting a forum
const forumDeleteCallback = function(req, res, customSuccessMessage){
  return function(err, forum){
    if(err){
      res.json({success : false, message : err.message})
    }
    else if(!forum || forum.length == 0){
      res.json({success : false, message : "Forum(s) not found"})
    }
    else{
      if(!customSuccessMessage)
        res.json({success : true, message : "Forum(s) successfully deleted", userId : forum._id})
      else
        res.json({success : true, message : customSuccessMessage, userId : forum._id})
    }
  }
}

//Closure for creating a forum
const forumCreateCallback = function(req, res, customSuccessMessage){
  return function(err, forum){
    if(err){
      res.json({success : false, message : err.message})
    }
    else if(!forum || forum.length == 0){
      res.json({success : false, message : "Forum(s) failed to create"})
    }
    else{
      if(!customSuccessMessage)
        res.json({success : true, message : "Forum(s) successfully created", results : forum })
      else{
        const retVal = {_id:forum._id,topic:forum.topic}
        res.json({success : true, message : customSuccessMessage, results :  retVal})
      }
    }
  }
}

//Closure for finding a comment
const commentFindCallback = function(req, res, customSuccessMessage){
  return function(err, comment){
    if(err){
      res.json({success : false, message : err.message})
      console.log("Error",err.message);
    }
    else if(!comment || comment.length == 0){
      res.json({success : false, message : "Comment(s) not found"})
      console.log("Comment(s) not found")
    }
    else{
      if(!customSuccessMessage){
        res.json({success : true, message : "Comment(s) successfully found", results : comment })
        console.log("Found with no custom message")
      }
      else{
        res.json({success : true, message : customSuccessMessage, results : comment })
        console.log("Found with custom message")
      }
    }
  }
}

//Closure for Deleting a comment
const commentDeleteCallback = function(req, res, customSuccessMessage){
  return function(err, comment){
    if(err){
      res.json({success : false, message : err.message})
    }
    else if(!comment || comment.length == 0){
      res.json({success : false, message : "Comment(s) not found"})
    }
    else{
      if(!customSuccessMessage)
        res.json({success : true, message : "Comment(s) successfully deleted", userId : comment._id})
      else
        res.json({success : true, message : customSuccessMessage, userId : comment._id})
    }
  }
}

//Closure for Updating a comment
const commentUpdateCallback = function(req, res, customSuccessMessage){
  return function(err, comment){
    if(err){
      res.json({success : false, message : err.message})
    }
    else if(!comment || comment.length == 0){
      res.json({success : false, message : "Forum(s) not found"})
    }
    else{
      if(!customSuccessMessage)
        res.json({success : true, message : "Forum(s) successfully updated", results : comment })
      else
        res.json({success : true, message : customSuccessMessage, results : comment })
    }
  }
}


module.exports = {
    userDeleteCallback : userDeleteCallback,
    userFindCallback : userFindCallback,
    userUpdateCallback : userUpdateCallback,
    forumFindCallback : forumFindCallback,
    forumUpdateCallback : forumUpdateCallback,
    forumDeleteCallback : forumDeleteCallback,
    forumCreateCallback : forumCreateCallback,
    commentFindCallback : commentFindCallback,
    commentDeleteCallback : commentDeleteCallback,
    commentUpdateCallback : commentUpdateCallback
}