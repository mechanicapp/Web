(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('clienteService', clienteService);

  clienteService.$inject = ['$firebaseArray', 'firebaseDataService'];

  function clienteService($firebaseArray, firebaseDataService) {

    var clientes = null;

    var service = {
      Cliente: Cliente,
      getClientes: getClientes,
      reset: reset
    };

    return service;

    ////////////

    function Cliente() {
      this.nombres = '';
      this.email = '';
      this.celular = '';
      this.idCliente = '';
      this.image = '';
    }

    function getClientes() {
      if (!clientes) {
        clientes = $firebaseArray(firebaseDataService.users);
      }
      return clientes;
    }

    function reset() {
      if (clientes) {
        clientes.$destroy();
        clientes = null;
      }
    }

  }

})();
