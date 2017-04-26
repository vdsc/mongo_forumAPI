var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')

//The Roles for MAC
const ROLE_ADMIN = require("../helpers/constants").ROLE_ADMIN,
      ROLE_USER = require("../helpers/constants").ROLE_USER

//The user Schema the model maps to
const userSchema = new Schema({
  userId: Schema.ObjectId,
  username : {
    type : String,
    required : true,
    unique: true
  },
  password : {
    type:String,
    required : true
  },
  role:{
    type: String,
    enum : [ROLE_ADMIN, ROLE_USER],
    default : ROLE_USER
  }
},
{ timestamps : true })
//Possible user property or other schema property are passwords

//A Pre-hook to save the hash of the password rather than the plaintext password
userSchema.pre('save', function(next) {
  const user = this, SALT_FACTOR = 12;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      return next();
    });

  });
});

// Method to compare password for login
userSchema.methods.comparePassword = function(candidatePassword, cb) {  
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
}

module.exports = {
  userModel : mongoose.model('User',userSchema),
  userSchema : userSchema
}
