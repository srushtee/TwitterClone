const express = require('express')
const router = express.Router()
const User = require('../../Models/UserModel')
const Post = require('../../Models/PostModel')
const passport = require('passport')
const mongoose = require('mongoose')
const { response } = require('express')

router.post('/', passport.authenticate('jwt', {session: false}), (req, resp) => {

    const postBody = req.body.postBody

    if(postBody.length > 140){
        resp.status(400).json({LengthError: 'Length should be lesser than or equals to 140'})
    }

    const newPost = new Post({
            user: req.user.id,
            postBody: req.body.postBody
    })

    newPost.save()
    .then((postData) => resp.json(postData))
    .catch(err => console.log(err))
})

router.post('/like/:postId', passport.authenticate('jwt', {session: true}), (req, resp) => {

    const postId = req.params.postId
    console.log(postId);
    Post.findById(req.params.postId)
    .then(post => {
        if(!post){
            resp.status(400).json({PostNotFound: 'Post for this id is not found'})
        }
        else{
            console.log(post);

            if(post.likes.filter(like=> like.toString() === req.user.id.toString()).length > 0){
                return resp.status(400).json({AlreadyDone: 'Post already liked'})
            }

            post.likes.push(req.user.id)
            post.save()
            .then(like => resp.status(200).json({Saved: 'Post upvoted'}))
            .catch(err => resp.json(400).json({Error: err.message}))

        }
        
    })
    .catch(err => resp.status(400).json({error: err.message}))

})

module.exports = router