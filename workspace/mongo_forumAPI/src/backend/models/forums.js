var mongoose = require('mongoose')
var Schema = mongoose.Schema

//The forum Schema that the model maps to
var forumSchema = new Schema({
  topic : {
    type : String,
    require : true
  },
  topicId : Schema.ObjectId,
  comments : [{type: Schema.ObjectId,
  ref : 'Comment'}],
  createdBy:{
    type: Schema.ObjectId,
    ref:'User',
    require:true
  }
},
{
  timestamps : true
})

module.exports = {
  forumModel : mongoose.model('Forum',forumSchema),
  forumSchema : forumSchema
}
