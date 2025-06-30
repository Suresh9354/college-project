const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
app.use(cors({
  origin: 'https://college-project-frontend-ushi.onrender.com', // ✅ Your deployed frontend URL
  credentials: true // if you're using cookies or sessions
}));
app.use(express.json());

const port = process.env.PORT || 5000;
// DB connect
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/users', userRoutes);



app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.port}`));
