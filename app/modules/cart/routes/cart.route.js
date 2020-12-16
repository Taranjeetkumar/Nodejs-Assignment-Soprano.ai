const express = require('express');
const router = express.Router();

const { addProductToCart, getCart, removeItemCart, deleteCart } = require('../controller/cart.controller');
const { protect, authorize } = require('../../../middleware/auth');


router.post('/:id', protect, addProductToCart);
router.get('/', protect, getCart);
router.delete('/:id', protect, deleteCart);


module.exports = router;