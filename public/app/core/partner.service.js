(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('partnerService', partnerService);

  partnerService.$inject = ['$firebaseArray', 'firebaseDataService', '$firebaseAuth'];

  function partnerService($firebaseArray, firebaseDataService, $firebaseAuth) {

    var partners = null;
    var part = null;
    var firebaseAuthObject = $firebaseAuth(firebaseDataService.root);
    var firebaseArray = $firebaseArray(firebaseDataService.partners);

    var service = {
      firebaseAuthObject: firebaseAuthObject,
      register: register,
      Partner: Partner,
      getPartners: getPartners,
      addPartner: addPartner,
      reset: reset
    };

    return service;


    ////////////

    function register(uPartner){
      return firebaseAuthObject.$createUser(uPartner);
    }

    function addPartner(authData, correo){
      var vm = this;
      vm.uid = authData.uid;
      vm.email = correo;
      vm.newPartner = new Partner(vm.uid, vm.email);
      part = firebaseArray.$add(vm.newPartner);
      return part;
    }

    function Partner(uid, correo) {
      this.activo = 1;
      this.carroTaller = 2;
      this.celular = '';
      this.idPartner = uid;
      this.lat = '';
      this.lng = '';
      this.nombres = '';
      this.ocupado = 1;
      this.online = 2;
      this.placa = '';
      this.tarjetaCredito = 2;
      this.tipoVehiculo = '';
      this.correo = correo;
    }

    function getPartners() {
      if (!partners) {
        partners = $firebaseArray(firebaseDataService.partners);
      }
      return partners;
    }

    function reset() {
      if (partners) {
        partners.$destroy();
        partners = null;
      }
    }

  }

})();
