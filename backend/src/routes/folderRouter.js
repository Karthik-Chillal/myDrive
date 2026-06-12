import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { createFolder } from '../controllers/folderController.js';
import { getFolders } from '../controllers/folderController.js';
import { getHomeFolder } from '../controllers/folderController.js';
const folderRouter = express.Router();
folderRouter.get('/home', verifyToken, (req, res) => {
    res.send('home page');
});
folderRouter.get('/', verifyToken, getHomeFolder);
folderRouter.get('/:id', getFolders);
folderRouter.post('/:id/create', createFolder);
export default folderRouter;
