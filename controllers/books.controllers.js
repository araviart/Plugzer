const Books = require("../models/books.model");


// Create a book page
exports.create = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const book = await new Books({
      userID: userId,
      ratings: [{ _Id: userId }],
      ...req.body
    });
    book.save()
    return res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Rate a book
exports.rate = async (req, res) => {

};

// Delete a book page
exports.delete = async (req, res) => {
  await Books.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Object deleted' }))
    .catch(error => res.status(400).json({ error }));
};

// Display every books
exports.getAll = async (req, res) => {
  await Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
};

// Display only one book
exports.getOne = async (req, res) => {
  await Books.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }))
};


exports.bestRatings = async (req, res) => {

};

exports.modify = async (req, res) => {
  Books.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({message: 'The book has been successfully updated'}))
    .catch(error => res.status(400).json({ error }))
};
