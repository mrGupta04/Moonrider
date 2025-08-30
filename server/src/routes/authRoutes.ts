import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User';

const router = express.Router();

// Configure multer for file uploads
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to get JWT secret safely
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

// Helper function to format user response
const formatUserResponse = (user: any) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    instagram: user.instagram,
    leetcode: user.leetcode,
    authProvider: user.authProvider,
    avatar: user.avatar,
    googleId: user.googleId,
    githubId: user.githubId,
    isVerified: user.isVerified
  };
};

// Check if OAuth is configured
const isGoogleOAuthConfigured = () => {
  return process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
         process.env.GOOGLE_CLIENT_ID !== 'dummy_client_id';
};

const isGitHubOAuthConfigured = () => {
  return process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && 
         process.env.GITHUB_CLIENT_ID !== 'dummy_client_id';
};

// Register new user with profile picture
router.post('/register', upload.single('avatar'), async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    console.log('Uploaded file:', req.file);
    
    const { name, email, password, phone, instagram, leetcode } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting uploaded file:', err);
        });
      }
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting uploaded file:', err);
        });
      }
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Handle profile picture
    let avatarPath: string | undefined;
    if (req.file) {
      avatarPath = req.file.path;
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || undefined,
      instagram: instagram || undefined,
      leetcode: leetcode || undefined,
      avatar: avatarPath,
      authProvider: 'local',
      isVerified: false
    });
    
    await user.save();
    
    // Generate JWT token
    const jwtSecret = getJwtSecret();
    const token = jwt.sign(
      { userId: user._id.toString() },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: formatUserResponse(user)
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(400).json({ 
        message: 'This account was created with social login. Please use the social login option.' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const jwtSecret = getJwtSecret();
    const token = jwt.sign(
      { userId: user._id.toString() },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
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
});

// Verify token endpoint
router.get('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
  const user = req.user as any;
  res.json({ 
    message: 'Token is valid',
    user: formatUserResponse(user)
  });
});

// Google OAuth routes
router.get('/google', (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    return res.status(501).json({ message: 'Google OAuth is not configured' });
  }
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/login?error=google_oauth_not_configured`);
  }
  passport.authenticate('google', { session: false, failureRedirect: '/login' })(req, res, next);
}, async (req, res) => {
  try {
    const jwtSecret = getJwtSecret();
    const user = req.user as any;
    
    // Fetch fresh user data
    const freshUser = await User.findById(user._id);
    if (!freshUser) {
      throw new Error('User not found after authentication');
    }

    const token = jwt.sign(
      { userId: freshUser._id.toString() },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userData = encodeURIComponent(JSON.stringify(formatUserResponse(freshUser)));
    res.redirect(`${frontendUrl}/oauth-callback?token=${token}&user=${userData}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?error=server_error`);
  }
});

// GitHub OAuth routes
router.get('/github', (req, res, next) => {
  if (!isGitHubOAuthConfigured()) {
    return res.status(501).json({ message: 'GitHub OAuth is not configured' });
  }
  passport.authenticate('github', { 
    scope: ['user:email'],
    session: false 
  })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
  if (!isGitHubOAuthConfigured()) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/login?error=github_oauth_not_configured`);
  }
  passport.authenticate('github', { session: false, failureRedirect: '/login' })(req, res, next);
}, async (req, res) => {
  try {
    const jwtSecret = getJwtSecret();
    const user = req.user as any;
    
    // Fetch fresh user data
    const freshUser = await User.findById(user._id);
    if (!freshUser) {
      throw new Error('User not found after authentication');
    }

    const token = jwt.sign(
      { userId: freshUser._id.toString() },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userData = encodeURIComponent(JSON.stringify(formatUserResponse(freshUser)));
    res.redirect(`${frontendUrl}/oauth-callback?token=${token}&user=${userData}`);
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?error=server_error`);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Get current user profile
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = req.user as any;
    
    // Fetch fresh user data
    const freshUser = await User.findById(user._id);
    if (!freshUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: formatUserResponse(freshUser) });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;