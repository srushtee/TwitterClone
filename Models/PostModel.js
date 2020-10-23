const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const PostSchema = new Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref: "user"
    },
    postBody: {
        type:String,
        maxlength: 140,
        required:true
    },
    date: {
        type:Date,
        default: new Date()
       
    },
    likes: [{
       
           user:{
            type:Schema.Types.ObjectId,
            ref: "myPerson"
           }
        
    }]
})

module.exports = Post = mongoose.model('post', PostSchema)


