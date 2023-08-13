const mongoose = require('mongoose');

const BooksSchema = mongoose.Schema({
  userID: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userID: { type: String },
      grade: { type: Number }
    }
  ],
  averageRating: { type: Number }
}, { versionKey: false })


module.exports = mongoose.model('Books', BooksSchema)