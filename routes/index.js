var express = require('express');
var router = express.Router();

/* GET original home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); // End index route and fnc

module.exports = router;
