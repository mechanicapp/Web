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
      controllerAs: 'mv',
    });
  }
})();
