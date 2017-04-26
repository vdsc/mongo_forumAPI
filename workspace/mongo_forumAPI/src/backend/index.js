const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')

//Import the API routes from the routes subdirectory
const userRoutes = require("./routes/userRoutes"),
      forumRoutes = require("./routes/forumRoutes"),
      commentRoutes = require("./routes/commentRoutes")
      
//Import the database name from the config file
const dbName = require("./config/main").database

//Declare this express instance
const app = express()
//Declare this router
const router = express.Router()
//Use body-parser to parse json requests
router.use(bodyParser.json());

//Port on which the server will run on
const port = 8080
//Connect mongoose to the database
mongoose.connect(dbName)
//Declare promise middleware
mongoose.Promise = global.Promise

//Add all of the external routes for the API
router.use(userRoutes)
router.use(forumRoutes)
router.use(commentRoutes);

app.use(cors())

//Declare a static web server to serve ONE client-side file on the BASE_URL+'/static' endpoint
app.use('/static',express.static(path.join(__dirname, '../client')));
//Morgan middleware to log all requests made to the server
app.use(morgan('combined'))
//Use the API routes
app.use(router)

//Start the server
app.listen(port)
