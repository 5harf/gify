var fs = require('fs');

var _ = require('lodash');

//Promise library
var Promise = require('bluebird');

module.exports = {
  //populate database on server start
  databaseSetup: function (redis) {

    //Promisify redis client functions
    Promise.promisifyAll(redis.RedisClient.prototype);

    fs.readFile('./words.txt', 'utf8', function (err, data) {
      if (err) {
        throw err;
      }
      var client = process.env.REDIS_URL ? redis.createClient(process.env.REDIS_URL) : redis.createClient();
      words = data.split('\n');
      //remove empty string from end of words array
      words.pop();
      client.get('grandfather', function (err, replies) {
        if (err) {
          throw err;
        }
        //check to see if database has been populated previously
        if (replies === null) {
          //if not, write all words to database
          Promise.all(_.map(words, function(word) {
            return client.setAsync(word, word);
          }))
          .then(function() {
            //after all words have been written to db, quit client
            client.quit();
          })
          .catch(function(err){
            client.quit();
            throw err;
          })
        }
      })
    })
  },
  //send 404 image
  notFound: function(res) {
    res.send('http://zenit.senecac.on.ca/wiki/imgs/404-not-found.gif')
  }
}
