(function() {
  'use strict';

  angular
    .module('app', [
      // Angular modules.
      'ngRoute',
      'firebase',
      'app.layout',
      'app.core',
      'app.cliente'
    ])
    .config(configFunction);

  configFunction.$inject = ['$routeProvider'];

  function configFunction($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  }

})();
