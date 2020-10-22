const jsonwebtoken = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
require('../Models/UserModel')
const mongoose = require('mongoose')
const User = mongoose.model("user")
const secret = require('../setup/myUrl').secret

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret



module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_paylod, done) => {
        User.findById(jwt_paylod.id)
        .then(user => {
            if(user){
                return done(null, user);
            }
            return done(null, false)
        })
        .catch(err => {console.log(err);})
    }))
}

