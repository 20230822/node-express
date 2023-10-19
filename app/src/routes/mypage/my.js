var express = require('express');
var router = express.Router();
const ctrl = require('./my.ctrl');

router.post('/', ctrl.process.mypage);
router.post('/cart', ctrl.process.cart);
router.post('/wishlist', ctrl.process.wishlist);
router.post('/recommended', ctrl.process.recommended);
router.post('/order', ctrl.process.order);

router.put('/edit', ctrl.update.edit);

router.delete('/cart', ctrl.del.cart);
router.delete('/wishlist', ctrl.del.wishlist);

module.exports = router;