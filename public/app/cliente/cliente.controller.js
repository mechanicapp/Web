(function() {
  'use strict';

  angular
    .module('app.cliente')
    .controller('ClienteController', ClienteController);

  ClienteController.$inject = ['clienteService'];

  function ClienteController(clienteService) {

    var nv = this;

    nv.clientes = clienteService.getClientes();
  }

})();
