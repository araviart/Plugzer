const express = require("express");
const router = express.Router();
const usersControllers = require('../controllers/users.controllers');


router.post('/signup', usersControllers.signUp);
router.post('/login', usersControllers.logIn);


module.exports = router; 