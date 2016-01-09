var express = require('express');

var app = express();

var path = require('path');

var redis = require('redis');

var fs = require('fs');

var port = process.env.PORT || 8080;

var giphy = require( 'giphy' )( 'dc6zaTOxFJmzC' );

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../client/')));

app.post('/gif', function (req, res) {
  var query = req.body.query;
  var client = redis.createClient();
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

fs.readFile('./words.txt', 'utf8', function (err, data) {
  var client = redis.createClient();
  words = data.split('\n');
  words.pop();
  client.get(words[20], function (err, replies) {
    if (replies === null) {
      words.forEach(function(word) {
        client.set(word, word, function () {});
      })
    }
  })
  client.quit();
})

app.listen(port);
