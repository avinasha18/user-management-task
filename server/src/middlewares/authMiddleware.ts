import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};