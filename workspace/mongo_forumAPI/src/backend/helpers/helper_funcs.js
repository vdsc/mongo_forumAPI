const jwt = require('jsonwebtoken')
const secret = require('../config/main').secret

//Catches errors and returns a string message but its kinda useless
const catchErrors = function(error_code){
  switch (error_code) {
    case 11000:
      return "Duplicate values"
    default:
      return "Error Unknown"
  }
}

//Generates the token
const genToken = function(user){
  const MINUTES = 10;
  return jwt.sign(user, secret, { expiresIn : MINUTES*60 })
}

module.exports = {
    catchErrors : catchErrors,
    genToken : genToken
}