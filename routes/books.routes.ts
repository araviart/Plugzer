import express from 'express';
const booksRouter = express.Router();
import * as booksControllers from '../controllers/books.controllers';
// Adding a middleware to give a unique token and verify the authentication of the users
// const auth = require('../middlewares/auth');
// const multer = require('../middlewares/multer-config');
// const optimizeImage = require("../middlewares/sharp-config");

booksRouter.post('/',  booksControllers.createBook);
// router.post('/:id/rating',booksControllers.);

// router.get('/bestrating', booksControllers.bestRatings);
booksRouter.get('/', booksControllers.getBooks);
booksRouter.get('/:id', booksControllers.getBook);

// booksRouter.put('/:id',booksControllers.modifyBook);
// booksRouter.delete('/:id', booksControllers.deleteBook);


export default booksRouter;