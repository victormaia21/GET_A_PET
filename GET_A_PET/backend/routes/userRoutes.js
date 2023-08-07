const router = require('express').Router();
const userController = require('../controllers/userController');
const {imageUpload} = require('../helpes/image-upload');
const verifyToken = require('../helpes/verifyToken');

router.post('/register',imageUpload.single('foto') ,userController.registrar);
router.post('/login',userController.logar);
router.get('/myuser',verifyToken,userController.myUser);
router.patch('/update',verifyToken,imageUpload.single('foto'),userController.updateUser);
router.delete('/delete/:id',verifyToken,userController.deleteUser)

module.exports = router;