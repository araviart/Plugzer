const mongoose = require('mongoose');

const UsersSchema = mongoose.schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
})

module.exports = mongoose.model("Users", UsersSchema);