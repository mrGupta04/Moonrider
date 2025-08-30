import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import { LoginCredentials, RegisterData } from '../types';

// Extend the Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

// Helper function to format user response
const formatUserResponse = (user: any) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    instagram: user.instagram,
    youtube: user.youtube,
    avatar: user.avatar,
    authProvider: user.authProvider,
    googleId: user.googleId,
    githubId: user.githubId,
    isVerified: user.isVerified
  };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone }: RegisterData = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Handle profile picture upload
    let avatarPath: string | undefined;
    if (req.file) {
      avatarPath = req.file.path;
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      avatar: avatarPath,
      authProvider: 'local',
      isVerified: false
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: formatUserResponse(user)
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    
    if (error.name === 'ValidationError') {
      res.status(400).json({ 
        message: 'Validation Error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
      return;
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginCredentials = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if user has a password (OAuth users might not have one)
    if (!user.password) {
      res.status(400).json({ 
        message: 'This account was created with social login. Please use the social login option.' 
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      token,
      user: formatUserResponse(user)
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Fetch fresh user data from database
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user: formatUserResponse(user) });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      message: 'Server error fetching user data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const oauthCallback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=authentication_failed`);
      return;
    }

    // Generate token
    const token = generateToken(req.user._id.toString());

    // Fetch fresh user data to ensure we have the latest information
    const user = await User.findById(req.user._id);
    if (!user) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=user_not_found`);
      return;
    }

    // Redirect to frontend with token and user data
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userData = encodeURIComponent(JSON.stringify(formatUserResponse(user)));
    res.redirect(`${frontendUrl}/oauth-callback?token=${token}&user=${userData}`);
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?error=server_error`);
  }
};

export const linkAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const userId = req.user._id;
    const { provider, providerId } = req.body;

    if (!provider || !providerId) {
      res.status(400).json({ message: 'Provider and providerId are required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if the provider ID is already linked to another account
    const query: any = {};
    if (provider === 'google') {
      query.googleId = providerId;
    } else if (provider === 'github') {
      query.githubId = providerId;
    } else {
      res.status(400).json({ message: 'Invalid provider' });
      return;
    }

    const existingUser = await User.findOne(query);
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      res.status(400).json({ message: 'This account is already linked to another user' });
      return;
    }

    // Update user with provider ID
    if (provider === 'google') {
      user.googleId = providerId;
    } else if (provider === 'github') {
      user.githubId = providerId;
    }

    await user.save();

    res.json({
      message: 'Account linked successfully',
      user: formatUserResponse(user)
    });
  } catch (error: any) {
    console.error('Link account error:', error);
    res.status(500).json({ 
      message: 'Server error linking account',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const userId = req.user._id;
    const { name, phone, instagram, youtube } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Handle profile picture upload
    if (req.file) {
      // Delete old avatar if it exists and is not from OAuth
      if (user.avatar && !user.avatar.startsWith('http')) {
        fs.unlink(user.avatar, (err) => {
          if (err) console.error('Error deleting old avatar:', err);
        });
      }
      user.avatar = req.file.path;
    }

    // Update user fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (instagram !== undefined) user.instagram = instagram;
    if (youtube !== undefined) user.youtube = youtube;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: formatUserResponse(user)
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};