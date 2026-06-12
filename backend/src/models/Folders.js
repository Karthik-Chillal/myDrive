import mongoose from 'mongoose';

const foldersSchema = new mongoose.Schema({
    folder_name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parent_folder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Folders' },
    home_id: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Folders = mongoose.model('Folders', foldersSchema);
export default Folders;
