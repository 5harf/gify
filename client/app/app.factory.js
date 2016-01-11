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
      chooseQuery: chooseQuery,
      unsetCurrent: unsetCurrent
    };

    return services;
    //called on any key up event in input field, fetches data for typeahead
    function debouncedSearch(query) {
      //store context to make it available inside setTimeout callback
      var context = this;
      //check to see if user has typed recently
      if (this.timeout) {
        //if they have then clear this timeout and set a new one
        clearTimeout(this.timeout)
      }
      //make a get request to our api for the suggested available gifs based on query so far
      this.timeout = setTimeout(function () {
        if (query !== '') {
          $http.get('/suggestions?query=' + query)
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
    
    //helper functions for styleing typeahead
    function isCurrent(index) {
      return this.current == index;

    };

    function setCurrent(index) {
      this.current = index;
    };

    function unsetCurrent(index) {
      this.current = null;
    }

    //click handler function 
    function chooseQuery(query) {
      this.getGif(query);
      this.responses =  null;
      this.current = null;
    }
  }

})(); 
