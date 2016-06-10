angular.module('subShopApp', ['ui.router']);

angular
  .module('subShopApp')
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise("/home"); // Go to home page if no route found
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html"
    }) // Home page
    .state('items', {
       url: "/items",
      templateUrl: "views/items.html",
      controller: "itemsCtrl",
      controllerAs: "ctrl"
    }) // Menu page
    .state('itemsShow', {
      url: "/items/:itemId",
      templateUrl: "views/items-show.html",
      controller: "itemsShowCtrl",
      controllerAs: "ctrl"
    }); // Page for each menu item
  }); // End $stateProvider

angular
  .module('subShopApp')
  .controller('itemsCtrl', function($http) {

    var ctrl = this;
    ctrl.items = []; // Items for the menu page
    ctrl.order = []; // Customer's order

    function findItemById(items, id) {
      // console.log('findItemById', id);
      return _.find(items, function(item) {
        // console.log('findItemById2', item._id, id)
        return item._id === id;
      }); // End _.find and fnc(item)
    } // End fnc findItemById

    ctrl.getItems = function() {
      $http.get('/api/items') // Read inventory dbase
      .then(function(res) {
        ctrl.items = res.data; // Load menu array with inventory objects
      }); // End .then and fnc(res)
    }; // End fnc getItems


    ctrl.addItem = function(item) {
      item.qty -= 1; // Remove item from inventory dbase
      var found = findItemById(ctrl.order, item._id);
      // console.log('addItem', item._id, found);
      if (found) { // Is item already in order?
        found.quantity += item.serving; // Item already in order, increase number of items
      } else { // cntl.order.quantity???????????
        ctrl.order.push(angular.copy(item)); // Item not in order, add item to order
      } // End if (found)
      // console.log('hello', item, ctrl.order);
      return $http.put('/api/items/' + item._id, item); // Update inventory dbase
    }; // End fnc addItem

    ctrl.removeItem = function(item) {
      var index = ctrl.order.indexOf(item); // Locate item in order
       var dish = findItemById(ctrl.order, item._id); // ID item ????????
      dish.qty += 1; // Put item back in inventory dbase
      // console.log(index, item);
      ctrl.order[index].quantity -= 1; // Remove one item
      if (ctrl.order[index].quantity == 0) { // Are all items gone?
        ctrl.order.splice(index, 1); // All items gone, remove item object from order
      }; // End if all items are gone
    }; // End fnc removeItem

    ctrl.getCost = function(item) {
      return item.quantity * item.price; // Compute total cost of each item in order
    }; // End fnc getCost

    ctrl.getTotal = function() {
      var totalPrice = _.reduce(ctrl.order, function(sum, item) {
        return (sum + ctrl.getCost(item)); // Add totals of each item in order to get total cost of all items
      }, 0); // End _.reduce and fnc(sum, item)
      return totalPrice * 1.08 // Add tax
    }; // End fnc getTotal

    ctrl.clearOrder = function(order) {
       // var x = ctrl.order;
      _.each(ctrl.order, function(item) {
        // console.log(x, item._id);
        var dish = findItemById(item._id); // Id each item in order??????????
        // console.log('dish', dish, dish.qty, item.quantity);
        dish.qty += item.quantity; // Put item back in inventory dbase
      }); // End _.each and fnc(item)
      ctrl.order.length = 0;
    } // End fnc clearOrder

    ctrl.getItems(); // Print menu page

}); // End fnc itemsCtrl

angular
  .module('subShopApp')
  .controller('itemsShowCtrl', function($http, $stateParams) {
    // console.log('itemShowCtrl is up');

    var ctrl = this;
    ctrl.item = {};

    $http.get('/api/items/' + $stateParams.itemId) // Read item from inventory dbase
    .then(function(res) {
      ctrl.item = res.data; // Load item for printout
    }); // End .then and fnc(res)
}); // End fnc itemsShowCtrl
