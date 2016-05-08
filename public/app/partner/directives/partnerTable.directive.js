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
      controllerAs: 'mv',
      bindToController: true,
      scope: {
        partners: '='
      }
    };
  }
  function PartnerTableController() {
    var mv = this;
  }

})();
