const Books = require("../models/books.model");


// Create a book page
exports.create = async (req, res) => {
  const userId = req.auth.userId;
  const title = req.body.title;
  const author = req.body.author;
  const imageUrl = req.body.imageUrl;
  const year = req.body.year;
  const genre = req.body.genre;
  try {
    const book = await Books.create({
      userId,
      title,
      author,
      imageUrl,
      year,
      genre
    })
    return res.status(201).json(book)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
};

// Rate a book
exports.rate = async (req, res) => {

};

// Delete a book page
exports.delete = async (req, res) => {

};

// Display every books
exports.getAll = async (req, res) => {
  const books = await booksModel.findAll();
  return res.status(200).json(books)
};

// Display only one book
exports.getOne = async (req, res) => {

};


exports.bestRatings = async (req, res) => {

};

exports.modify = async (req, res) => {

};
