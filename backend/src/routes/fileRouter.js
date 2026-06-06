import { Router } from 'express';
const fileRouter = Router();
fileRouter.post('/upload', (req, res) => {
    console.log(req.files);

    return res.status(200).json({ message: 'success' });
});
export { fileRouter };
