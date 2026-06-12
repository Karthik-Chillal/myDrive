import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Folders from '../models/Folders.js';
import 'dotenv/config';
export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(401).json({ error: 'Username taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
        });
        await Folders.create({
            folder_name: 'home',
            user: user._id,
            parent_folder_id: null,
            home_id: process.env.HOME,
        });
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed.' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication Failed' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Wrong Password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Increased to 1h for better usability
        });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login Failed' });
    }
};
