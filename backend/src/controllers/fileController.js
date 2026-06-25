import Files from '../models/Files.js';
import path from 'node:path';
import { unlink } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import Folders from '../models/Folders.js';
import supabase from '../config/supabase.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length == 0 || !req.files.ufile) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const uploadedFiles = Array.isArray(req.files.ufile)
      ? req.files.ufile
      : [req.files.ufile];

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

    const uploadsDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const savedFiles = [];

    for (const file of uploadedFiles) {
      const new_file = await Files.create({
        file_name: file.name,
        user: req.userId,
        parent_folder_id: parentFolderId,
        server_path: null,
        size: file.size,
        mimetype: file.mimetype,
      });

      // Determine file extension from original filename
      const ext = path.extname(file.name) || '';
      const storagePath = `users/${req.userId}/${new_file._id}${ext}`;
      const { data, error } = await supabase.storage
        .from('myDrive')
        .upload(storagePath, file.data, {
          contentType: file.mimetype,
          upsert: false,
        });

      new_file.server_path = storagePath;
      await new_file.save();
      savedFiles.push(new_file);
    }

    return res
      .status(201)
      .json({ message: 'Files upload successful', files: savedFiles });
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
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    console.log(file.server_path);
    if (file.server_path) {
      const { data, error } = await supabase.storage
        .from('myDrive')
        .remove([file.server_path]);
    }
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

    const { data, error } = await supabase.storage
      .from('myDrive')
      .createSignedUrl(file.server_path, 60, {
        download: file.file_name,
      });

    if (error) throw error;

    return res.status(200).json({ url: data.signedUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const viewFile = async (req, res) => {
  try {
    const file = await Files.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!file) {
      return res.status(404).json({ error: 'file not found' });
    }

    const { data, error } = await supabase.storage
      .from('myDrive')
      .createSignedUrl(file.server_path, 600);

    if (error) throw error;

    return res.status(200).json({ url: data.signedUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
