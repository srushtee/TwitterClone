const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../../Models/UserModel')
const bcrypt = require('bcrypt')
const key = require('../../Setup/myUrl')
const passport = require('passport')
const jsonwt = require('jsonwebtoken')
const session = require('express-session')

router.get('/', (req, resp) => {
    resp.json({test: 'Shabash'})
})

router.post('/register', (req, resp) => {

    User.findOne({email: req.body.email})
    .then(data => {
     
        if(data){
            resp.json({'EmailAlreadyRegistered': 'User with this email is already registered'})
        }
        else{
           
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
                displayName: req.body.displayName
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err){
                        throw err
                    }
                    else{
                        newUser.password = hash
                        newUser.save()
                        .then(userData => resp.json(userData))
                        .catch(err => {console.log(err.message)})
                    }
                })
            })

        }
    })
    .catch(err => resp.json({UnableToRegisterException: err.message}))

});


router.post('/login', (req, resp) => {

    const email = req.body.email
    const password = req.body.password

    console.log(req.session);

    User.findOne({email})
    .then(userData => {
        if(!userData){
            resp.status(404).json({UserNotFound: 'User with this email is not registered'})
        } else{
            bcrypt.compare(password, userData.password)
            .then(isMatched => {
                if(isMatched){
                    const payload = {
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        displayName: userData.displayName
                    }
                    req.session.user = payload
                   
                    jsonwt.sign(
                        payload,
                        key.secret,
                        {
                            expiresIn: 3600
                        },
                        (err, token) => {
                            if(err){
                                throw new err;
                            }
                            else{
                                resp.json({
                                    success: true,
                                    token: "Bearer " + token,
                                    
                                })
                            }
                        }
                    )
                }
                else{
                    return resp.status(401).json({CredentialsNotCorrect: 'Either email or password is incorrect'})
                }
                

            })
            .catch(err => {resp.json({Error: err.message})}) 
        }
    })
    .catch(err => console.log(err.message))

});

router.get('/search/:tHandle', passport.authenticate('jwt', {session: false}), (req, resp) => {

    const tHandle = req.params.tHandle

    User.find({displayName: new RegExp(tHandle)})
    .then(data => {
        if(!data){
            resp.json(400).json({NoUserFound: 'No user found with this twitter handle'})
        }
        
        resp.json(data)

    })
    .catch(err => console.log(err))
})

router.post('/follow/:id', passport.authenticate('jwt', {session: false}), (req, resp) => {

    console.log('dsfsaddsa');

    const id = req.params.id
    console.log(`id is ${id}`);

    console.log(req.user);

    if(req.user.id === req.params.id){
        resp.status(400).json({AlreadyFollow: 'You cannot follow yourself'})
    }
    else{
        User.findById({_id: req.params.id})
        .then(user => {
    
            console.log('afasd');
    
            //checking if the user of this id is present
    
            console.log('sadasdsR:'+user);
    
            if(!user){
                resp.status(400).json({UserNotFound: 'User of this id is not found. Search again.'})
            }
            else{
                console.log('inside here');
                if(user.followers.filter(follower => 
                    follower.toString() === req.user.id.toString()).length > 0){
                    return resp.status(400).json({ alreadyfollow : "You already followed the user"})
                }
                
                else{
                    console.log(`printing user: ${user}`);
                    console.log(`printign userisds: ${req.user.id}`);
            
                    user.followers.push(req.user.id)
                    user.save()
                    console.log('pushed here');
        
                    console.log(user);
    
                   
                    console.log(req.user.email);
                   User.findOne({email: req.user.email})
                   .then(user => {
                       console.log(user);
                       user.following.unshift(req.params.id)
                       user.save().then(user => {resp.status(200).json({Followed: 'Followed the user successfully'})})
                       .catch(err => resp.status(400).json({Error: err.message}))
                   })
                   .catch(err => resp.status(400).json({Error: err.message}))
                }
            }
             })
        .catch(err => resp.status(404).json({Error: err.message}))
    }

    

})

router.get('/logout', (req, resp) => {

    if(req.session.user){
        req.session.destroy(err => {
            resp.json({SessionEndedSuccessfull: 'Session is ended'})
        });
    }
    else{
        resp.json({SessionAlreadyEnded: 'Session is not present'})
    }
  
})


module.exports = router