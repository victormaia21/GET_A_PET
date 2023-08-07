const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://0.0.0.0:27017/getapet2');
    console.log('MongoDB conectado com sucesso');
}

main().catch((err) => console.log(err));

module.exports = mongoose;