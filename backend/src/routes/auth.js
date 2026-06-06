import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addUser } from '../config/db.js';
const authRouter = express.Router();
authRouter.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(401).json({ error: 'Username taken' });
        }
        await addUser(username, hashedPassword);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication Failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Wrong Password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2m',
        });
        res.status(200).json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Login Failed' });
    }
});
export default authRouter;
