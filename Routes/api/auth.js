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
        console.log(data);
        if(data){
            resp.json({'EmailAlreadyRegistered': 'User with this email is already registered'})
        }
        else{
           
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber
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
                        email: userData.email
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