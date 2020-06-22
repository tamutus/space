const express = require('express'),
		app = express(),
		router = express.Router();

router.get('/', (req, res) => {
	res.render('dream/main', {
		title: "Dream"
	});
});

module.exports = router;