(function() {
  'use strict';

  angular
    .module('app.partner')
    .controller('PartnerController', PartnerController);

  PartnerController.$inject = ['$location', 'partnerService'];

  function PartnerController($location, partnerService) {

    var vm = this;

    vm.partners = partnerService.getPartners();

    vm.error = null;
    vm.register = register;

    function register(uPartner) {
      return partnerService.register(uPartner)
        .then(function(authData) {
          partnerService.addPartner(authData, uPartner.email).then(function(prueba){
            $location.path('/partner/add/info');
          });
        })
        .catch(function(error) {
          vm.error = error;
        });
    }

  }

})();
