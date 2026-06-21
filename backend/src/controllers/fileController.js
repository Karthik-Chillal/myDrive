import Files from '../models/Files.js';
import path from 'node:path';
import { unlink } from 'node:fs';
import Folders from '../models/Folders.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length == 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
    const uploadedFile = req.files.ufile;
    const uploadFilePath = req.url;
    console.log(uploadFilePath);

    let parentFolderId = req.params.id;
    if (parentFolderId === 'home') {
      const homeFolder = await Folders.findOne({
        user: req.userId,
        home_id: process.env.HOME,
      });
      if (!homeFolder) {
        return res.status(400).json({ error: 'Home folder not found' });
      }
      parentFolderId = homeFolder._id;
    }

    const new_file = await Files.create({
      file_name: uploadedFile.name,
      user: req.userId,
      parent_folder_id: parentFolderId,
      server_path: null,
      size: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
    });
    const server_path = path.join(
      process.cwd(),
      'uploads',
      new_file._id.toString()
    );
    new_file.server_path = server_path;
    await new_file.save();
    await uploadedFile.mv(new_file.server_path);
    return res
      .status(201)
      .json({ message: 'File upload successful', file: new_file });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message || err });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await Files.findOne({
      user: req.userId,
      _id: req.params.id,
    });
    console.log(file.server_path);
    unlink(file.server_path, (err) => {
      if (err) throw err;
      console.log('delete operatoin successful');
    });
    await file.deleteOne();
    return res.status(200).json({ message: 'deletion successful' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await Files.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    return res.download(file.server_path, file.file_name);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
