var express = require('express');

var app = express();

var redis = require('redis');

var path = require('path');

var utils = require('./utility.js');

var port = process.env.PORT || 8080;

//initialize giphy api library with open api key
var giphy = require( 'giphy' )( 'dc6zaTOxFJmzC' );

//serve static files
app.use('/', express.static(path.join(__dirname, '../client/')));

//endpoint for serving .gif images from giphy
app.get('/gif', function (req, res) {
  var query = req.query.query;
  //create redis client connecting to either Heroku database or the local database
  var client = process.env.REDIS_URL ? redis.createClient(process.env.REDIS_URL) : redis.createClient();
  //check if query is in our list of allowed words
  client.get(query, function (err, replies) {
    if (err) {
      throw err;
    }
    //if not send 404 image
    if (replies === null) {
      utils.notFound(res);
    } else {
      //otherwise hit giphy api with query
      giphy.search({q: query}, function (err, trending, response) {
        if (err) {
          utils.notFound(res);
          throw err;
        }
        if (trending.data[0] !== undefined) {
          res.send(trending.data[0].images.fixed_height.url);
        } else {
          utils.notFound(res);
        }
      });
    }
  })
  client.quit();
})

//endpoint for typeahead suggestions  
app.get('/suggestions', function (req, res) {
  var query = req.query.query;
  var client = process.env.REDIS_URL ? redis.createClient(process.env.REDIS_URL) : redis.createClient();
  //query database for all keys that match the query so far
  client.keys(query + '*', function (err, replies) {
    if (err) {
      throw err;
    }
    //send the first 5
    res.send(replies.slice(0, 5));
    client.quit();
  })
})

//populate database on server start
utils.databaseSetup(redis);

app.listen(port);

console.log('Listening on port ' + port)
