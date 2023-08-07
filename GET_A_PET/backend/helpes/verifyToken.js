const jwt = require('jsonwebtoken');
const getToken = require('./getToken');

function verifyToken(req,res,next) {
    if(!req.headers.authorization) {
        return res.status(422).json({message:"Token invalido"});
    }

    const token = getToken(req);
    if(!token) {
        return res.status(422).json({message:"Token invalido"});
    }

    try {
        const decodifid = jwt.decode(token,'nossosecret');
        req.user = decodifid;
        next();
    } catch(err) {
        res.status(500).json({message:"Erro de servidor"});
    }
}

module.exports = verifyToken;