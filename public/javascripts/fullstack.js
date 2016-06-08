// 1vsubshop
// src/app/main/main.controller.js
(function() {
  'use strict';

  angular
    .module('1vSubShop')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1465057900274;
    vm.showToastr = showToastr;

    activate();

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
})();

// src/app/dish/dish.index.controller.js
(function() {
  'use strict';

  angular
    .module('1vSubShop')
    .controller('DishIndexController', DishIndexController);

  /** @ngInject */
  function DishIndexController(DishService, $state, OrderService) {
    var vm = this;

    vm.searchText = '';
    vm.inventory = DishService.inventory;
    vm.order = OrderService.order;

    vm.addDish = function(dish) {
      OrderService.addDish(dish);
      dish.qty -= 1;
    };

    vm.removeDish = function(dish) {
      OrderService.removeDish(dish);
      DishService.addOneToQuantity(dish);
    };

    vm.getCost = function(dish) {
      return OrderService.getCost(dish);
    };

    vm.getTotal = function() {
      return OrderService.getTotal();
    };

    vm.clearOrder = function() {
      var x = vm.order;
      DishService.resetQuantity(x);
      OrderService.clearOrder();
      // console.log(vm.order, '1');
    };

    vm.goDish = function (dish) {
      // console.log('goDish: ' + dish.id);
      $state.go( 'dishDetail', { dishId : dish.id } );
    };
  }

  angular
    .module('1vSubShop')
    .filter('inventory', function() {

    function isMatch(str, pattern) {
      return str.toLowerCase().indexOf(pattern.toLowerCase()) !== -1;
    }

    return function(inventory, searchText) {
      var dishes = {
          searchText: searchText,
          out: []
      };
      angular.forEach(inventory, function (dish) {
        if (isMatch(dish.name, this.searchText) ) {
          this.out.push(dish);
        }
      }, dishes);
      return dishes.out;
    };
  });
})();

// src/app/dish/dish.show.controller.js
(function() {
  'use strict';

  angular
    .module('1vSubShop')
    .controller('DishShowController', DishShowController);

  /** @ngInject */
  function DishShowController(DishService, $stateParams) {
    var vm = this;
    var id = $stateParams.dishId;
    vm.dish = DishService.findItemById(id);
  }
})();

// 4vsubshop
// server/api/item/item.controller.js
'use strict';

