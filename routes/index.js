const express 	= require('express'),
		app 		= express(),
		router	= express.Router();

router.get('/', (req, res) => {
	res.render('portfolio/landing',{
		title: "Lavra's Space"
	});
});

module.exports = router;