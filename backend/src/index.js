import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './routes/auth.js';
import protectedRoute from './routes/protectedRoutes.js';
import connectDB from './config/db.js';
import { fileRouter } from './routes/fileRouter.js';
import folderRouter from './routes/folderRouter.js';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

// Connect to Database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);
app.use('/protected', protectedRoute);
app.use('/files', fileRouter);
app.use('/folders', folderRouter);
app.get('/', (req, res) => {
  res.send('hello');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
