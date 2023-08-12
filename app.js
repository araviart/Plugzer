const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();



// Connect to the MongoDB database
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://henry:henrylvgpassword@levieuxgrimoire.fkn2cej.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Successfully connected to MongoDB !'))
  .catch(() => console.log('Failed to connect to MongoDB'));


const usersRoutes = require('./routes/users.routes');
const booksRoutes = require('./routes/books.routes');

// Initiate the express server
const app = express();


app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})
app.use(cors());
app.use(express.json());
app.use("/api/auth", usersRoutes);
app.use("/api/books", booksRoutes);

module.exports = app; 