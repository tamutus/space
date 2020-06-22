$(window).scroll(function(){
	const header = $('#header'),
			content = $('#allContent'),
			vid = $('#backgroundVideo'),
			scroll = $(window).scrollTop(),
			height = $(window).height();
	if(scroll >= height * 0.15){
		header.addClass('fixed');
		header.addClass('shifting');
		content.addClass('topMargined');
		vid.addClass('filteredVid');
	} else {
		header.removeClass('shifting');
		header.removeClass('fixed');
		content.removeClass('topMargined');
		vid.removeClass('filteredVid');
	}
});