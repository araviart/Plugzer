import { Document, Schema, model } from 'mongoose';

export interface IBook extends Document {
  userId: string;
  title: string;
  author: string;
  imageUrl: string;
  year: number;
  genre: string;
  ratings: Array<{ userId: string; rating: number }>;
  averageRating: number;
}

const BookSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      rating: { type: Number, required: true }
    }
  ],
  averageRating: { type: Number, required: true }
});

const Book = model<IBook>('Book', BookSchema);

export default Book;