(function() {
  'use strict';

  angular
    .module('app.partner')
    .controller('PartnerController', PartnerController);

  PartnerController.$inject = ['partnerService'];

  function PartnerController(partnerService) {

    var vm = this;

    vm.partners = partnerService.getPartners();
  }

})();
