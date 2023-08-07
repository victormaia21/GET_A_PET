const {Schema} = require('mongoose');
const conn = require('../db/conn');

const User = conn.model(
    'User',
    new Schema({
        nome:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        senha:{
            type:String,
            required:true
        },
        telefone:{
            type:String,
            required:true
        },
        foto:{
            type:String
        }
    },{timestamps:true})
)

module.exports = User;