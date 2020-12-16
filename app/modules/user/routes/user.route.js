const express = require('express');
const router = express.Router();

const { test, postregister, login } = require('../controllers/user.controller');
const { protect, authorize } = require('../../../middleware/auth');

router.get('/', protect, test);
router.post('/register', postregister);
router.post('/login', login);

module.exports = router;