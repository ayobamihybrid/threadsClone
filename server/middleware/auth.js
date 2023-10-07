import User from '../models/UserModel.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import jwt from 'jsonwebtoken';

export const isUserAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (
    !authHeader ||
    authHeader === 'Bearer undefined' ||
    !authHeader.startsWith('Bearer ')
  ) {
    // return next(new ErrorHandler('Please login to continue', 401));
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
  req.user = await User.findById(decoded.id);
  next();
};
