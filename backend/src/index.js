import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './routes/auth.js';
import protectedRoute from './routes/protectedRoutes.js';
import connectDB from './config/db.js';
import { fileRouter } from './routes/fileRouter.js';
import folderRouter from './routes/folderRouter.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(cookieParser());

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);
app.use('/protected', protectedRoute);
app.use('/files', fileRouter);
app.use('/folders', folderRouter);
app.get('/', (req, res) => {
  res.send('hello');
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export { app };
