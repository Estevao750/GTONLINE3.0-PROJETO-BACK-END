const express = require('express');
const ProductController = require('../controllers/ProductController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', ProductController.getAll);

router.get('/:id', ProductController.getById);

router.post('/', adminMiddleware, ProductController.create);

router.put('/:id', adminMiddleware, ProductController.update);

router.delete('/:id', adminMiddleware, ProductController.delete);

module.exports = router;
