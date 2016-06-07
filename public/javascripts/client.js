angular.module('subShopApp', []);

angular.module('subShopApp')
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
