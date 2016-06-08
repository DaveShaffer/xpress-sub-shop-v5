angular.module('subShopApp', ['ui.router']);

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

    var ctrl = this;
    ctrl.items = [];

    ctrl.getItems = function() {
      $http.get('/api/items')
      .then(function(res) {
        ctrl.items = res.data;
      });
    };
    ctrl.getItems();
});

angular
  .module('subShopApp')
  .controller('itemsShowCtrl', function($http, $stateParams) {
    console.log('itemShowCtrl is up');

    var ctrl = this;
    ctrl.item = {};

    $http.get('/api/items/' + $stateParams.itemId)
    .then(function(res) {
      ctrl.item = res.data;
    });
});
