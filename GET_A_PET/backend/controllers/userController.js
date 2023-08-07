const bcrypt = require('bcrypt');
const User = require('../models/User');
const createUserToken = require('../helpes/createUserToken');
const getToken = require('../helpes/getToken');
const jwt = require('jsonwebtoken');
const getUserByToken = require('../helpes/getUserByToken');
const { isValidObjectId } = require('../db/conn');
const Pet = require('../models/Pet');

module.exports = class userController {

    static async registrar(req,res) {
        const {nome,email,senha,telefone,confirmaçaodesenha} = req.body;
        let image = ''
        if(req.file) {
            image = req.file.filename;
        }

        if(!nome) {
            return res.status(422).json({message:"Nome obrigatorio!"});
        }
        if(!email) {
            return res.status(422).json({message:"Email obrigatorio"});
        }

        const emailExiste = await User.findOne({email:email});

        if(emailExiste) {
            return res.status(422).json(
                {message:"Já existe uma conta utilizando esse email, por favor troque para outro"}
                );
        }
        if(!telefone) {
            return res.status(422).json({message:"Telefone obrigatorio"});
        }

        if(!senha) {
            return res.status(422).json({message:"Senha obrigatoria"});
        }
        if(senha !== confirmaçaodesenha) {
            return res.status(422).json({message:"As senhas precisão está iguais"})
        }
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(senha,salt);

        

        try {
            let user = null;
            if(image) {
                user = await User.create({nome,email,senha:hashPassword,telefone,foto:image});
            } else {
                user = await User.create({nome,email,senha:hashPassword,telefone});
            }
            createUserToken(user,req,res);
        } catch(err) {
            res.status(400).json({message:"Por algum motivo, não conseguimos criar o usuario, tente novamente"})
        }   
    }

    static async logar(req,res) {
        const {email,senha} = req.body;

        if(!email) {
            return res.status(422).json({message:"Por favor, digite o email"})
        }
        const emailExiste = await User.findOne({email:email});

        if(!emailExiste) {
            return res.status(422).json({message:"Email inexistente, por favor digite novamente"})
        }
        if(!senha) {
            return res.status(422).json({message:"Por favor, digite a senha"})
        }

        const senhaValida = await bcrypt.compare(senha,emailExiste.senha);

        if(!senhaValida) {
            return res.status(422).json({message:"Senha invalida, por favor digite novamente"});
        }

        createUserToken(emailExiste,req,res);
    }
    static async getUserById(req,res) {
        const {id} = req.params;

        if(!isValidObjectId(id)) {
            return res.status(422).json({message:"ID INVALIDO"});
        }
        const user = await User.findById(id)

        if(!user) {
            return res.status(422).json({message:"Usuario não encontrado"});
        }

        res.status(200).send(user);

        
    }
    static async myUser(req,res) {
        const token = getToken(req);
        let user;
        if(token) {
            const decode = jwt.decode(token,'nossosecret');
            user = await User.findOne({_id:decode.id});
            user.senha = undefined;
        }
        res.status(200).send(user);
    }

    static async updateUser(req,res) {
        const {nome,email,senha,confirmacaodesenha,telefone} = req.body;
        let foto = '';
        

        if(!email) {
            return res.status(422).json({message:"Email obrigatorio"});
        }
        const token = getToken(req)
        const usuarioAtual = await getUserByToken(token);
        const possivelUsuarioNovo = await User.findOne({email:email});

        if(email != usuarioAtual.email && possivelUsuarioNovo) {
            return res.status(422).json({message:"Já existe alguém utilizando este email, por favor digite outro"})
        }
        usuarioAtual.email = email;

        if(!nome) {
            return res.status(422).json({message:"Nome obrigatorio"});
        }
        usuarioAtual.nome = nome

        if(!senha) {
            return res.status(422).json({message:"Senha obrigatoria"});
        }
        if(!confirmacaodesenha) {
            return res.status(422).json({message:"Confirmação de senha obrigatoria"});
        }
        if(senha !== confirmacaodesenha) {
            return res.status(422).json({message:"As senhas precisão está iguais"});
        }
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(senha,salt);
        usuarioAtual.senha = hashPassword;

        if(!telefone) {
            return res.status(422).json({message:"Numero de telefone é obrigatorio"});
        }
        usuarioAtual.telefone = telefone;

        if(req.file) {
            foto = req.file.filename;
            usuarioAtual.foto = foto;
        }

        try {
            const newUser = await User.findOneAndUpdate({_id:usuarioAtual._id},{$set:usuarioAtual},{new:true})
            res.status(200).json({
                message:"Usuario atualizado com sucesso",
                user:newUser
            });
        } catch(err) {
            res.status(500).json({message:err});
        }
    }

    static async deleteUser(req,res) {
        const {id} = req.params;

        if(!isValidObjectId(id)) {
            return res.status(422).json({message:"ID INVALIDO!"});
        }

        const userId = await User.findById(id);

        if(!userId) {
            return res.status(422).json({message:"Usuario não existente"})
        }
        const token = getToken(req);
        const userToken = await getUserByToken(token);

        if(userId._id.toString() != userToken._id.toString()) {
            return res.status(422).json({message:"Está não é a sua conta!"})
        }

        try {
            await User.findOneAndDelete({_id:userId._id});
            res.status(422).json({message:"Usuario deletado com sucesso com seus pets!"});
        } catch(err) {
            return res.status(500).json({message:err});
        }
    }
}