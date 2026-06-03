import express from 'express';
const app = express();
import authRouter from './routes/auth.js';
import protectedRoute from './routes/protectedRoutes.js';
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
