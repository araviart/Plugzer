const Users = require('../models/users.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new Users({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: "User saved in the database" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.logIn = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      userID: user.id,
      token: jwt.sign(
        { userId: user.id },
        process.env.TOKEN_SECRET,
        { expiresIn: '24h' })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
