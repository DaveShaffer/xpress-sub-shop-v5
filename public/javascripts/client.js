angular.module('subShopApp', ['ui.router']);
// var _ = require('underscore');


angular
  .module('subShopApp')
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise("/home");
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html"
    })
    .state('items', {
       url: "/items",
      templateUrl: "views/items.html",
      controller: "itemsCtrl",
      controllerAs: "ctrl"
    })
    .state('itemsShow', {
      url: "/items/:itemId",
      templateUrl: "views/items-show.html",
      controller: "itemsShowCtrl",
      controllerAs: "ctrl"
    });
  });

angular
  .module('subShopApp')
  .controller('itemsCtrl', function($http) {
    // console.log('itemCtrl is up');

    // var _ = require('lodash');
    var ctrl = this;
    ctrl.items = [];
    ctrl.order = [];

    function findItemById(items, id) {
      console.log('findItemById', items, id);
      return _.find(items, function(item) {
        console.log('findItemById2', item._id, id)
        return item._id === id;
      });
    }

    ctrl.getItems = function() {
      $http.get('/api/items')
      .then(function(res) {
        ctrl.items = res.data;
      });
    };


    ctrl.addItem = function(item) {
      item.qty -= 1;
      var found = findItemById(ctrl.order, item._id);
      console.log('addItem', item._id, found);
      if (found) {
        found.quantity += item.serving;
      } else {
        ctrl.order.push(angular.copy(item));
      }
      // console.log('hello', item, ctrl.order);
      return $http.put('/api/items/' + item._id, item);
    };

    ctrl.removeItem = function(item) {
      var index = ctrl.order.indexOf(item);
      // console.log(index, item);
      ctrl.order[index].quantity -= 1;
      if (ctrl.order[index].quantity == 0) {
        ctrl.order.splice(index, 1);
      };
      var dish = findItemById(ctrl.order, item._id);
      dish.qty += 1;
    };

    ctrl.getCost = function(item) {
      return item.quantity * item.price;
    };

    ctrl.getTotal = function() {
      var y = _.reduce(ctrl.order, function(sum, item) {
        return (sum + ctrl.getCost(item));
      }, 0);
      return y * 1.08
    };

    ctrl.clearOrder = function() {
      var x = ctrl.order;
      _.each(x, function(item) {
        var dish = findItemById(item._id);
        dish.qty += item.quantity;
        x.length = 0;
      });
    }

    ctrl.getItems();

});

angular
  .module('subShopApp')
  .controller('itemsShowCtrl', function($http, $stateParams) {
    // console.log('itemShowCtrl is up');

    var ctrl = this;
    ctrl.item = {};

    $http.get('/api/items/' + $stateParams.itemId)
    .then(function(res) {
      ctrl.item = res.data;
    });
});
