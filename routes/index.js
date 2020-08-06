const express 	= require('express'),
		app 		= express(),
		router	= express.Router();

router.get('/', (req, res) => {
	res.render('portfolio/landing',{
		title: "Lavra's Space"
	});
});
router.get('/gallery', (req, res)=>{
	res.render('portfolio/gallery', {
		title: "CSS Animations Collection"
	});
});
router.get('/commission', (req, res) => {
	res.render('portfolio/commission', {
		title: "Commissioning Lavra"
	})
});
router.get('/commission-terms', (req, res) => {
	res.render('portfolio/commission-terms.ejs', {
		title: "Terms of Service"
	});
});

module.exports = router;