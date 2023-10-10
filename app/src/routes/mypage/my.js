var express = require('express');
var router = express.Router();
const my = require('./my.ctrl');

router.post('/', my.process.mypage);
router.post('/cart', my.process.cart);
router.post('/wishlist', my.process.wishlist);
router.post('/recommended', my.process.recommended);
router.post('/order', my.process.order);
router.post('/edit', my.process.edit);

module.exports = router;