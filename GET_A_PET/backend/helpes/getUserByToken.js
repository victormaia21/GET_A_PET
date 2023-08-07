const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function getUserByToken(token) {

    if(!token) {
        return res.status(422).json({message:"Token invalido"});   
    }

    const userDecodified = jwt.decode(token,'nossosecret');

    const user = await User.findOne({_id:userDecodified.id})
    return user;
}

module.exports = getUserByToken;