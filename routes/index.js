var express = require('express')
var app = express()

app.get('/', function(req, res) {
	res.render('index', {title: 'Northwind Database API'})
})

module.exports = app;
