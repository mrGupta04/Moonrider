import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUserDocument } from '../models/User';

// Extend the existing Passport interface instead of redeclaring
declare global {
  namespace Express {
    interface User extends IUserDocument {} // Extend the existing User interface
  }
}

// Custom authentication middleware
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: Express.User | false, info: any) => {
    if (err) {
      console.error('JWT Authentication error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during authentication'
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Optional: Admin check middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  next();
};

// Optional: Optional authentication (doesn't fail if no token, but adds user if valid)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: Express.User | false, info: any) => {
    if (err) {
      console.error('Optional auth error:', err);
      return next();
    }
    
    if (user) {
      req.user = user;
    }
    
    next();
  })(req, res, next);
};