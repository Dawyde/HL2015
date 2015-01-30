var express = require('express');
var app = express();
app.get('/', function(req, res){
  res.send('hello world');
});

app.use(express.static(__dirname + '/public'));
app.listen(8080, '0.0.0.0');
//coucou :) !! le réseau est moche et lent
// Yolo c'est moi que j'ai écrit d'abord
// David Coucou !