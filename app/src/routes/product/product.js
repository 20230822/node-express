const express = require('express');
const router = express.Router();
const ctrl = require('./product.ctrl');

router.post('/detailInfo', ctrl.process.detailInfo);
router.post('/setProd', ctrl.process.saveProduct);
// router.patch('/edit', ctrl.process.edit);
router.get('/search', ctrl.process.search);
router.post('/addWishList', ctrl.process.addWishList);  //BODY : 상품 id, 유저토큰
router.post('/addCart', ctrl.process.addCart);
router.delete('/delCart', ctrl.process.delCart);
router.put('/addCartCount', ctrl.process.addCartCount);
module.exports = router;