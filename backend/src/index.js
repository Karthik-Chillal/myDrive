import express from 'express';
import 'dotenv/config';
import authRouter from './routes/auth.js';
import protectedRoute from './routes/protectedRoutes.js';
import './config/db.js';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/protected', protectedRoute);
app.get('/', (req, res) => {
    res.send('hello');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
