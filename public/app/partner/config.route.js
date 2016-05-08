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
      controllerAs: 'vm'
    })
    .when('/partner/add', {
      templateUrl: 'app/partner/addPartner.html',
      controller: 'PartnerController',
      controllerAs: 'vm'
    });
  }
})();
