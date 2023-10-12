var express = require('express');
var router = express.Router();
const my = require('./my.ctrl');

router.post('/', my.process.mypage);
router.post('/cart', my.process.cart);
router.post('/wishlist', my.process.wishlist);
router.post('/recommended', my.process.recommended);
router.post('/order', my.process.order);

router.put('/edit', my.update.edit);

// router.delete('/cart')

module.exports = router;