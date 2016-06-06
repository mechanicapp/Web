(function() {
  'use strict';

  angular
    .module('app.partner')
    .directive('gzPartnerTable', gzPartnerTable);

  function gzPartnerTable() {
    return {
      templateUrl: 'app/partner/directives/partnerTable.html',
      restrict: 'E',
      controller: PartnerTableController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        partners: '='
      }
    };
  }
  function PartnerTableController() {
    var vm = this;

    vm.removePartner = removePartner;

    function removePartner(partner) {
      vm.partners.$remove(partner);
    }
  }

})();
