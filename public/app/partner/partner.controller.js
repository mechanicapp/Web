(function() {
  'use strict';

  angular
    .module('app.partner')
    .controller('PartnerController', PartnerController);

  PartnerController.$inject = ['partnerService'];

  function PartnerController(partnerService) {

    var mv = this;

    mv.partners = partnerService.getPartners();
  }

})();
