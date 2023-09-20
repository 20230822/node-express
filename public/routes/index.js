var express = require('express');
var router = express.Router();
const ctrl = require('./home.ctrl');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs');
});

router.post('/login', ctrl.process.login ) //로그인 post요청



module.exports = router;
