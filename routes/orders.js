var express = require('express')
var app = express()
var path = require('path');

// SHOW LIST OF ORDERS
app.get('/list/(:CustomerID)', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT O.OrderID,O.CustomerID,O.OrderDate,O.ShippedDate,O.ShipVia,O.Freight,O.ShipName,O.ShipAddress,O.ShipCity,O.ShipPostalCode,O.ShipCountry FROM Customers C,Orders O where O.CustomerID=C.CustomerID and C.CustomerID = ?', [req.params.CustomerID],function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('orders/list', {
					title: 'Orders List',
					data: ''
				})
			} else {
				// render to views/orders/list.ejs template file
				res.render('orders/list', {
					title: 'Orders List',
					data: rows
				})
			}
		})
	})
})
module.exports = app
