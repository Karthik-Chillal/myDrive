import Folders from '../models/Folders.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import Files from '../models/Files.js';

export const createFolder = async (req, res) => {
  try {
    const folderName = req.body.folder_name;
    const user = req.userId;
    const newFolder = await Folders.create({
      folder_name: folderName,
      user: user,
      parent_folder_id: new mongoose.Types.ObjectId(req.params.id),
    });
    await newFolder.save();
    return res.status(201).json({ message: 'folder created successfully' });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
export const createHomeFolders = async (req, res) => {
  try {
    const home_folder = await Folders.findOne({
      user: req.userId,
      home_id: process.env.HOME,
    });

    if (!home_folder) {
      return res.status(500).json('no folder found');
    }
    console.log('before');
    const folderName = req.body.folder_name;
    console.log(folderName);
    const newFolder = await Folders.create({
      folder_name: folderName,
      user: req.userId,
      parent_folder_id: new mongoose.Types.ObjectId(home_folder._id),
    });
    console.log('created folder');
    await newFolder.save();
    return res.status(200).json({ message: 'successful' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getFolders = async (req, res) => {
  const currentDirectory = req.params.id;
  try {
    const folders = await Folders.find({
      parent_folder_id: new mongoose.Types.ObjectId(currentDirectory),
      user: req.userId,
    });
    const files = await Files.find({
      parent_folder_id: new mongoose.Types.ObjectId(currentDirectory),
      user: req.userId,
    });
    return res.status(200).json({ folders, files });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export const getHomeFolder = async (req, res) => {
  try {
    console.log('req.userId =', req.userId);
    const homeFolder = await Folders.findOne({
      user: new mongoose.Types.ObjectId(req.userId),
      home_id: process.env.HOME,
    });
    if (!homeFolder) {
      return res.status(400).json({ error: 'no folder present' });
    }
    const folders = await Folders.find({
      user: new mongoose.Types.ObjectId(req.userId),
      parent_folder_id: homeFolder._id,
    });
    const files = await Files.find({
      user: new mongoose.Types.ObjectId(req.userId),
      parent_folder_id: homeFolder._id,
    });
    const contents = {
      folders,
      files,
    };
    console.log(contents);
    return res.status(200).json({ contents });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folders.findOne({ _id: folderId, user: req.userId });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    await folder.deleteOne();
    console.log('after');
    return res.status(200).json({ message: 'successful' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const renameFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const folderName = req.body.folder_name;
    if (!folderName) {
      return res.status(400).json({ error: 'Folder name is required' });
    }
    const folder = await Folders.findOne({ _id: folderId, user: req.userId });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    folder.folder_name = folderName;
    await folder.save();
    return res.status(200).json({ message: 'successful' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
