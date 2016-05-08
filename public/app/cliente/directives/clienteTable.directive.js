(function() {
  'use strict';

  angular
    .module('app.cliente')
    .directive('gzClienteTable', gzClienteTable);

  function gzClienteTable() {
    return {
      templateUrl: 'app/cliente/directives/clienteTable.html',
      restrict: 'E',
      controller: ClienteTableController,
      controllerAs: 'nv',
      bindToController: true,
      scope: {
        clientes: '='
      }
    };
  }
  function ClienteTableController() {
    var nv = this;
  }

})();
