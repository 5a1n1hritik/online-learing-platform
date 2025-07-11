# 📘 EduLearn: An Online Learning Platform

**EduLearn** is a dynamic online education platform built for students to explore structured courses, take interactive quizzes and exams, enroll in paid or free courses/lessons, and track their learning journey. It features a clean UI, secure authentication, advanced analytics, and a scalable architecture.

## 🖼️ Screenshots

### Homepage

![Homepage Screenshot](https://yourdomain.com/homepage.png)

### Course Details

![Course Details Screenshot](https://yourdomain.com/course-details.png)

### Dashboard

![Dashboard Screenshot](https://yourdomain.com/dashboard.png)

---

## 🚀 Live Demo

Visit the platform: [EduLearn](https://learnhub.vercel.app/)

---

## 🛠️ Tech Stack

### 🔹 Frontend (React + Vite)

* **React 18**
* **Vite** – Lightning-fast development server and build tool
* **Tailwind CSS + Tailwind Animate**
* **Radix UI** – Accessible primitives (accordion, tabs, dialogs, etc.)
* **Lucide React** – Icon library
* **Recharts** – Analytics and performance graphs
* **React Router DOM** – Routing and navigation
* **React Toastify** – Notification system
* **JWT Decode** – Decode access tokens
* **Lottie React** – Animation support
* **Swiper.js** – Carousels/sliders

### 🔸 Backend (Express + Prisma)

* **Express.js** – Web framework for APIs
* **Prisma ORM** – Type-safe and powerful DB access
* **PostgreSQL** – Relational database
* **JWT** – Secure authentication tokens
* **bcryptjs** – Password hashing
* **Zod** – Schema validation
* **Cloudinary + Multer** – Media/image uploads
* **Nodemailer** – Email services (OTP, notifications)
* **CORS, CSURF, Rate Limiter** – Security middleware
* **Passport (Google, Facebook)** – OAuth login support

---

## 📚 Features

* 🔐 **JWT Authentication** with CSRF protection
* 🎓 **Course Catalog** (free and paid, category-wise)
* 💳 **Payment Integration** (via Stripe/Razorpay – coming soon)
* 🧠 **Interactive Quizzes and Exams** with Timer, Result Analysis
* 📊 **Dashboard** showing enrolled courses, performance, activities
* 📝 **Lesson Types** – Video, Text, Assignments, Projects
* 🧾 **Instructor Profiles** with bio and course list
* 📱 **Fully Responsive Design**
* 📈 **Performance Graphs** using Recharts
* 🔍 **Smart Search and Filters**

---

## 🧑‍💻 Getting Started

### Prerequisites

* Node.js v18+
* PostgreSQL (local or cloud like Supabase/Railway)
* Vercel (Frontend)
* Render/Railway (Backend)

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
```

### Add `.env` File

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Prisma DB Migration

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Run Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## 🌐 Frontend Setup

```bash
cd frontend
npm install
```

### Add `.env` File

```env
VITE_API_URL=http://localhost:5000
```

### Run Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📤 Deployment

### 🔹 Frontend (Vercel)

* Connect frontend GitHub repo to [Vercel](https://vercel.com/)
* Set environment variable:

  * `VITE_API_URL=https://your-backend.onrender.com`

### 🔹 Backend (Render or Railway)

* Push backend folder to GitHub
* Create new web service
* Add environment variables from `.env`

---

## 📁 Folder Structure

```
online-learning-platform/
├── backend/               # Express + Prisma API
│   ├── prisma/            # Prisma schema
│   ├── routes/            # API routes
│   ├── controllers/       # Request handlers
│   ├── utils/             # Helper functions
│   └── index.js           # Entry point
│
├── frontend/              # React frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── main.jsx
```

---

## 🔍 Testing

Use **Thunder Client** (VS Code) or **Postman** to test backend APIs.

---

## 🛡️ License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/your-feature-name

# Commit changes
git commit -m "Add feature"

# Push
git push origin feature/your-feature-name

# Create Pull Request
```

---

## 🙌 Acknowledgements

* UI inspiration from platforms like Coursera, Unacademy, and Udemy
* Built with open-source tools: Prisma, React, Express, Tailwind
* Thanks to all contributors and library authors!

---

**Ready to learn? Start your journey with EduLearn today!**
Got feedback or suggestions? [Contact us](mailto:your.sainihritik033@gmail.com)
