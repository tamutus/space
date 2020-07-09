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
			$("#loader .square:nth-child(1)").html("<h1>C   O</h1>");
			$("#loader .square:nth-child(2)").html("<h1>M   P</h1>");
			$("#loader .square:nth-child(3)").html("<h1>L   E</h1>");
			$("#loader .square:nth-child(4)").html("<h1>T   E</h1>");
		}, 1500);
	}
	else {
		$("#loader .square:nth-child(1)").html("22<h1>Here</h1>");
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