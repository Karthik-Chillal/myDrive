import { Router } from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { search } from '../controllers/searchController.js';
const searchRouter = Router();

searchRouter.get('/:folderId/search', verifyToken, search);

export default searchRouter;
