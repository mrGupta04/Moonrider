import express from 'express';
import passport from 'passport';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User';

const router = express.Router();

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
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

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Helper function to format user response
const formatUserResponse = (user: any) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    authProvider: user.authProvider,
    avatar: user.avatar,
    instagram: user.instagram,
    leetcode: user.leetcode,
    googleId: user.googleId,
    githubId: user.githubId,
    isVerified: user.isVerified
  };
};

// Get current user profile
router.get('/', async (req, res) => {
  try {
    const user = req.user as any;
    const freshUser = await User.findById(user._id);
    
    if (!freshUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: formatUserResponse(freshUser)
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user profile
router.put('/', upload.single('avatar'), async (req, res) => {
  try {
    const { name, phone, instagram, leetcode } = req.body;
    const user = req.user as any;
    const userId = user._id;

    // Handle profile picture upload
    let avatarPath: string | undefined;
    if (req.file) {
      avatarPath = req.file.path;
      
      // Delete old avatar if it exists and is a local file (not from OAuth)
      if (user.avatar && !user.avatar.startsWith('http')) {
        try {
          fs.unlinkSync(user.avatar);
        } catch (error) {
          console.warn('Could not delete old avatar file:', error);
        }
      }
    }

    const updateData: any = {
      name,
      phone,
      instagram,
      leetcode
    };

    if (avatarPath) {
      updateData.avatar = avatarPath;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting uploaded file:', err);
        });
      }
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: formatUserResponse(updatedUser)
    });
  } catch (error: any) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete user account
router.delete('/', async (req, res) => {
  try {
    const user = req.user as any;
    const userId = user._id;

    // Delete avatar file if it exists and is a local file
    if (user.avatar && !user.avatar.startsWith('http')) {
      try {
        fs.unlinkSync(user.avatar);
      } catch (error) {
        console.warn('Could not delete avatar file:', error);
      }
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all users (admin only)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users.map(user => formatUserResponse(user))
    });
  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;