import mongoose from 'mongoose';

const filesSchema = new mongoose.Schema({
    file_name: { type: String, required: true },
    path: { type: String, default: '/home' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parent_folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folders', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Files = mongoose.model('Files', filesSchema);
export default Files;
