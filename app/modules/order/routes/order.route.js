const express = require('express');
const router = express.Router();

const { orderCreate, orderDetails, orderList, orderDelete, checkout } = require('../controller/order.controller');
const { protect, authorize } = require('../../../middleware/auth');

router.post('/create', protect, orderCreate);
router.get('/:id', protect, orderDetails);
router.delete('/:id', protect, orderDelete);
router.get('/', protect, orderList);
router.get('/checkout/:id', protect, checkout);


module.exports = router;