var express = require('express')
var app = express()
var path = require('path');

// SHOW LIST OF Products
app.get('/list', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT ProductID,ProductName,SupplierID,CategoryID,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,ORD(`Discontinued`) as Discontinued FROM Products ORDER BY ProductID DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('products/list', {
					title: 'Products List',
					data: ''
				})
			} else {
				// render to views/products/list.ejs template file
				res.render('products/list', {
					title: 'Product List',
					data: rows
				})
			}
		})
	})
})

app.get('/', function(req, res, next) {
				res.redirect('list')
			}
		)

// SHOW ADD Products FORM
app.get('/add', function(req, res, next){
	// render to views/products/add.ejs
	req.getConnection(function(error, conn) {
		conn.query('SELECT ProductID FROM Products  order by ProductID desc LIMIT 1',function(err, rows, fields) {
			var num = (JSON.parse(rows[0].ProductID));
			if (err) {
				req.flash('error', err)
				res.render('products/add', {
					title: 'Products List',
					data: ''
				})
			} else {
			res.render('products/add', {
				title: 'Add New Product',
				ProductID: num+1,
				ProductName: '',
				SupplierID: '',
				CategoryID: '',
				QuantityPerUnit: '',
				UnitPrice:'',
				UnitsInStock: '',
				UnitsOnOrder: '',
				ReorderLevel: '',
				Discontinued: ''
				})
			}
		})
	})
})

// ADD NEW Products POST ACTION
app.post('/add', function(req, res, next){
	req.assert('ProductID', 'ProductID is required').notEmpty()           //Validate name
	req.assert('ProductName', 'ProductName is required').notEmpty()             //Validate age
    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!

		var products = {
			ProductID: req.sanitize('ProductID').escape().trim(),
			ProductName: req.sanitize('ProductName').escape().trim(),
			SupplierID: req.sanitize('SupplierID').escape().trim(),
			CategoryID: req.sanitize('CategoryID').escape().trim(),
			QuantityPerUnit: req.sanitize('QuantityPerUnit').escape().trim(),
			UnitPrice: req.sanitize('UnitPrice').escape().trim(),
			UnitsInStock: req.sanitize('UnitsInStock').escape().trim(),
			UnitsOnOrder: req.sanitize('UnitsOnOrder').escape().trim(),
			ReorderLevel: req.sanitize('ReorderLevel').escape().trim(),
			Discontinued: req.sanitize('Discontinued').escape().trim()
		}

		req.getConnection(function(error, conn) {
			conn.query("INSERT INTO Products values ('"+req.body.ProductID+"','"+req.body.ProductName+"','"+req.body.SupplierID+"','"+req.body.CategoryID+"','"+req.body.QuantityPerUnit+"','"+req.body.UnitPrice+"','"+req.body.UnitsInStock+"','"+req.body.UnitsOnOrder+"','"+req.body.ReorderLevel+"',"+Boolean(req.body.Discontinued)+")", function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/products/add.ejs
					res.render('products/add', {
						title: 'Add New Product',
						ProductID: products.ProductID,
						ProductName: products.ProductName,
						SupplierID: products.SupplierID,
						CategoryID: products.CategoryID,
						QuantityPerUnit: products.QuantityPerUnit,
						UnitPrice: products.UnitPrice,
						UnitsInStock: products.UnitsInStock,
						UnitsOnOrder: products.UnitsOnOrder,
						ReorderLevel: products.ReorderLevel,
						Discontinued: products.Discontinued
					})
				} else {
					req.flash('success', 'Data added successfully!')

					// render to views/products/add.ejs
					res.render('products/add', {
						title: 'Add New Product',
						ProductID: '',
						ProductName: '',
						SupplierID: '',
						CategoryID: '',
						QuantityPerUnit: '',
						UnitPrice:'',
						UnitsInStock: '',
						UnitsOnOrder: '',
						ReorderLevel: '',
						Discontinued: ''
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		/**
		 * Using req.body.name
		 * because req.param('name') is deprecated
		 */
        res.render('products/add', {
            title: 'Add New Product',
            ProductID: req.body.ProductID,
            ProductName: req.body.ProductName,
            SupplierID: req.body.SupplierID,
						CategoryID: req.body.CategoryID,
            QuantityPerUnit: req.body.QuantityPerUnit,
            UnitPrice: req.body.UnitPrice,
						UnitsInStock: req.body.UnitsInStock,
            UnitsOnOrder: req.body.UnitsOnOrder,
            ReorderLevel: req.body.ReorderLevel,
						Discontinued: req.body.Discontinued
        })
    }
})

// SHOW EDIT Prodcuts FORM
app.get('/edit/(:ProductID)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM Products WHERE ProductID = ?', [req.params.ProductID], function(err, rows, fields) {
			if(err) throw err

			// if Product not found
			if (rows.length <= 0) {
				req.flash('error', 'Product not found with ProductID = ' + req.params.ProductID)
				res.redirect('/products')
			}
			else { // if Product found
				// render to views/products/edit.ejs template file
				res.render('products/edit', {
					title: 'Edit Product',
					//data: rows[0],
					ProductID: rows[0].ProductID,
					ProductName: rows[0].ProductName,
					SupplierID: rows[0].SupplierID,
					CategoryID: rows[0].CategoryID,
					QuantityPerUnit: rows[0].QuantityPerUnit,
					UnitPrice: rows[0].UnitPrice,
					UnitsInStock: rows[0].UnitsInStock,
					UnitsOnOrder: rows[0].UnitsOnOrder,
					ReorderLevel: rows[0].ReorderLevel,
					Discontinued: rows[0].Discontinued
				})
			}
		})
	})
})

