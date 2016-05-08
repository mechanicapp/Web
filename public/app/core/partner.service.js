(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('partnerService', partnerService);

  partnerService.$inject = ['$firebaseArray', 'firebaseDataService'];

  function partnerService($firebaseArray, firebaseDataService) {

    var partners = null;

    var service = {
      Partner: Partner,
      getPartners: getPartners,
      reset: reset
    };

    return service;

    ////////////

    function Partner() {
      this.nombres = '';
      this.email = '';
      this.celular = '';
      this.idCliente = '';
      this.image = '';
    }

    function getPartners() {
      if (!partners) {
        partners = $firebaseArray(firebaseDataService.partners);
      }
      return partners;
    }

    function reset() {
      if (partners) {
        partners.$destroy();
        partners = null;
      }
    }

  }

})();
