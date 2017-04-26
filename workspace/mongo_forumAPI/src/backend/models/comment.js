var mongoose = require('mongoose')
var Schema = mongoose.Schema

//The comment Schema of how the model is mapped
var commentSchema = new Schema({
  commentId: Schema.ObjectId,
  comment: String,
  user :{
      type: Schema.ObjectId,
      ref : 'User'
  }
},
{
  timestamps : true
})


module.exports = {
  commentModel : mongoose.model('Comment',commentSchema),
  commentSchema : commentSchema
}
