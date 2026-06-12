import { Router } from 'express';
import { uploadFile } from '../controllers/fileController.js';
import verifyToken from '../middleware/authMiddleware.js';
const fileRouter = Router();
// fileRouter.post('/:id/upload', verifyToken, uploadFile);
export { fileRouter };
