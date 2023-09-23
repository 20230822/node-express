var express = require('express');
var router = express.Router();
const ctrl = require('./home.ctrl');



/* GET home page. */
router.get('/', ctrl.output.home);
router.get('/login', ctrl.output.login);

router.post('/login', ctrl.process.login ); //로그인 post요청
router.post('/register', ctrl.process.register);
router.get('/accesstoken',ctrl.process.accessToken);
router.get('/refreshtoken',ctrl.process.refreshToken);
router.get('/login/success', ctrl.process.loginSuccess);
router.get('/logout',ctrl.process.logout);

module.exports = router;
