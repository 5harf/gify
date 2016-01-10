var express = require('express');

var app = express();

var path = require('path');

var redis = require('redis');

var fs = require('fs');

var Promise = require('bluebird');

//Promisify redis client functions
Promise.promisifyAll(redis.RedisClient.prototype);

var port = process.env.PORT || 8080;

var giphy = require( 'giphy' )( 'dc6zaTOxFJmzC' );

var bodyParser = require('body-parser');

var _ = require('lodash');

app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../client/')));

app.post('/gif', function (req, res) {
  var query = req.body.query;
  var client = process.env.REDIS_URL ? redis.createClient(process.env.REDIS_URL) : redis.createClient();
  client.get(query, function (err, replies) {
    if (err) {
      throw err;
    }
    if (replies === null) {
      res.send('http://zenit.senecac.on.ca/wiki/imgs/404-not-found.gif');
    } else {
      giphy.search({q: query}, function (err, trending, response) {
        if (err) {
          res.send('http://zenit.senecac.on.ca/wiki/imgs/404-not-found.gif');
          throw err;
        }
        if (trending.data[0] !== undefined) {
          res.send(trending.data[0].images.fixed_height.url);
        } else {
          res.send('http://zenit.senecac.on.ca/wiki/imgs/404-not-found.gif');
        }
      });
    }
  })
  client.quit();
})

app.get('/typeAhead', function (req, res) {
  var query = req.query.query;
  var client = process.env.REDIS_URL ? redis.createClient(process.env.REDIS_URL) : redis.createClient();
  client.keys(query + '*', function (err, replies) {
    res.send(replies.slice(0, 5));
    client.quit();
  })
})


fs.readFile('./words.txt', 'utf8', function (err, data) {
  var client = process.env.REDIS_URL ? redis.createClient(process.env.REDIS_URL) : redis.createClient();
  words = data.split('\n');
  words.pop();
  client.get('grandfather', function (err, replies) {
    if (replies === null) {
      Promise.all(_.map(words, function(word) {
        return client.setAsync(word, word);
      }))
      .then(function() {
        client.quit();
      })
    }
  })
})

app.listen(port);
