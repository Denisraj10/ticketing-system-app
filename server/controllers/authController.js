import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SPECIAL_EMAIL = 'denisraj@gmail.com';
const SPECIAL_PASSWORD = 'Lax1204';

export const login = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Auto-register new user
      if (!name) {
        return res.status(400).json({ message: 'Name is required for new registration' });
      }

      // Determine role based on special credentials
      const role = email === SPECIAL_EMAIL && password === SPECIAL_PASSWORD ? 'manager' : 'user';

      user = new User({
        name,
        email,
        password,
        role,
      });

      await user.save();
      console.log(`✓ New user registered: ${email} with role: ${role}`);
    } else {
      // Validate password for existing user
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // For existing users, check if they should be promoted to manager
      if (user.role === 'user' && email === SPECIAL_EMAIL && password === SPECIAL_PASSWORD) {
        user.role = 'manager';
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
      message: `Welcome ${user.name}! You have been logged in as ${user.role}`,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
