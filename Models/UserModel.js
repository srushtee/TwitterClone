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
       
    }
})

module.exports = User = mongoose.model('user', UserSchema)


