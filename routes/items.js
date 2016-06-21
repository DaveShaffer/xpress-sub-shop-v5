var express = require('express');
var router = express.Router();
var _ = require('lodash');

var Item = require('../models/item');

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
    .then(updated => {
      return updated;
    }); // End .then
  }; // End fnc(entity)
} // End fnc saveUpdates

function seedItems() {
var items = [
        {
        name: 'Ham and Cheese Submarine',
        price: 4.50,
        qty: 50,
        quantity: 1,
        serving: 1,
        delDate: 1466500076000,
        age: 0,
        shelfLife: 2
      }, // End obj
      {
        name: 'Chips',
        price: 1.00,
        qty: 200,
        serving: 1,
        delDate: 1466500076000,
        age: 0,
        shelfLife: 365
      }, // End obj
      {
        name: 'Pepsi',
        price: 2.50,
        qty: 1000,
        serving: 1,
        delDate: 1466500076000,
        age: 0,
        shelfLife: 700
      } // End obj
  ]; // End item list

  Item.find({}).remove() // Clear old dbase
  .then(function() {
    return Item.create(items); // Build new dbase
  })
  .then(function(found) {
    console.log('Saved ', found.length, ' items'); // Show how many type of items in dbase
  }); // End .then and fnc(found)
} // End seedItems

seedItems(); // Rebuild new dbase for dev env

// INDEX rt
router.get('/', function(req, res, next) {
  Item.find({}) // Read all items in inventory dbase
  .then(function(items) {
    res.json(items); // Display data
  }); // End .then and fnc(items)
}); // End index route and fnc

// SHOW rt
router.get('/:id', function(req, res, next) {
  Item.findById(req.params.id) // Read one item
  .then(function(item) {
    if (!item) { // Was item not found?
      res.status(404).json( { error: 'Not found' } ); // No item, print error mssg
    } // End if (!item)
    res.json(item); // Item found
  }) // End .then and fnc(item)
  .catch(function(err) {
    return next(err); // Return error and move on
  }); // End .catch and fnc(err)
}); // End show route and fnc

// UPDATE rt
router.put('/:id', function(req, res, next) {
  Item.findById(req.params.id) // Find one item
  .then(saveUpdates(req.body)) // Send updated info to dbase, end .then
  .then(function(item) {
    if (!item) { // Was item not found?
      res.status(404).json( { error: 'Not found' } ); // No item, display error mssg
    } // End if (!item)
    res.json(item); // Item found
  }) // End .then and fnc(item)
  .catch(function(err) {
    return next(err); // Return error and move on
  }); // End .catch and fnc(err)
}); // End update route and fnc

module.exports = router;
