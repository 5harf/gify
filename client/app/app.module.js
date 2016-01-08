angular.module('gify', ['ui.router'])

  .constant('_', window._)
  .run(function($rootScope) {
    $rootScope._ = window._;
  });
