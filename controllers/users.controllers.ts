import User from '../models/users.model'; // Adjust the path as necessary
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
// import mongoose from 'mongoose';

export const createUser = async (req: Request, res: Response) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash
    });
    await user.save();
    res.status(201).json({ message: "User saved in the database" });
  }catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

export const usersControllers = {
  createUser,
  getUsers
}