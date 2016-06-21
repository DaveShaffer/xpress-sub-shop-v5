var express = require('express');
var router = express.Router();
var _ = require('lodash');

var User = require('../models/user');

// function saveUpdates(updates) {
//   // return function(entity) {
//   //   var updated = _.merge(entity, updates);
//   console.log(updates);
//     return users.create(updates)
//     // .then(updated => {
//     //   return updated;
//     // }); // End .then
//   // }; // End fnc(entity)
// } // End fnc saveUpdates

function seedUsers() {
  var users = [
    {
      name: 'Bobby',
      item: [],
      price: 0
    },
    {
      name: 'Jenny',
      item: [],
      price: 0
    }
  ];

  User.find({}).remove() // Clear old dbase
  .then(function() {
    return User.create(users); // Build new dbase
  })
  .then(function(found) {
    console.log('Saved ', found.length, ' users'); // Show how many type of items in dbase
  }); // End .then and fnc(found)
} // End seedItems

seedUsers();

// INDEX rt
router.get('/', function(req, res, next) {
  User.find({}) // Read all items in inventory dbase
  .then(function(users) {
    res.json(users); // Display data
  }); // End .then and fnc(items)
}); // End index route and fnc

// // SHOW rt
// router.get('/:id', function(req, res, next) {
//   // console.log(req.body);
//   Item.findById(req.params.id) // Read one item
//   .then(function(item) {
//     if (!item) { // Was item not found?
//       res.status(404).json( { error: 'Not found' } ); // No item, print error mssg
//     } // End if (!item)
//     res.json(item); // Item found
//   }) // End .then and fnc(item)
//   .catch(function(err) {
//     return next(err); // Return error and move on
//   }); // End .catch and fnc(err)
// }); // End show route and fnc

// // UPDATE rt
// router.put('/:id', function(req, res, next) {
//   // console.log(req.body);
//   Item.findById(req.params.id) // Find one item
//   .then(saveUpdates(req.body)) // Send updated info to dbase, end .then
//   .then(function(item) {
//     if (!item) { // Was item not found?
//       res.status(404).json( { error: 'Not found' } ); // No item, display error mssg
//     } // End if (!item)
//     // console.log("line 84 " + item);
//     res.json(item); // Item found
//   }) // End .then and fnc(item)
//   .catch(function(err) {
//     return next(err); // Return error and move on
//   }); // End .catch and fnc(err)
// }); // End update route and fnc

// UPDATE rt
router.post('/', function(req, res, next) {
  // console.log('POST: ', req.body);
  var csr = new User ({
    name: req.body.name,
    item: req.body.item,
    price: req.body.price
  });
  // console.log('CSR: ', csr);
  csr.save(function(err) {
    if (!err) {
      return console.log("Created");
    } else {
      return console.log(err);
    }
  });
  return res.send(csr);
  // return csr.save()
  // return req.body.save()
  // return User.create(req.body);
  // Item.findById(req.params.id) // Find one item
  // .then(saveUpdates(req.body)) // Send updated info to dbase, end .then
  // .then(function(item) {
  //   if (!item) { // Was item not found?
  //     res.status(404).json( { error: 'Not found' } ); // No item, display error mssg
  //   } // End if (!item)
  //   // console.log("line 84 " + item);
  //   res.json(item); // Item found
  // }) // End .then and fnc(item)
  // .catch(function(err) {
  //   return next(err); // Return error and move on
  // }); // End .catch and fnc(err)
}); // End update route and fnc

module.exports = router;
