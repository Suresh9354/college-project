const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');


const {deleteUser, updateUser, createUser , getUsers} = require('../controllers/userController');

router.get('/', verifyToken, verifyRole(['admin', 'staff']), userController.getAllUsers);

// Add new user - Only admin
router.post('/', verifyToken, verifyRole('admin'), createUser);

router.delete('/:id', verifyToken, verifyRole('admin'), deleteUser);

router.put('/:id', verifyToken, verifyRole('admin'), updateUser);

// Add route with pagination
router.get('/', userController.getUsers);





module.exports = router;
