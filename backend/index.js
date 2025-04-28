// import dotenv from 'dotenv'
// import express from 'express';
// import cors from 'cors';
// import { PrismaClient } from '@prisma/client';
// import cookieParser from 'cookie-parser';

// import adminRoutes from './src/routes/adminRoutes.js';
// import authRoutes from './src/routes/authRoutes.js';
// import courseRoutes from './src/routes/courseRoutes.js';
// import enrollmentRoutes from './src/routes/enrollmentRoutes.js';
// import lessonRoutes from './src/routes/lessonRoutes.js';
// import quizRoutes from './src/routes/quizRoutes.js';

// const app = express();
// dotenv.config();
// const prisma = new PrismaClient();

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true, 
// }));

// app.use(express.json());
// app.use(cookieParser());

// app.use('/api/admin', adminRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/enrollments', enrollmentRoutes);
// app.use('/api/lessons', lessonRoutes);
// app.use('/api/quizzes', quizRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import app from './src/app.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
