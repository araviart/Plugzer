const Books = require("../models/books.model");


// Create a book page
exports.create = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const book = await new Books({
      userId: userId, // Utiliser "userId" en minuscules
      ...req.body
    });
    const savedBook = await book.save(); // Attendre que l'enregistrement soit terminé
    return res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};



// Rate a book
exports.rate = async (req, res) => {
  const userId = req.auth.userId;
  const bookId = req.params.id; // Supposons que vous récupérez l'ID du livre depuis les paramètres

  const ratingValue = req.body.rating; // Supposons que vous récupérez la note depuis le corps de la requête

  if (ratingValue < 0 || ratingValue > 5) {
    return res.status(400).json({ message: 'Invalid rating value. Rating must be between 0 and 5.' });
  }

  try {
    const book = await Books.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Vérifier si l'utilisateur a déjà noté ce livre
    const existingRating = book.ratings.find(rating => rating.userId.toString() === userId);

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this book' });
    }

    // Ajouter la nouvelle note
    book.ratings.push({ userId, grade: ratingValue });

    // Recalculer la note moyenne
    let totalRating = 0;
    for (const rating of book.ratings) {
      totalRating += rating.grade;
    }
    book.averageRating = totalRating / book.ratings.length;

    await book.save();

    return res.status(200).json({ message: 'Rating added successfully', book });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
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
    .then(() => res.status(200).json({ message: 'The book has been successfully updated' }))
    .catch(error => res.status(400).json({ error }))
};
