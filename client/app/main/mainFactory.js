(function() {
  'use strict';

  angular.module('gify')
  .factory('mainFactory', mainFactory);

  mainFactory.$inject = ['$http'];

  function mainFactory($http) {
    var services = {
      getGif: getGif,
      gif: {}
    };

    return services;

    function getGif(query) {
        return $http({
            method: 'POST',
            url: '/gif',
            data: {query: query}
          })
        .then(function (data) {
          console.log(data);
          services.gif.image = data.data;

        })
        .catch(function(err) {
            throw err;
          });
    }

  }

})();
