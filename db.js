const url = require('./Setup/myUrl').mongoUrl
const mongoose = require('mongoose')

mongoose.Promise = global.Promise;



mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('Connected to mongoDB'))
.catch((err)=>console.log(err));

let db = mongoose.Connection;