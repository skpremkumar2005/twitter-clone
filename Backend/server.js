import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

import Authrouter from './routes/auth.js';
import ConnectDb from './db/db.connection.js';
import UserRoute from './routes/userRoute.js';
import PostRoute from './routes/postRoute.js';
import NotificationRoute from './routes/notification.js';

dotenv.config();

const app = express();

// ✅ Fix CORS FIRST (very important order)
const FRONTEND_URL = 'https://twitter-clone-flame-five.vercel.app';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// ✅ Explicitly allow credentials in response headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// ✅ Cookie and JSON parsing
app.use(urlencoded({ extended: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY, // 🔧 Fix typo here
});

// ✅ API routes
app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/auth', Authrouter);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/notification', NotificationRoute);

// ✅ Port and DB connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  ConnectDb();
});

