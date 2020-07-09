window.onload = function() {
	const navToggler = document.getElementById('navToggler');
	let menuOpenedAt = undefined;
	navToggler.onclick = function(){
		$('#nav-main').toggleClass('collapsed');
		menuOpenedAt = $(window).scrollTop();
	}
	$(window).scroll(function(){
		const header = $('#header'),
				content = $('#allContent'),
				vid = $('#backgroundVideo'),
				scroll = $(window).scrollTop(),
				height = $(window).height(),
				nav = $('#nav-main');
		if(scroll/height >= .10 && $(window).width() <= 750){
			if( (menuOpenedAt && Math.abs(menuOpenedAt - scroll) > 200) || (!menuOpenedAt)) {
				nav.addClass('collapsed');
				menuOpenedAt = undefined;
			}
		}
		if(scroll >= height * 0.19){
			header.addClass('fixed');
			header.addClass('shifting');
			content.addClass('topMargined');
			vid.addClass('filteredVid');
			nav.addClass('shadeable');
		} else {
			header.removeClass('shifting');
			header.removeClass('fixed');
			content.removeClass('topMargined');
			vid.removeClass('filteredVid');
			nav.removeClass('shadeable');
			if(scroll === 0){
				nav.removeClass('collapsed');
			}
		}
	});
	window.onresize = function(){
		const nav = $('#nav-main');
		if($(window).scrollTop() >= 25 && $(window).width() <= 770){
			nav.addClass('collapsed');
		}
		else {
			nav.removeClass('collapsed');
		}
	}
}
function completeLoading(){
	console.log("function is working");
	const loaderText = $("#loader .square h1");
	const loadingSquares = $("#loader .square");
	loadingSquares.each(function(index, square){
		if($(square).hasClass("complete")){
			$(square).addClass("reloading");
		}
		else{
			$(square).addClass("unloading");
		}
		window.setTimeout(() => {
			$(square).removeClass(["reloading", "unloading"])
			$(square).toggleClass(["loading", "complete"]);
		}, 1500);
	});
	if(loaderText.text() === "Loading"){
		$("#completeButton").text("Reload");
		loaderText.text("O:");
		window.setTimeout(() => {
			$("#loader .square:nth-child(1)").html("<span><h1>C</h1><h1>O</h1></span>");
			$("#loader .square:nth-child(2)").html("<span><h1>M</h1><h1>P</h1></span>");
			$("#loader .square:nth-child(3)").html("<span><h1>L</h1><h1>E</h1></span>");
			$("#loader .square:nth-child(4)").html("<span><h1>T</h1><h1>E</h1></span>");
		}, 1500);
	}
	else {
		$("#loader .square:nth-child(1)").html("<h1>Here</h1>");
		$("#loader .square:nth-child(2)").html("<h1>we</h1>");
		$("#loader .square:nth-child(3)").html("<h1>go</h1>");
		$("#loader .square:nth-child(4)").html("<h1>again...</h1>");

		$('#completeButton').text("Finish Loading");
		window.setTimeout(() => {
			$("#loader .square:nth-child(1)").html("<h1>Loading</h1>");
			$("#loader .square:nth-child(2)").html("");
			$("#loader .square:nth-child(3)").html("");
			$("#loader .square:nth-child(4)").html("");
		}, 1500);
	}
}
