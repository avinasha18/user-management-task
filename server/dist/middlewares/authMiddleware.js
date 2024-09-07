import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';
export const authMiddleware = (req, res, next) => {
    var _a;
    console.log('in auth');
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
