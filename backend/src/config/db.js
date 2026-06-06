import mongoose from 'mongoose';
import User from '../models/User.js';

await mongoose.connect(process.env.MONGO_URI);

export const addUser = async (username, hashPassword) => {
    console.log(`username: ${username} and password: ${hashPassword}`);
    const user = await User.create({
        username: username,
        password: hashPassword,
    });
    return user;
};
