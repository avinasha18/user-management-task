import { Controller, Get, Post, Put, Delete, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

@Controller('api/users')
 class UserController {
  @Post('register')
  async register(req: Request, res: Response): Promise<void> {
    const { username, password, email, address } = req.body;
    try {
      console.log('in register');
      const newUser = new User({ username, password, email, address });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
  }

  @Post('login')
  private async login(req: Request, res: Response): Promise<any> {
    try {
      const { username, password } = req.body;
      console.log('Login request:', { username, password });

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
      res.status(200).json({ token, userId: user._id });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  }

  @Get('profile')
  @Middleware(authMiddleware)
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching profile' });
    }
  }

  @Put('profile')
  @Middleware(authMiddleware)
  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { username, email, address } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.userId,
        { username, email, address },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating profile' });
    }
  }

  @Delete('profile')
  @Middleware(authMiddleware)
  async deleteProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(req.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting profile' });
    }
  }

  @Get('users')
  @Middleware(authMiddleware)
  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find({}, '-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  }
}

export default UserController