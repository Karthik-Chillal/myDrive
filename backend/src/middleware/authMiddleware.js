import jwt from 'jsonwebtoken';
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access Denied' });
    try {
        const decoded = jwt.verify(token, 'secret-key');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.log(err);
    }
}
export default verifyToken;
