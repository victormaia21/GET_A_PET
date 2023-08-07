const { isValidObjectId } = require('../db/conn');
const getToken = require('../helpes/getToken');
const getUserByToken = require('../helpes/getUserByToken');
const Pet = require('../models/Pet');
const User = require('../models/User');

module.exports = class petController {
    static async showPets(req,res) {
        const pets = await Pet.find().sort('-createdAt');

        if(!pets) {
            return res.status(422).json({message:"Ainda não existe pets registrado"});
        }

        res.status(200).json({pets});
    }

    static async createPet(req,res) {
        const {nome,idade,comprimento,cor} = req.body;
        
        const disponivel = true;
        
        const imagens = req.files
        
        if(!nome) {
            return res.status(422).json({message:"Nome é obrigatorio"});
        }
        if(!idade) {
            return res.status(422).json({message:"Idade é obrigatorio"});
        }
        if(!comprimento) {
            return res.status(422).json({message:"Comprimento é obrigatorio"});
        }
        if(!cor) {
            return res.status(422).json({message:"Cor é obrigatorio"});
        }
        if(!imagens) {
            return res.status(422).json({message:"Imagens é obrigatoria"});
        }
        if(imagens.length === 0) {
            return res.status(422).json({message:"É necessario colocar pelo menos uma foto"});
        }
        const token = getToken(req);
        const user = await getUserByToken(token);
        const pet = {
            nome,
            idade,
            comprimento,
            cor,
            imagens:[],
            disponivel,
            usuario:{
                _id:user._id,
                nome:user.nome,
                telefone:user.telefone,
                foto:user.foto
            }
        }

        imagens.map((image) => {
            pet.imagens.push(image.filename)
        })

        try {
            const newPet = await Pet.create(pet)
            res.status(200).json({
                message:"Pet criado com sucesso",
                newPet
            })
        } catch(err) {
            res.status(500).json({message:err});
        }
    }

    static async getPetById(req,res) {
        const {id} = req.params;

        if(!isValidObjectId(id)) {
            return res.status(422).json({message:"ID INVALIDO"});
        }
        const pet = await Pet.findById(id);

        if(!pet) {
            return res.status(422).json({message:"Pet não existente"});
        }

        res.status(200).json({pet});
    }

    static async editPet(req,res) {
        const {nome,idade,comprimento,cor} = req.body;
        const {id} = req.params;
        const imagens = req.files;


        const token = getToken(req);
        const user = await getUserByToken(token);

        const pet = await Pet.findById(id);
        if(!isValidObjectId(id)) {
            return res.status(422).json({message:"ID INVALIDO"});
        }
        if(!pet) {
            return res.status(422).json({message:"Pet não existente"});
        }
        const userId = user._id.toString();
        const petUserId = pet.usuario._id.toString();

        if(userId !== petUserId) {
            return res.status(422).json({message:"Esté pet não pertence a você"});
        }
        if(!nome) {
            return res.status(422).json({message:"Nome é obrigatorio"});
        }
        if(!idade) {
            return res.status(422).json({message:"Idade é obrigatorio"});
        }
        if(!comprimento) {
            return res.status(422).json({message:"Comprimento é obrigatorio"});
        }
        if(!cor) {
            return res.status(422).json({message:"Cor é obrigatorio"});
        }
        if(imagens.length === 0) {
            return res.status(422).json({message:"É obrigatorio por pelo menos uma imagem"});
        }

        const newPet = {
            nome,
            idade,
            comprimento,
            cor,
            imagens:[]
        }

        imagens.map((image) => {
            newPet.imagens.push(image.filename)
        })

        try {
            const petUpdate = await Pet.findOneAndUpdate({_id:pet._id},{$set:newPet},{new:true});
            res.status(200).json({
                message:"Pet atualizado com sucesso",
                petUpdate
            })
        } catch(err) {
            res.status(500).json({message:err});
        }
    }
    
    static async removePet(req,res) {
        const {id} = req.params;

        if(!isValidObjectId(id)) {
            return res.status(422).json({message:"ID INVALIDO"});
        }
        
        const pet = await Pet.findById(id);

        if(!pet) {
            return res.status(422).json({message:"Pet não existente"});
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        const petUserId = pet.usuario._id.toString();
        const userId = user._id.toString();

        if(petUserId !== userId) {
            return res.status(422).json({message:"Esté pet não pertence a você"});
        }

        try {
            await Pet.findOneAndDelete({_id:pet._id});
            res.status(200).json({message:"Pet removido com sucesso"});
        } catch(err) {
            res.status(500).json({message:err});
        }
    }

    static async myPets(req,res) {
        const token = getToken(req);
        const user = await getUserByToken(token);
        const pets = (await Pet.find({'usuario._id':user._id}).sort('-createdAt'));
        
        if(!pets) {
            return res.status(422).json({message:"Você ainda não têm pets cadastrados"})
        }

        res.status(200).json({pets});
    }

    static async getPetByName(req,res) {
        const {id} = req.params;

        const pet = (await Pet.find({nome:{'$regex':id}}).sort('-createdAt'))

        if(!pet) {
            return res.status(200).json({message:"Não existe nenhum pet com esse nome!"});
        }

        res.status(200).json({pet})
    }

    static async adoption(req,res) {
        const {id} = req.params;
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(!isValidObjectId(id)) {
            return res.status(422).json({message:"ID INVALIDO!"})
        }
        const pet = await Pet.findById(id);

        if(!pet) {
            return res.status(422).json({message:"Pet não existente"});
        }

        const userId = user._id.toString();
        const petUserId = pet.usuario._id.toString();

        if(userId === petUserId) {
            return res.status(422).json({message:"Você não pode adotar seu proprio pet"});
        }
        
        const adotador = {
            _id:user._id,
            nome:user.nome,
            email:user.email,
            telefone:user.telefone,
            foto:user.foto
        }

        pet.adotador = adotador;
        pet.disponivel = false;
        
        try {
            const petAdopted = await Pet.findOneAndUpdate({_id:pet._id},{$set:pet},{new:true});
            res.status(200).json({
                message:`Pet adotado, por favor fale com ${pet.usuario.nome} pelo numero ${pet.usuario.telefone}`,
                petAdopted
            })
        } catch(err) {
            res.status(500).json({message:err});
        }
    }

    static async petAdoptions(req,res) {
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({'adotador._id':user._id});

        if(!pets) {
            res.status(422).json({message:"Você não têm pets adotado"});
        }

        res.status(200).json({pets});
    }
}