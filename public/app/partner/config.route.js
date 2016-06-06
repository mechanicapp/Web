(function() {
  'use strict';

  angular
    .module('app.partner')
    .config(configFunction);

  configFunction.$inject = ['$routeProvider'];

  function configFunction($routeProvider) {
    $routeProvider.when('/partner', {
      templateUrl: 'app/partner/partner.html',
      controller: 'PartnerController',
      controllerAs: 'vm',
      resolve: {user: resolveUser }
    })
    .when('/partner/add', {
      templateUrl: 'app/partner/addPartner.html',
      controller: 'PartnerController',
      controllerAs: 'vm'
    })
    .when('/partner/add/info', {
      templateUrl: 'app/partner/addInfo.html',
      controller: 'PartnerController',
      controllerAs: 'vm'
    });

    resolveUser.$inject = ['authService'];

    function resolveUser(authService) {
      return authService.firebaseAuthObject.$requireAuth();
    }
  }
})();
