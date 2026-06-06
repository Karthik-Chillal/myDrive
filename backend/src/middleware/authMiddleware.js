import jwt from 'jsonwebtoken';
import 'dotenv/config';
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access Denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: 'Invalid Token' });
    }
}
export default verifyToken;
