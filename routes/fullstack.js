// 1vsubshop
// src/app/index.routes.js
(function() {
  'use strict';

  angular
    .module('1vSubShop')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('dishes', {
        url: '/dishes',
        templateUrl: 'app/dish/index.html',
        controller: 'DishIndexController',
        controllerAs: 'ctrl'
      })
      .state('dishDetail', {
        url: '/dishes/:dishId',
        templateUrl: 'app/dish/show.html',
        controller: 'DishShowController',
        controllerAs: 'ctrl'
      });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }

})();

//4vsubshop
// server/routes.js
'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/users/', require('./api/order'));
  app.use('/api/items', require('./api/item'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}

// server/api/item/index.js
'use strict';

var express = require('express');
var controller = require('./item.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

// server/api/order/index.js
'use strict';

var express = require('express');
var controller = require('./order.controller');

var router = express.Router();

router.get   ('/:userid/order/',        controller.get);
router.post  ('/:userid/order/:itemid', controller.addItem);
router.delete('/:userid/order/:itemid', controller.removeItem);
router.delete('/:userid/order/',        controller.removeAllItems);

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;

// server/api/user/index.js
'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;

// client/app/items/items.js
'use strict';

angular
  .module('4vSubShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('items', {
        url: '/items',
        template: '<items></items>'
      });
  });

  // client/app/main/main.js
  'use strict';

angular.module('4vSubShopApp')
  .config(function($stateProvider) {
    $stateProvider.state('main', {
      url: '/',
      template: '<main></main>'
    });
  });
