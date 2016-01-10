(function() {
  'use strict';

  angular.module('gify')
  .factory('appFactory', appFactory);

  appFactory.$inject = ['$http'];

  function appFactory($http) {
    var services = {
      debouncedSearch: debouncedSearch,
      isCurrent: isCurrent,
      setCurrent: setCurrent,
      chooseQuery: chooseQuery
    };

    return services;

    function debouncedSearch(query) {
      var context = this;
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(function () {
        if (query !== '') {
          $http.get('/typeAhead?query=' + query)
          .then(function (data) {
            if (data.data.length === 0) {
              context.responses = null;
            } else {
              context.responses = data.data;
            }
            context.timeout = null;
          })
          .catch(function (err) {
            throw err;
          });
        } else {
          context.responses = null;
        }
      }, 100)
    }

    function isCurrent(index) {
      return this.current == index;

    };

    function setCurrent(index) {
      this.current = index;
    };

    function chooseQuery(query) {
      this.getGif(query);
      this.responses =  null;
    }
  }

})(); 
