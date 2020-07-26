var express = require('express')
var app = express()
var path = require('path');

// SHOW LIST OF Customers
app.get('/list', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country,Phone,Fax FROM Customers ORDER BY CustomerID DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('customers/list', {
					title: 'Customers List',
					data: ''
				})
			} else {
				// render to views/customers/list.ejs template file
				res.render('customers/list', {
					title: 'Customers List',
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

// SHOW ADD CUSTOMER FORM
app.get('/add', function(req, res, next){
	// render to views/customers/add.ejs
			res.render('customers/add', {
				title: 'Add New Customer',
				CustomerID:'',
				CompanyName:'',
				ContactName:'',
				ContactTitle:'',
				Address:'',
				City:'',
				Region:'',
				PostalCode:'',
				Country:'',
				Phone:'',
				Fax:''
				})
			})

// ADD NEW CUSOTMER POST ACTION
app.post('/add', function(req, res, next){
	req.assert('CustomerID', 'CustomerID is required').notEmpty()           //Validate
	req.assert('ContactName', 'ContactName is required').notEmpty()         //Validate
    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!

		var customers = {
			CustomerID: req.sanitize('CustomerID').escape().trim(),
			CompanyName: req.sanitize('CompanyName').escape().trim(),
			ContactName: req.sanitize('ContactName').escape().trim(),
			ContactTitle: req.sanitize('ContactTitle').escape().trim(),
			Address: req.sanitize('Address').escape().trim(),
			City: req.sanitize('City').escape().trim(),
			Region: req.sanitize('Region').escape().trim(),
			PostalCode: req.sanitize('PostalCode').escape().trim(),
			Country: req.sanitize('Country').escape().trim(),
			Phone: req.sanitize('Phone').escape().trim(),
			Fax: req.sanitize('Fax').escape().trim()
		}

		req.getConnection(function(error, conn) {
			conn.query("INSERT INTO Customers values ('"+req.body.CustomerID+"','"+req.body.CompanyName+"','"+req.body.ContactName+"','"+req.body.ContactTitle+"','"+req.body.Address+"','"+req.body.City+"','"+req.body.Region+"','"+req.body.PostalCode+"','"+req.body.Country+"','"+req.body.Phone+"','"+req.body.Fax+"')", function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/customers/add.ejs
					res.render('customers/add', {
						title: 'Add New Customer',
						CustomerID:customers.CustomerID,
						CompanyName:customers.CompanyName,
						ContactName:customers.ContactName,
						ContactTitle:customers.ContactTitle,
						Address:customers.Address,
						City:customers.City,
						Region:customers.Region,
						PostalCode:customers.PostalCode,
						Country:customers.Country,
						Phone:customers.Phone,
						Fax:customers.Fax
					})
				} else {
					req.flash('success', 'Data added successfully!')

					// render to views/customers/add.ejs
					res.render('customers/add', {
						title: 'Add New Customer',
						CustomerID:'',
						CompanyName:'',
						ContactName:'',
						ContactTitle:'',
						Address:'',
						City:'',
						Region:'',
						PostalCode:'',
						Country:'',
						Phone:'',
						Fax:''
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


        res.render('customers/add', {
            title: 'Add New Customer',
            CustomerID: req.body.CustomerID,
            CompanyName: req.body.CompanyName,
            ContactName: req.body.ContactName,
						ContactTitle: req.body.ContactTitle,
            Address: req.body.Address,
            City: req.body.City,
						Region: req.body.Region,
            PostalCode: req.body.PostalCode,
            Country: req.body.Country,
						Phone: req.body.Phone,
						Fax: req.body.Fax
        })
    }
})

// SHOW EDIT CUSTOMER FORM
app.get('/edit/(:CustomerID)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM Customers WHERE CustomerID = ?', [req.params.CustomerID], function(err, rows, fields) {
			if(err) throw err

			// if CUSTOMER not found
			if (rows.length <= 0) {
				req.flash('error', 'Customer not found with CustomerID = ' + req.params.CustomerID)
				res.redirect('/customers')
			}
			else { // if CUSTOMER found
				// render to views/customers/edit.ejs template file
				res.render('customers/edit', {
					title: 'Edit Customer',
					//data: rows[0],
					CustomerID: rows[0].CustomerID,
					CompanyName: rows[0].CompanyName,
					ContactName: rows[0].ContactName,
					ContactTitle: rows[0].ContactTitle,
					Address: rows[0].Address,
					City: rows[0].City,
					Region: rows[0].Region,
					PostalCode: rows[0].PostalCode,
					Country: rows[0].Country,
					Phone: rows[0].Phone,
					Fax: rows[0].Fax
				})
			}
		})
	})
})

// EDIT CUSTOMER POST ACTION
app.put('/edit/(:CustomerID)', function(req, res, next) {
	req.assert('CustomerID', 'CustomerID is required').notEmpty()
	req.assert('ContactName', 'ContactName is required').notEmpty()

    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!


		var customers = {
			CustomerID: req.sanitize('CustomerID').escape().trim(),
			CompanyName: req.sanitize('CompanyName').escape().trim(),
			ContactName: req.sanitize('ContactName').escape().trim(),
			ContactTitle: req.sanitize('ContactTitle').escape().trim(),
			Address: req.sanitize('Address').escape().trim(),
			City: req.sanitize('City').escape().trim(),
			Region: req.sanitize('Region').escape().trim(),
			PostalCode: req.sanitize('PostalCode').escape().trim(),
			Country: req.sanitize('Country').escape().trim(),
			Phone: req.sanitize('Phone').escape().trim(),
			Fax: req.sanitize('Fax').escape().trim()
		}

		req.getConnection(function(error, conn) {
			conn.query("UPDATE Customers SET CustomerID='"+req.body.CustomerID+"',CompanyName='"+req.body.CompanyName+"',ContactName='"+req.body.ContactName+"',ContactTitle='"+req.body.ContactTitle+"',Address='"+req.body.Address+"',City='"+req.body.City+"',Region='"+req.body.Region+"',PostalCode='"+req.body.PostalCode+"',Country='"+req.body.Country+"',Phone='"+req.body.Phone+"',Fax='"+req.body.Fax+"' WHERE CustomerID =  '"+ req.params.CustomerID+"'", function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)

					// render to views/customers/add.ejs
					res.render('customers/edit', {
						title: 'Edit Customer',
						CustomerID: req.body.CustomerID,
            CompanyName: req.body.CompanyName,
            ContactName: req.body.ContactName,
						ContactTitle: req.body.ContactTitle,
            Address: req.body.Address,
            City: req.body.City,
						Region: req.body.Region,
            PostalCode: req.body.PostalCode,
            Country: req.body.Country,
						Phone: req.body.Phone,
						Fax: req.body.Fax
					})
				} else {
					req.flash('success', 'Data updated successfully!')

					// render to views/customers/add.ejs
					res.render('customers/edit', {
						title: 'Edit Customer',
						CustomerID: req.body.CustomerID,
            CompanyName: req.body.CompanyName,
            ContactName: req.body.ContactName,
						ContactTitle: req.body.ContactTitle,
            Address: req.body.Address,
            City: req.body.City,
						Region: req.body.Region,
            PostalCode: req.body.PostalCode,
            Country: req.body.Country,
						Phone: req.body.Phone,
						Fax: req.body.Fax
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

        res.render('customers/edit', {
            title: 'Edit Customer',
						CustomerID: req.body.CustomerID,
            CompanyName: req.body.CompanyName,
            ContactName: req.body.ContactName,
						ContactTitle: req.body.ContactTitle,
            Address: req.body.Address,
            City: req.body.City,
						Region: req.body.Region,
            PostalCode: req.body.PostalCode,
            Country: req.body.Country,
						Phone: req.body.Phone,
						Fax: req.body.Fax
        })
    }
})

// DELETE CUSTOMER
app.delete('/delete/(:CustomerID)', function(req, res, next) {
	var user = { CustomerID: req.params.CustomerID }

	req.getConnection(function(error, conn) {
		conn.query("DELETE FROM Customers WHERE CustomerID = '"+req.params.CustomerID+"'", user, function(err, result) {
			if (err) {
				req.flash('error', err)
				res.redirect('/customers')
			} else {
				req.flash('success', 'Customer deleted successfully! CustomerID = ' + req.params.CustomerID)
				res.redirect('/customers')
			}
		})
	})
})

module.exports = app
