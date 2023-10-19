var express = require('express');
var router = express.Router();
const ctrl = require('./main.ctrl');

router.post('/', ctrl.process.main);
router.post('/hashtag', ctrl.process.hashtag);

module.exports = router;