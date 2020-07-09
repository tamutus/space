const express 	= require('express'),
		app 		= express(),
		router	= express.Router();

router.get('/', (req, res) => {
	res.render('portfolio/landing',{
		title: "Lavra's Space"
	});
});
router.get('/animations', (req, res)=>{
	res.render('portfolio/animations', {
		title: "CSS Animations Collection"
	});
});

module.exports = router;