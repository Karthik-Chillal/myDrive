import mongoose from 'mongoose';

const filesSchema = new mongoose.Schema({
    file_name: { type: String, required: true },
    path: { type: String, default: '/home' },
    server_path: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parent_folder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folders',
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    mimetype: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

const Files = mongoose.model('Files', filesSchema);
export default Files;
