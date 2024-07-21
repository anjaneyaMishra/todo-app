const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    console.log('Authorization Header:', token);

    if (!token) {
        return res.status(401).json({ "message": "Unauthorized User" });
    }

    let jwttoken = token.split(" ")[1];
    console.log('JWT Token:', jwttoken);

    try {
        let decodedData = jwt.verify(jwttoken, process.env.JWT_SECRET);
        console.log('Decoded Data:', decodedData);
        req.user = decodedData.user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ "message": "Invalid Token" });
    }
};
