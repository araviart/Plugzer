const express = require("express");
const bodyParser = require('bodyParser');
const cors = require("cors");

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
app.use("/api/auth", usersRoutes);
app.use("/api/books", booksRoutes);

module.exports = app; 