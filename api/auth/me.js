import connectToDatabase from '../_db.js';
import jwt from 'jsonwebtoken';
import User from '../../server/models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get current user error (serverless):', error);
    return res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
}
