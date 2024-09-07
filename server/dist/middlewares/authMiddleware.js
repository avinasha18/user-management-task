import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';
export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ error: 'No token, authorization denied' });
        return;
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
