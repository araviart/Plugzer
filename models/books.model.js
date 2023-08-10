const mongoose = require('mongoose');

const BooksSchema = mongoose.schema({
  userID: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userID: { type: String, unique: true },
      grade: { type: Number, }
    }
  ],
  averageRating: { type: Number }
})


module.exports = mongoose.model('Books', BooksSchema)