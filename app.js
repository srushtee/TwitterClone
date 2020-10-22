const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const dotenv = require('dotenv')
const db = require('./db')
const session = require('express-session')
const auth = require('./Routes/api/auth')

dotenv.config();
const PORT = process.env.PORT

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({secret:'Your secret key', saveUninitialized: false, resave:false}))

app.use(passport.initialize())

require("./strategies/jsonwtStrategy")(passport)

app.use('/api/auth', auth);

app.listen(PORT, () => {console.log(`Listening to port ${PORT}`);})