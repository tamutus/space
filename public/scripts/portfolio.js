window.onload = function() {
	// For mobile compatibility, change vmax to a css custom property and pass to css (code from https://css-tricks.com/the-trick-to-viewport-units-on-mobile/)
	// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
	// let vh = .01 * window.innerHeight;
	// let vw = .01 * window.innerWidth;
	let vw, vh, vmax, bgWidth;
    function setVProperties(){
        vw = window.innerWidth * .01;
        vh = window.innerHeight * .01;
        vmax = vw > vh ? vw : vh;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vw', `${vw}px`);
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vmax', `${vmax}px`);
    }
    
    setVProperties();
	window.addEventListener('resize', () => {
		setVProperties();
	});
	
	const   navToggler = document.getElementById('navToggler'),
            header = $('#header'),
            content = $('#allContent'),
            vid = $('#backgroundVideo'),
            nav = $('#nav-main'),
            bgPara = $("#background-image.parallax");
    
    if(bgPara.length){
        bgWidth = bgPara.first().width();
    }

	let menuOpenedAtScroll = undefined,
		 menuOpenedAtWidth = undefined;
	navToggler.onclick = function(){
		$('#nav-main').toggleClass('collapsed');
		menuOpenedAtScroll = $(window).scrollTop();
		menuOpenedAtWidth = $(window).innerWidth();
	}
	// Nav autohides upon scrolling enough 
	$(window).scroll(function(){
		const   scroll = $(window).scrollTop(),
			    height = $(window).height();
		if(scroll/height >= .10 && $(window).innerWidth() <= 990){
			if( (menuOpenedAtScroll && Math.abs(menuOpenedAtScroll - scroll) > 200) || (!menuOpenedAtScroll)) {
				nav.addClass('collapsed');
				menuOpenedAtScroll = undefined;
				menuOpenedAtWidth = undefined;
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
        // 
        if(bgPara.length){
            bgWidth = bgPara.first().width();
            // 0% scroll should have bg left = 0. 100% scroll should have bg left = bgPara.first().width() - window.innerWidth;
            bgPara.css({left: ($(window).scrollTop() / document.documentElement.scrollHeight) * (window.innerWidth - bgWidth)});
        };
        // go through each .pop and remove focus class until the first one with DOMRect with positive y value, to which you add it
        const poppers = document.querySelectorAll(".pop");
        for(let i = 0; i < poppers.length; i++) {
            const popper = poppers.item(i);
            let domrect = popper.getBoundingClientRect();
            if(domrect.y < 50){
                popper.classList.remove("active");
            } else {
                if(window.scrollY > 100 && domrect.y < 50 * vh){
                    popper.classList.add("active");
                } else {
                    popper.classList.remove("active");
                }
                for(let j = i + 1; j < poppers.length; j++){
                    poppers.item(j).classList.remove("active");
                }
                break;
            }
        }
	});
	// Nav pivots down on small-width screen and raises back up when large again. Hides when you resize window more than 200px.
	window.onresize = function(){
		const nav = $('#nav-main');
		let width = $(window).innerWidth();
		if(width <= 990){
			if(!nav.hasClass('fallen')) {
					nav.removeClass('risen');
					nav.removeClass('resurrected');
					nav.addClass('fallen');
					nav.addClass('collapsed');
				}
			else if( (menuOpenedAtWidth && Math.abs(menuOpenedAtWidth - width) > 200) || (!menuOpenedAtWidth)) {
				nav.addClass('collapsed');
				menuOpenedAtScroll = undefined;
				menuOpenedAtWidth = undefined;
				
			}
		}
		else {
			if(nav.hasClass('collapsed')){
				nav.addClass('resurrected');
				setTimeout(()=> {
					if($(nav).hasClass('risen')){
						$(nav).removeClass('resurrected');
					}
				}, 1500);
			}
			nav.removeClass('collapsed');
			if(nav.hasClass('fallen')){
				nav.removeClass('fallen');
				nav.addClass('risen');
				menuOpenedAtScroll = $(window).scrollTop();
				menuOpenedAtWidth = $(window).innerWidth();
			}
		}
	}
	
	glimmerize();
}
function completeLoading(){
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
			$("#loader .square:nth-child(1)").html("<span><h1 class=\"ethereal\">C</h1><h1 class=\"ethereal\">O</h1></span>");
			$("#loader .square:nth-child(2)").html("<span><h1 class=\"ethereal\">M</h1><h1 class=\"ethereal\">P</h1></span>");
			$("#loader .square:nth-child(3)").html("<span><h1 class=\"ethereal\">L</h1><h1 class=\"ethereal\">E</h1></span>");
			$("#loader .square:nth-child(4)").html("<span><h1 class=\"ethereal\">T</h1><h1 class=\"ethereal\">E</h1></span>");
			glimmerize();
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
// Glowy text animation occurs once per mouseenter on anything with class "umbral" or "ethereal"
function glimmerize(){
	$(".umbral").bind("webkitAnimationEnd mozAnimationEnd animationend", function(){
		$(this).removeClass("darklyGlowing");
	});
	$(".umbral").mouseenter(function(){
	  $(this).addClass("darklyGlowing");
	});
	$(".ethereal").bind("webkitAnimationEnd mozAnimationEnd animationend", function(){
		$(this).removeClass("etherealPulser");
	});
	$(".ethereal").mouseenter(function(){
	  $(this).addClass("etherealPulser");
	});
}