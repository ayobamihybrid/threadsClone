import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute.js';
import ErrorHandler from './utils/ErrorHandler.js';
import postRoute from './routes/postRoutes.js';

const app = express();

app.use(express.json());

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

dotenv.config();

const PORT = process.env.PORT;
const DB = process.env.MONGO_URL;

// Database connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log(`MongoDB is connected to the server: ${data.connection.host}`);
  });

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// routes
app.use('', userRoute);
app.use('', postRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Error handling
// app.use(ErrorHandler);

// Handling uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server for Handling uncaught Exception`);
});

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Shutting down server for ${err.message}`);
  console.log(`Shutting down the server due to Unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
