const express 	= require('express'),
		app 		= express(),
		router	= express.Router();

router.get('/', (req, res) => {
	res.render('portfolio/landing',{
		title: "Lavra's Space"
	});
});
router.get('/blog', (req, res)=> {
	res.render('portfolio/blog', {
		title: "Lavra Tamutus' Blog"
	})
});
router.get('/gallery', (req, res)=>{
	res.render('portfolio/gallery', {
		title: "Lavra's Work"
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