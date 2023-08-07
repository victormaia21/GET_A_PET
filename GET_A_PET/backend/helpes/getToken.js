function getToken(req) {
    const tokenModificado = req.headers.authorization;
    const token = tokenModificado.split(' ')[1];
    return token;
}

module.exports = getToken;