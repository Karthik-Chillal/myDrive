import Files from '../models/Files.js';
import fileUpload from 'express-fileupload';
import path from 'node:path';
export const uploadFile = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length == 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }
        console.log(process.cwd());
        const uploadedFile = req.files.ufile;
        const uploadFilePath = req.url;
        console.log(uploadFilePath);
        const server_path = path.join(
            process.cwd(),
            'uploads',
            new_file._id.toString()
        );
        const new_file = await Files.create({
            file_name: uploadedFile.name,
            user: req.userId,
            parent_folder_id: req.params.id,
            path: null,
            server_path: server_path,
        });
        new_file.path = `http://localhost:${process.env.PORT}/folders/${parent_folder_id}`;
        await new_file.save();
        await uploadedFile.mv(new_file.server_path);
        return res
            .status(201)
            .json({ message: 'File upload successful', file: new_file });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
