const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

dotenv.config();
const PORT = process.env.PORT

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.listen(PORT, () => {console.log(`Listening to port ${PORT}`);})