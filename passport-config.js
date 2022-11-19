const localStrategy = require("passport-local").Strategy
const DB = process.env.DATABASE;
const bcrypt = require("bcrypt")
const mongoose = require('mongoose');
const User = require('./model/userSchema')



function initialize(passport, getUserByEmail,getUserById){
    //Function to authenticate users
    const authenticateUsers = async (email,password, done) =>{
        // Get users by email
        const user = getUserByEmail(email)
        if(user==null){
            return done(null, false, {message: "No user found with that email"})
        }
        try {
            if(await bcrypt.compare(password,user.password)){
                return done(null, user)
            } else{
                return done(null,false,{message: "Password Incorrect"})
            }
        } catch (e) {
            console.log(e);
            return done(e)
        }
    }

    passport.use(new localStrategy({usernameField: 'email'}, authenticateUsers))
    passport.serializeUser((user,done) =>done(null, user.id))
    passport.deserializeUser((id,done)=> {
        return done(null, getUserById(id))
    })
}

module.exports =initialize