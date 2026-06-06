import mongoose from 'mongoose';

const foldersSchema = new mongoose.Schema({
    folder_name: { type: String, required: true },
    user: { type: null },
    parent_folder: { type: mongoose.Schema.Types.ObjectId },
    createdAt: { type: Date, required: true },
});

const Folders = mongoose.model('Folders', foldersSchema);
export default Folders;
