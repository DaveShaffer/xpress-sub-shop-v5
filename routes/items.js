var express = require('express');
var router = express.Router();
var _ = require('lodash');
// var controller = require('../public/client');

var Item = require('../models/item');


function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function seedItems() {
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

  Item.find({}).remove()
  .then(function() {
    return Item.create(items);
  })
  .then(function() {
    return Item.find({});
  })
  .then(function(found) {
    console.log('Saved ', found.length, ' items');
  });
}

seedItems();

// INDEX rt
router.get('/', function(req, res, next) {
  Item.find({})
  .then(function(items) {
    res.json(items);
  });
});

// SHOW rt
router.get('/:id', function(req, res, next) {
  console.log(req.body);
  Item.findById(req.params.id)
  .then(function(item) {
    if (!item) {
      res.status(404).json( { error: 'Not found' } );
    }
    res.json(item);
  })
  .catch(function(err) {
    return next(err);
  });
});

// UPDATE rt
router.put('/:id', function(req, res, next) {
  console.log(req.body);
  Item.findById(req.params.id)
  .then(saveUpdates(req.body))
  .then(function(item) {
    if (!item) {
      res.status(404).json( { error: 'Not found' } );
    }
    console.log("line 84 " + item);
    res.json(item);
  })
  .catch(function(err) {
    return next(err);
  });
});

module.exports = router;
