import Files from '../models/Files.js';
import path from 'node:path';
import { unlink } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import Folders from '../models/Folders.js';

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

    const { error } = await supabase.storage
      .from('myDrive')
      .upload(uploadFilePath);

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
      const server_path = path.join(
        process.cwd(),
        'uploads',
        `${new_file._id}${ext}`
      );

      new_file.server_path = server_path;
      await new_file.save();
      // Move the uploaded file to the new path (with extension)
      await file.mv(new_file.server_path);

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
      unlink(file.server_path, (err) => {
        if (err) {
          console.error('Error deleting file from disk:', err);
        } else {
          console.log('delete operatoin successful');
        }
      });
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
    return res.download(file.server_path, file.file_name);
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
    console.log('Viewing file:', {
      id: req.params.id,
      path: file.server_path,
      mime: file.mimetype,
    });
    // Use sendFile with explicit headers; file now includes extension so Express infers MIME type correctly
    res.sendFile(file.server_path, {
      headers: {
        'Content-Type': file.mimetype || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${file.file_name}"`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
