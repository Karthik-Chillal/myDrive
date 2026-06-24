import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const SharedSchema = new mongoose.Schema({
  fileId: { type: ObjectId },
  ownerId: { type: ObjectId },
  sharedWith: [ObjectId],
  permissions: 'read',
});

const Shared = mongoose.model('Shared', SharedSchema);
export default Shared;
