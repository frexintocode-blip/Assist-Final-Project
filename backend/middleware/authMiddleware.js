import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { catchError } from '../utils/catchError.js';

export const protect = catchError(async (req, res, next) => {
  let token = req.cookies.token; // Read token from httpOnly cookie

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  res.status(401);
  throw new Error('Not authorized, token missing');
});

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('Access denied, administrator resource only');
};