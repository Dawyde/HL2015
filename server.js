var express = require('express');
var app = express();
var connection = require('mysql').createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'datastrophe'
});
connection.connect();

connection.query("SELECT * FROM  surface_agricoles_region WHERE libelle=? LIMIT 1", ['Epeautre'], function(e,f){
	console.log(f);
});
var test = require("./test.js");

test.hello();
app.get('/', function(req, res){
  res.send('hello world');
});

app.use(express.static(__dirname + '/public'));

app.listen(3000,'192.168.60.10');
app.listen(81,'192.168.1.20');