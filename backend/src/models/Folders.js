import mongoose from 'mongoose';
import { unlink } from 'node:fs';
const foldersSchema = new mongoose.Schema({
  folder_name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parent_folder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Folders' },
  home_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

foldersSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    try {
      const deleteFolderId = this._id;
      const userId = this.user;
      const Files = mongoose.model('Files');
      const Folders = this.constructor;
      const childFolders = await Folders.find({
        user: userId,
        parent_folder_id: deleteFolderId,
      });
      for (const child of childFolders) {
        await child.deleteOne();
      }
      const files = await Files.find({
        user: userId,
        parent_folder_id: deleteFolderId,
      });
      for (const file of files) {
        unlink(file.server_path, (err) => {
          if (err) throw err;
          console.log('deletion successful from /uploads');
        });
        await file.deleteOne();
      }
      console.log('hello');
    } catch (err) {
      next(err);
    }
  }
);

const Folders = mongoose.model('Folders', foldersSchema);
export default Folders;
