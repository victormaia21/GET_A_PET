const {Schema} = require('mongoose');
const conn = require('../db/conn');

const Pet = conn.model(
    'Pet',
    new Schema({
        nome:{
            type:String,
            required:true
        },
        idade:{
            type:Number,
            required:true,
        },
        comprimento:{
            type:Number,
            required:true
        },
        cor:{
            type:String,
            required:true
        },
        imagens:{
            type:Array,
            required:true
        },
        disponivel:{
            type:Boolean,
            required:true
        },
        usuario:Object,
        adotador:Object
    },{timestamps:true})
)

module.exports = Pet;