import connectToDatabase from '../_db.js';
import jwt from 'jsonwebtoken';
import User from '../../server/models/User.js';

const SPECIAL_EMAIL = 'denisraj@gmail.com';
const SPECIAL_PASSWORD = 'Lax1204';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      if (!name) {
        return res.status(400).json({ message: 'Name is required for new registration' });
      }

      const role = email === SPECIAL_EMAIL && password === SPECIAL_PASSWORD ? 'manager' : 'user';

      user = new User({
        name,
        email,
        password,
        role,
      });

      await user.save();
    } else {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      if (user.role === 'user' && email === SPECIAL_EMAIL && password === SPECIAL_PASSWORD) {
        user.role = 'manager';
        await user.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({ success: true, token, user: userResponse, message: `Welcome ${user.name}! You have been logged in as ${user.role}` });
  } catch (error) {
    console.error('Login error (serverless):', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
}
