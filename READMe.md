# Initialize a Backend server and database for an API Restful

## Create a new user in the database

- Two possiblities to create a new user inside the database

```js 

const User = require('../models/users.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
  if (!req.body.email | !req.body.password) {
    return res.status(400).send({
      message: "Must have email and password"
    });
  }
  try {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
      });
    user.save()
      .then(() => res.status(201).json({ message: 'User has been created' }))
  } catch (err) {
    return err = res.status(500).send({ message: err.message });
  }
};

```

``` js

  bcrypt.has(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({message: "User saved in the database"}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

```

- Two possibilities to log in

``` js

async (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: "email/password are incorrect" });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: "email/password are incorrect" });
          }
          res.status(200).json({
            userID: user._id,
            token: "TOKEN"
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

```