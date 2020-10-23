const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    }, 
    phoneNumber: {
        type: Number,
        required: true     
    },
    date: {
        type:Date,
        default: new Date()
       
    },
    displayName:{
        type: String,
        required: true
    },
    followers: [{
      
            type:Schema.Types.ObjectId,
            ref: "myPerson"
    }],
    following: [{
                
                    type:Schema.Types.ObjectId,
                    ref: "myPerson"
              
                 }]
})

module.exports = User = mongoose.model('user', UserSchema)


