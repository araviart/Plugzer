const mongoose = require('mongoose');

// Unique validator grants the possibility to verify that the user is unique in the database
const uniqueValidator = require('mongoose-unique-validator');

const UsersSchema = mongoose.Schema({
  // Unique param necessary to verify that the user is unique 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// Need to pass the schema through the plugin to verify it
UsersSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", UsersSchema);