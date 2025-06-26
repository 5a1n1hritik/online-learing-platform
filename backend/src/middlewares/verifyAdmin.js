import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const verifyAdmin = async (req, res, next) => {
  // const token = req.headers.authorization?.split(' ')[1];
  const token = req.cookies.authToken;

  if (!token) return res.status(403).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decode token:', decoded);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, name: true },
    });
    console.log('user',user);

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    req.user = {
      userId: user.id,
      role: user.role,
      name: user.name, 
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(403).json({ error: 'Invalid token or authentication failed' });
  }
};

export default verifyAdmin;
