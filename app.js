const express = require("express");
const cors = require("cors");

// Initiate the express server
const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Database ORM
const mongoose = require("mongoose");

module.exports = app; 