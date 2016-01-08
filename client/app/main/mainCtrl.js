(function() {
  'use strict';

  angular.module('gify')
  .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['mainFactory'];

  function MainCtrl(mainFactory) {
    var self = this;

    this.getGif = mainFactory.getGif;

    this.gif = mainFactory.gif;


    
  }

})();
