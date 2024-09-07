// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log('in auth')
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    req.userId = decoded.id; 
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};