// EDIT Products POST ACTION
app.put('/edit/(:ProductID)', function(req, res, next) {
	req.assert('ProductID', 'ProductID is required').notEmpty()
	req.assert('ProductName', 'ProductName is required').notEmpty()

    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!


		var products = {
			ProductID: req.sanitize('ProductID').escape().trim(),
			ProductName: req.sanitize('ProductName').escape().trim(),
			SupplierID: req.sanitize('SupplierID').escape().trim(),
			CategoryID: req.sanitize('CategoryID').escape().trim(),
			QuantityPerUnit: req.sanitize('QuantityPerUnit').escape().trim(),
			UnitPrice: req.sanitize('UnitPrice').escape().trim(),
			UnitsInStock: req.sanitize('UnitsInStock').escape().trim(),
			UnitsOnOrder: req.sanitize('UnitsOnOrder').escape().trim(),
			ReorderLevel: req.sanitize('ReorderLevel').escape().trim(),
			Discontinued: req.sanitize('Discontinued').escape().trim()
		}

		req.getConnection(function(error, conn) {
			conn.query("UPDATE Products SET ProductID="+req.body.ProductID+",ProductName='"+req.body.ProductName+"',SupplierID="+req.body.SupplierID+",CategoryID="+req.body.CategoryID+",QuantityPerUnit="+req.body.QuantityPerUnit+",UnitPrice="+req.body.UnitPrice+",UnitsInStock="+req.body.UnitsInStock+",UnitsOnOrder="+req.body.UnitsOnOrder+",ReorderLevel="+req.body.ReorderLevel+",Discontinued="+Boolean(req.body.Discontinued)+" WHERE ProductID = " + req.params.ProductID, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/products/add.ejs
					res.render('products/edit', {
						title: 'Edit Products',
						ProductID: req.params.ProductID,
						ProductName: req.body.ProductName,
						SupplierID: req.body.SupplierID,
						CategoryID: req.body.CategoryID,
						QuantityPerUnit: req.body.QuantityPerUnit,
						UnitPrice: req.body.UnitPrice,
						UnitsInStock: req.body.UnitsInStock,
						UnitsOnOrder: req.body.UnitsOnOrder,
						ReorderLevel: req.body.ReorderLevel,
						Discontinued: req.body.Discontinued
					})
				} else {
					req.flash('success', 'Data updated successfully!')

					// render to views/prodcuts/add.ejs
					res.render('products/edit', {
						title: 'Edit Product',
						ProductID: req.params.ProductID,
						ProductName: req.body.ProductName,
						SupplierID: req.body.SupplierID,
						CategoryID: req.body.CategoryID,
						QuantityPerUnit: req.body.QuantityPerUnit,
						UnitPrice: req.body.UnitPrice,
						UnitsInStock: req.body.UnitsInStock,
						UnitsOnOrder: req.body.UnitsOnOrder,
						ReorderLevel: req.body.ReorderLevel,
						Discontinued: req.body.Discontinued
					})
				}
			})
		})
	}
	else {   //Display errors to products
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		/**
		 * Using req.body.name
		 * because req.param('name') is deprecated
		 */
        res.render('products/edit', {
            title: 'Edit Product',
						ProductID: req.params.ProductID,
						ProductName: req.body.ProductName,
						SupplierID: req.body.SupplierID,
						CategoryID: req.body.CategoryID,
						QuantityPerUnit: req.body.QuantityPerUnit,
						UnitPrice: req.body.UnitPrice,
						UnitsInStock: req.body.UnitsInStock,
						UnitsOnOrder: req.body.UnitsOnOrder,
						ReorderLevel: req.body.ReorderLevel,
						Discontinued: req.body.Discontinued
        })
    }
})

// DELETE Product
app.delete('/delete/(:ProductID)', function(req, res, next) {
	var user = { ProductID: req.params.ProductID }

	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM Products WHERE ProductID = ' + req.params.ProductID, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to Prodcts list page
				res.redirect('/products')
			} else {
				req.flash('success', 'Product deleted successfully! ProductID = ' + req.params.ProductID)
				// redirect to Products list page
				res.redirect('/products')
			}
		})
	})
})

module.exports = app
