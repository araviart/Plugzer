const Books = require("../models/books.model");


// Create a book page
exports.create = async (req, res) => {
  try {
    console.log('Received request to create book:', req.body);

    const host = req.get("host");
    const userId = req.auth.userId;

    const bookData = JSON.parse(req.body.book);

    const title = bookData.title;
    const author = bookData.author;
    const imageUrl = `${req.protocol}://${host}/images/${req.file.filename}`;
    const year = bookData.year;
    const genre = bookData.genre;
    const rating = bookData.ratings;

    console.log("host", host, "userID", userId, "title", title, "author", author, "imageUrl", imageUrl, "year", year, "genre", genre, "rating", rating);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const book = new Books({
      userId: userId,
      title: title,
      author: author,
      imageUrl: imageUrl,
      year: year,
      genre: genre,
      ratings: rating,
    });

    const savedBook = await book.save();
    return res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ error });
  }
};




// Rate a book
exports.rate = async (req, res) => {
  const userId = req.auth.userId;
  const bookId = req.params.id;

  const ratingValue = req.body.rating;

  if (ratingValue < 0 || ratingValue > 5) {
    return res.status(400).json({ message: 'Invalid rating value. Rating must be between 0 and 5.' });
  }

  try {
    const book = await Books.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Verify if the user has already rated the book
    const existingRating = book.ratings.find(rating => rating.userId.toString() === userId);

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this book' });
    }

    // Add the new rating
    book.ratings.push({ userId, grade: ratingValue });

    // Get the average rating 
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
  try {
    const bestRatedBooks = await Books.find()
      .sort({ averageRating: -1 })
      .limit(3);

    return res.status(200).json(bestRatedBooks);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};


exports.modify = async (req, res) => {
  if (req.file) {
    try {
      const bookData = JSON.parse(req.body.book);
      const { title, author, year, genre } = bookData;
      const host = req.get('host');
      const imageUrl = `${req.protocol}://${host}/images/${req.file.filename}`;

      const updateBook = {
        title: title,
        author: author,
        year: parseInt(year), // Fix the typo here
        imageUrl: imageUrl,
        genre: genre
      };
      console.log("updatedBook:", updateBook);

      await Books.updateOne({ _id: req.params.id }, updateBook);
      res.status(200).json({ message: 'The Book has been succesfully updated' });
    }
    catch (error) { res.status(400).json({ error }) };
  } else {
    const { title, author, genre, year } = req.body;

    const updateBook = {
      title: title,
      author: author,
      year: parseInt(year),
      genre: genre
    };
    try {
      console.log("updatedBook:", updateBook);

      await Books.updateOne({ _id: req.params.id }, updateBook);
      res.status(200).json({ message: 'The book has been successfully updated' });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};





