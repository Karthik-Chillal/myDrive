import { Router } from 'express';
import {
  deleteFile,
  uploadFile,
  downloadFile,
} from '../controllers/fileController.js';
import verifyToken from '../middleware/authMiddleware.js';
import fileUpload from 'express-fileupload';
const fileRouter = Router();
fileRouter.post(
  '/:id/upload',
  verifyToken,
  fileUpload({ limits: { fileSize: 1 * 1024 * 1024 * 1024 } }),
  uploadFile
);
fileRouter.delete('/:id/delete', verifyToken, deleteFile);
fileRouter.get('/:id/download', verifyToken, downloadFile);
export { fileRouter };