import _ from 'lodash';
import Item from './item.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      console.log('item.controller.js respondWithResult:', entity);
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Items
export function index(req, res) {
  return Item.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Item from the DB
export function show(req, res) {
  return Item.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Item in the DB
export function create(req, res) {
  return Item.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Item in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Item.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Item from the DB
export function destroy(req, res) {
  return Item.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// server/api/order/order.controller.js
'use strict';

import _ from 'lodash';
import OrderItem from './orderitem.model';
import Item from '../item/item.model';
import User from '../user/user.model';

function findItemInOrder(user, id) {
  // _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
  return _.find(user.order, function(orderItem) {
    // return orderItem.item === id;    // does not work!
    console.log('Comparing ' + orderItem.item + ' to ' + id);
    return orderItem.item.equals(id) || orderItem._id.equals(id);
  });
}

// Get the order from the DB.
exports.get = function(req, res) {
  console.log('get, url = ' + req.url);
  var userId = req.params.userid;
  console.log('userId: ' + userId);

  User.findById(userId)
  .populate('order.item')
  .exec(function(err, user) {
    console.log('user: ' + (user ? user.name : ''));
    if (err) { return handleError(res, err); }
    if (!user) { return res.send(404); }
    console.log('returning order: ' + JSON.stringify(user.order));
    res.json(200, user.order);
  });
};

// Add a new item to the order or update the qty and return the order.
exports.addItem = function(req, res) {
  console.log('addItem, url = ' + req.url);
  var userId = req.params.userid.trim();
  var itemId = req.params.itemid.trim();
  console.log('userId: ' + userId + ', itemId: ' + itemId);

  Item.findById(itemId, function(err, item) {
    if (err) { return handleError(res, err); }
    if (!item) { return res.send(404); }
    item.qty -= 1;
    item.save(item.id);
    console.log(item.name, item.qty);
    User.findById(userId, function(err, user) {
      if (err) { return handleError(res, err); }
      if (!user) { return res.send(404); }

      // Check if item is already in order
      var found = findItemInOrder(user, item._id);
      if (found) {
        console.log('Found item ' + item.name + ' in order, therefore incrementing qty');
        found.qty = found.qty + 1;
      }
      else {
        console.log('Adding item to order: ' + item.name);
        user.order.push( new OrderItem( { item: item, qty: 1 } ) );
      }
      user.save(function() {
        user.populate('order.item', function(err, user) {
          return res.status(201).json(user.order );
        });
      });
    });
  });
};

// Remove an item from the order and return the order.
exports.removeItem = function(req, res) {
  console.log('removeItem, url = ' + req.url);
  var userId = req.params.userid;
  var orderItemId = req.params.itemid;
  console.log('userId: ' + userId + ', orderItemId: ' + orderItemId);

  // Remove the item, get the updated order, and return the order
  User.findById(userId, function(err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.send(404); }

    // Check if item is already in order
    var found = findItemInOrder(user, orderItemId);
    if (found) {
      console.log('Removing item from order');
      user.order.pull(found._id);               // pull is a feature of MongooseArray!
    }
    else {
      return res.send(404);
    }
    user.save(function() {
      user.populate('order.item', function(err, user) {
        return res.status(201).json(user.order );
      });
    });
  });
};

// Remove all items from the order in the DB.
exports.removeAllItems = function(req, res) {
  console.log('removeAllItems, url = ' + req.url);
  var userId = req.params.userid;
  console.log('userId: ' + userId);

  // remove all items from order and return the order
  User.findById(userId, function(err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.send(404); }

    user.order = [];
    user.save(function() {
      user.populate('order.item', function(err, user) {
        return res.status(204).send(user.order);
      });
    });
  });
}

function handleError(res, err) {
  return res.send(500, err);
}

// server/api/user/user.controller.js
'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}

// client/components/navbar/navbar.controller.js
'use strict';

class NavbarController {
  //end-non-standard

  //start-non-standard
  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }

}

angular.module('4vSubShopApp')
  .controller('NavbarController', NavbarController);

// client/app/items/items.controller.js
'use strict';
(function(){

class ItemsComponent {
  constructor($state, itemService, orderService) {
    this.$state = $state;
    this.itemService = itemService;
    this.orderService = orderService;
    this.searchText = '';
    this.order = [];

    // Load order data from server
    this.orderService.getOrder().then((json) => {
      this.updateOrderFromServer(json.data);
    });

    // load inventory items from server
    this.getInventory();
  }

  find(order, item) {
    var len = order.length;
    for (var i = 0; i < len; i++) {
      if (order[i]._id === item._id) {
        return order[i];
      }
    }
    return null;
  }

  // diff the orderFromServer with our current order and make the incremental modifications
  // doing it this way makes our animation work.
  updateOrderFromServer(orderFromServer) {
    // add orderItems in orderFromServer not found in this.order
    var len = orderFromServer.length;
    var orderItem;
    for (var i = 0; i < len; i++) {
      orderItem = orderFromServer[i];
      if (!this.find(this.order, orderItem)) {
        this.order.splice(i, 0, orderItem);
      }
    }

    // check for remove or update
    i = this.order.length;
    while (i--) {
      orderItem = this.order[i];
      // remove orderItems in this.order not found in orderFromServer
      var found = this.find(orderFromServer, orderItem);
      if (!found) {
        this.order.splice(i, 1);
      }
      // update orderItems in this.order this have a different qty in orderFromServer
      else if (orderItem.qty !== found.qty) {
        orderItem.qty = found.qty;
      }
    }
  }

  getInventory() {
    this.itemService.getItems().then((json) => {
      this.inventory = json.data;
    });
  }

  addItem(item) {
    this.orderService.addItem(item).then((json) => {
      this.updateOrderFromServer(json.data);
    }, function(err) {
      console.log('ERROR: addItem: ' + JSON.stringify(err));
    });
  }

  removeItem(item) {
    this.orderService.removeItem(item).then((json) => {
      this.updateOrderFromServer(json.data);
    }, function(err) {
      console.log('ERROR: removeItem: ' + JSON.stringify(err));
    });
  }

  getCost(item) {
    return this.orderService.getCost(item);
  }

  clearOrder() {
    return this.orderService.clearOrder().then((json) => {
      this.updateOrderFromServer(json.data);
    }, function(err) {
      console.log('clearOrder delete ERROR: ' + JSON.stringify(err));
    });
  }

  goItem(item) {
    this.$state.go('itemDetail', {
      itemId: item._id
    });
  }

  getTotal() {
    return this.orderService.getTotal(this.order);
  }
}

angular
  .module('4vSubShopApp')
  .component('items', {
    templateUrl: 'app/items/items.html',
    controller: ItemsComponent
  });

})();

// client/main/main.controller.js
'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket) {
      this.$http = $http;
      this.socket = socket;
      this.awesomeThings = [];

      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('thing');
      });
    }

    $onInit() {
      this.$http.get('/api/things')
        .then(response => {
          this.awesomeThings = response.data;
          this.socket.syncUpdates('thing', this.awesomeThings);
        });
    }

    addThing() {
      if (this.newThing) {
        this.$http.post('/api/things', {
          name: this.newThing
        });
        this.newThing = '';
      }
    }

    deleteThing(thing) {
      this.$http.delete('/api/things/' + thing._id);
    }
  }

  angular.module('4vSubShopApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
