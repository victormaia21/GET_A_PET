const router = require('express').Router();
const petController = require('../controllers/petController');
const {imageUpload} = require('../helpes/image-upload');
const verifyToken = require('../helpes/verifyToken');

router.get('/',petController.showPets);
router.post('/create',verifyToken,imageUpload.array('imagens'),petController.createPet);
router.get('/mypets',verifyToken,petController.myPets);
router.get('/petadoptions',verifyToken,petController.petAdoptions);
router.get('/:id',petController.getPetById);
router.get('/pet/:id',petController.getPetByName);
router.patch('/adoption/:id',verifyToken,petController.adoption)
router.patch('/edit/:id',verifyToken,imageUpload.array('imagens'),petController.editPet);
router.delete('/delete/:id',verifyToken,petController.removePet);

module.exports = router;