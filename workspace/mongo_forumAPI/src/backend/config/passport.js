//Module imports
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt

//Imports in local files
const config = require("../config/main")
const User = require("../models/user").userModel

//Passport wrapper or mixin or whatever the cool kids are sayin for the Jwt Strategy
module.exports = function(passport){
    var opts = {}
    //Get the jwt from the Authorization header
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret
    //Just something I found, I can't really explain it well
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        //Basically jwts are encrypted versions of the data you give it.
        //In this case, we just encrypt the entire user object
        //We extract it using this callback function
        const thisUserId = jwt_payload._doc._id
        //Using this user Id we check the database to make sure they already exist
        User.findById(thisUserId, function(err, user){
            //If an error was returned throw it to the done function and false to indicate something went wrong
            if(err){
                return done(err, false)
            }
            //If the user exists return no error to the error arg and this user object to the done function
            if(user){
                done(null, user)
            }
            //Otherwise there is no error but the user doesn't exist
            //Return null to indicate no error was thrown and return false to indicate no user was found 
            else{
                done(null, false)
            }
        })
    }))
}