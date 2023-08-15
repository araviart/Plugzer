const express = require("express");
const router = express.Router();
const booksControllers = require("../controllers/books.controllers");

// Adding a middleware to give a unique token and verify the authentication of the users
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/', auth, booksControllers.create);
router.post('/:id/rating', auth, booksControllers.rate);
router.get('/', booksControllers.getAll);
router.get('/:id', booksControllers.getOne);
router.get('/bestrating', booksControllers.bestRatings);
router.put('/:id', auth, multer, booksControllers.modify);
router.delete('/:id', auth, booksControllers.delete);


module.exports = router; 