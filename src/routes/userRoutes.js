const express = require('express');
const UserController = require('../controllers/UserController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/login', UserController.login);

router.post('/register', UserController.create);

router.get('/:id', authMiddleware, UserController.getById);

router.get('/', authMiddleware, UserController.getAll);

router.put('/:id', authMiddleware, UserController.update);

router.delete('/:id', authMiddleware, UserController.delete);

module.exports = router;
