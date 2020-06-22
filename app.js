// Dependencies
require('dotenv').config();
const express 			= require('express'),
		app 				= express(),
		mongoose 		= require('mongoose'),
		passport 		= require('passport'),
		LocalStrategy 	= require('passport-local'),
		methodOverride = require('method-override'),
		flash 			= require('connect-flash');
		// ejs = require('ejs');

// Route dependencies
const indexRoutes = require('./routes/index'),
		dreamRoutes = require('./routes/dream');

// Mongoose Config

mongoose.connect(process.env.DATABASEURL, {
	// user: process.env.DB_USER,
	// pass: process.env.DB_PASS,
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).catch(err =>{
	console.log("Error: "+ err.message);
});
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));

// Routes
app.use('/', indexRoutes);
app.use('/dream', dreamRoutes);

// Begin server
app.listen(process.env.PORT, () => {
	console.log("Hello world");
})