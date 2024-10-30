import { Request, Response } from 'express';
import Book from '../models/books.model';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = new Book({
      userId: req.body.userId,
      title: req.body.title,
      author: req.body.author,
      imageUrl: req.body.imageUrl,
      year: req.body.year,
      genre: req.body.genre,
      ratings: [],
      averageRating: 0
    });
    await book.save();
    res.status(201).json({ message: "Book saved in the database" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

// export function modifyBook(arg0: string, modifyBook: any) {
//   throw new Error('Function not implemented.');
// }
// export function deleteBook(arg0: string, deleteBook: any) {
//   throw new Error('Function not implemented.');
// }

