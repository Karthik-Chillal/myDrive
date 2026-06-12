import express from 'express';
import 'dotenv/config';
import authRouter from './routes/auth.js';
import protectedRoute from './routes/protectedRoutes.js';
import connectDB from './config/db.js';
import { fileRouter } from './routes/fileRouter.js';
import fileUpload from 'express-fileupload';
import folderRouter from './routes/folderRouter.js';

const app = express();

// Connect to Database
connectDB();

app.use(express.json());
app.use(fileUpload());
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
