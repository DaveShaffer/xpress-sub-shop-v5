var express = require('express');
var router = express.Router();

var items = [
        {
        name: 'Cheese Burger',
        price: 3.50,
        qty: 3,
        quantity: 1,
        serving: 1,
        delDate: 1465200076000,
        age: 0,
        shelfLife: 7
      },
      {
        name: 'Chips',
        price: 1.00,
        qty: 200,
        serving: 1,
        delDate: 1465200076000,
        age: 0,
        shelfLife: 365
      },
      {
        name: 'Pepsi',
        price: 2.50,
        qty: 1000,
        serving: 1,
        delDate: 1465200076000,
        age: 0,
        shelfLife: 700
      }
  ];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(items);
});

module.exports = router;
