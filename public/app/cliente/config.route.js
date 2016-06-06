(function() {
  'use strict';

  angular
    .module('app.cliente')
    .config(configFunction);

  configFunction.$inject = ['$routeProvider'];

  function configFunction($routeProvider) {
    $routeProvider.when('/cliente', {
      templateUrl: 'app/cliente/cliente.html',
      controller: 'ClienteController',
      controllerAs: 'nv',
      resolve: { user: resolveUser }
    });

    resolveUser.$inject = ['authService'];

    function resolveUser(authService) {
      return authService.firebaseAuthObject.$requireAuth();
    }
  }
})();
