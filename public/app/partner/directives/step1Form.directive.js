(function() {
  'use strict';

  angular
    .module('app.partner')
    .directive('gzStep1Form', gzStep1Form);

  function gzStep1Form() {
    return {
      templateUrl: 'app/partner/directives/step1Form.html',
      restrict: 'E',
      controller: Step1FormController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        error: '=',
        formTitle: '@',
        submitAction: '&'
      }
    };
  }

  function Step1FormController() {
    var vm = this;

    vm.uPartner = {
      email: '',
      password: ''
    };
  }

})();
