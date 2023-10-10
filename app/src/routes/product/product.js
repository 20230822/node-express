const express = require('express');
const router = express.Router();
const ctrl = require('./product.ctrl');

router.post('/detailInfo', ctrl.process.detailInfo);
router.post('/setProd', ctrl.process.saveProduct);
// router.patch('/edit', ctrl.process.edit);
router.get('/search', ctrl.process.search);
module.exports = router;