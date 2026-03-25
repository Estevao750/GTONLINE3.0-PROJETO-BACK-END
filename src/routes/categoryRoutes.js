const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', CategoryController.getAll);

router.get('/:id', CategoryController.getById);

router.post('/', adminMiddleware, CategoryController.create);

router.put('/:id', adminMiddleware, CategoryController.update);

router.delete('/:id', adminMiddleware, CategoryController.delete);

module.exports = router;
