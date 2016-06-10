var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource'); // Placeholder for users page
}); // End users index route and fnc

module.exports = router;
