const express = require("express");
const router = express.Router();
const booksControllers = require("../controllers/books.controllers");

router.post('/', booksControllers.create);
router.post('/:id/rating', booksControllers.rate);
router.get('/', booksControllers.getAll);
router.get('/:id', booksControllers.getOne);
router.get('/bestratiing', booksControllers.bestRatings);
router.put('/:id', booksControllers.modify);
router.delete('/:id', booksControllers.delete);


module.exports = router; 