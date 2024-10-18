const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decode token:', decoded);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    console.log('user',user);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(403).json({ error: 'Invalid token or authentication failed' });
  }
};

module.exports = verifyAdmin;
