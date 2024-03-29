var express = require('express');
var router = express.Router();
const ctrl = require('./user.ctrl');

router.post('/login', ctrl.process.login ); //로그인 post요청
router.post('/register', ctrl.process.register);
router.post('/notice', ctrl.process.notice);
router.post('/notice/detail', ctrl.process.detail);

router.get('/accesstoken',ctrl.process.accessToken);
router.get('/refreshtoken',ctrl.process.refreshToken);
router.get('/login/success', ctrl.process.loginSuccess);
router.get('/logout',ctrl.process.logout);

module.exports = router;
