var express = require('express');

var app = express();

var path = require('path');

var port = 8080;

var giphy = require( 'giphy' )( 'dc6zaTOxFJmzC' );

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../client/')));

app.post('/gif', function (req, res) {
  console.log('req.body =', req.body);
  var query = req.body.query;
  giphy.search({q: query}, function (err, trending, response) {
    if (err) {
      throw err;
      res.send(404);
    }
    console.log('trending =', trending.data[0].images.fixed_height.url);
    res.send(trending.data[0].images.fixed_height.url);
  } );
})

app.listen(port);
