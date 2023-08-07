const jwt = require('jsonwebtoken');

function createUserToken(user,req,res) {

    const token = jwt.sign({
        name:user.nome,
        id:user._id
    },'nossosecret');

    res.status(200).json({
        message:"Usuario logado com sucesso",
        token:token,
        id:user._id
    })
}

module.exports = createUserToken;