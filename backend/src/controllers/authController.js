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
    console.log(req.body);
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
      return res.status(401).json({ error: 'No such username found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Wrong Password' });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: '10m', // Increased to 1h for better usability
      }
    );

    // creating refresh Token so that auth is persisted for a longer time,
    // and is safer than increasing expriresIn
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === 'production', // true for https in production
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login Failed' });
  }
};

export const refresh = (req, res) => {
  if (req.cookies?.jwt) {
    const refreshToken = req.cookies.jwt;

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(406).json({ message: 'Unauthorized' });
      } else {
        const accessToken = jwt.sign(
          {
            userId: decoded.userId,
          },
          process.env.JWT_ACCESS_SECRET,
          {
            expiresIn: '10m',
          }
        );
        return res.status(200).json({ accessToken });
      }
    });
  } else {
    return res.status(406).json({ message: 'Unauthorized' });
  }
};
