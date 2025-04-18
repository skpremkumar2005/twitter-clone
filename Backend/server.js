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

// ✅ 1. Trust proxy (very important for Render)
app.set('trust proxy', 1);

// ✅ 2. CORS setup
const FRONTEND_URL = 'https://twitter-clone-flame-five.vercel.app';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// ✅ 3. Middleware
app.use(urlencoded({ extended: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// ✅ 4. Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRETE_KEY, // typo fix if needed
});

// ✅ 5. Routes
app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/auth', Authrouter);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/notification', NotificationRoute);

// ✅ 6. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  ConnectDb();
});
