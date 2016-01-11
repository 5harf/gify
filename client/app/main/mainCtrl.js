(function() {
  'use strict';

  angular.module('gify')
  .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['mainFactory', 'appFactory', '$scope'];

  function MainCtrl(mainFactory, appFactory, $scope) {
    var self = this;

    self.debouncedSearch = appFactory.debouncedSearch;

    self.getGif = mainFactory.getGif;

    self.gif = mainFactory.gif;

    self.setCurrent = appFactory.setCurrent;

    self.isCurrent = appFactory.isCurrent;

    self.chooseQuery = appFactory.chooseQuery;

    self.unsetCurrent = appFactory.unsetCurrent;
    
  }

})();
