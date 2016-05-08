(function() {
  'use strict';

  angular
    .module('app.partner')
    .directive('gzPartnerForm', gzPartnerForm);

  function gzPartnerForm() {
    return {
      templateUrl: 'app/partner/directives/partnerForm.html',
      restrict: 'E',
      controller: PartnerFormController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        partners: '='
      }
    };
  }

  PartnerFormController.$inject = ['partnerService'];

  function PartnerFormController(partnerService) {
    var vm = this;

    vm.newPartner = new partnerService.Partner();
    vm.addPartner = addPartner;

    function addPartner() {
      vm.partners.$add(vm.newPartner);
      vm.newPartner = new partnerService.Partner();
    }
  }

})();
