import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import {
  createFolder,
  createHomeFolders,
  deleteFolder,
  renameFolder,
} from '../controllers/folderController.js';
import { getFolders } from '../controllers/folderController.js';
import { getHomeFolder } from '../controllers/folderController.js';
const folderRouter = express.Router();
folderRouter.get('/home', verifyToken, (req, res) => {
  res.send('home page');
});
folderRouter.get('/', verifyToken, getHomeFolder);
folderRouter.get('/:id', verifyToken, getFolders);
folderRouter.post('/create', verifyToken, createHomeFolders);
folderRouter.post('/:id/create', verifyToken, createFolder);
folderRouter.delete('/:id/delete', verifyToken, deleteFolder);
folderRouter.put('/:id/rename', verifyToken, renameFolder);
export default folderRouter;
