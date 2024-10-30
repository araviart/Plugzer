// const express = require("express");
// const router = express.Router();
// const usersControllers = require('../controllers/users.controllers');
import express from 'express';
const usersRouter = express.Router();
import {usersControllers} from '../controllers/users.controllers';


usersRouter.post('/create', usersControllers.createUser);
usersRouter.get('/get', usersControllers.getUsers);


export default usersRouter;