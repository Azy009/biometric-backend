const express = require('express');
const router = express.Router();
const { uploadFields } = require('../middlewares/upload');
const { registerUser, getUsers, deleteUser } = require('../controllers/userController');

router.post('/register', uploadFields, registerUser);
router.get('/', getUsers);
router.delete('/:id', deleteUser);

module.exports = router;