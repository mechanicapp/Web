(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('FIREBASE_URL', 'https://mechanic.firebaseio.com/')
    .constant('PROTECTED_PATHS', ['/partner', '/cliente']);


})();
