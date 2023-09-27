var express = require('express');
var router = express.Router();
const ctrl = require('./home.ctrl');
const my = require('./my.ctrl');

router.post('/login', ctrl.process.login ); //로그인 post요청
router.post('/register', ctrl.process.register);
router.post('/mypage/cart', my.process.cart);

router.get('/accesstoken',ctrl.process.accessToken);
router.get('/refreshtoken',ctrl.process.refreshToken);
router.get('/login/success', ctrl.process.loginSuccess);
router.get('/logout',ctrl.process.logout);

module.exports = router;
