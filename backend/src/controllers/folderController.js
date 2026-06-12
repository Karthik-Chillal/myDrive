import Folders from '../models/Folders.js';
import mongoose from 'mongoose';
import 'dotenv/config';
export const createFolder = async (req, res) => {
    try {
        const folderName = req.body.folder_name;
        const user = req.userId;
        const newFolder = await Folders.create({
            folder_name: folderName,
            user: user,
            parent_folder_id: req.params.id,
        });
        await newFolder.save();
        return res.status(201).json({ message: 'folder created successfully' });
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

export const getFolders = async (req, res) => {
    const currentDirectory = req.params.id;
    try {
        const folders = await Folders.find({
            parent_folder_id: currentDirectory || null,
            user: req.userId,
        });
        return res.status(200).json({ folders });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
export const getHomeFolder = async (req, res) => {
    console.log('req.userId =', req.userId);
    const homeFolder = await Folders.findOne({
        user: new mongoose.Types.ObjectId(req.userId),
        home_id: process.env.HOME,
    });
    console.log(homeFolder);
    res.status(200).json({ message: 'successful' });
};
