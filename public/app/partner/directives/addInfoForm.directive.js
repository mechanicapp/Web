(function() {
  'use strict';

  angular
    .module('app.partner')
    .directive('gzAddInfoForm', gzAddInfoForm);

  function gzAddInfoForm() {
    return {
      templateUrl: 'app/partner/directives/addInfoForm.html',
      restrict: 'E',
      controller: AddInfoFormController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        error: '=',
        formTitle: '@',
        submitAction: '&'
      }
    };
  }

  function AddInfoFormController() {
    var vm = this;

    
  }

})();
