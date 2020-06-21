// Dependencies
require('dotenv').config();
const express 	= require('express'),
		app 		= express(),
		mongoose = require('mongoose');
		// ejs = require('ejs');

// Route dependencies
const indexRoutes = require('./routes/index');

// Config
app.set('view engine', 'ejs');

// Routes
app.use('/', indexRoutes);

// Begin server
app.listen(process.env.PORT, () => {
	console.log("Hello world");
})