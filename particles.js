var fun = function(){

	fun = {};

	var canvas,ctx;

	var rgb = function(r,g,b,a){
	    a = a == undefined ? 1 : a;
	    return 'rgba('+r+','+g+','+b+','+a+')';
	}

	var pages = {
		'imprectionism': [function(){
			var spastic = function(){
				var f,r,g,b,a,x,y,w,h;
				for(var i=0; i < 1000; i++){
					r = Math.round(Math.random()*255);
					g = Math.round(Math.random()*255);
					b = Math.round(Math.random()*255);
					a = Math.random();
					x = Math.random()*canvas.width;
					y = Math.random()*canvas.height;
					w = 1 + Math.random()*10;
					h = 1 + Math.random()*10;
					ctx.fillStyle = rgb(r,g,b,a);
					ctx.fillRect(x,y,w,h);
				}
			}
			setInterval(spastic, 50);
		}, 'Had to do <em>something</em> with that first bit of draw-how.'],
		'stop':[function(){},'precious, precious battery']
	}

	fun.refresh = function(){
		document.location.reload();
	}

	fun.init = function(){

		// build a nav
		var nav = $("<ul id='nav'></ul>");
		for(var k in pages){
			nav.append("<li><a href='#" + k + "'>" + k + "</li>");
		}
		$("body").prepend(nav);

        // canvas references
		canvas = document.getElementById('umm');
		ctx = canvas.getContext('2d');

        // show me the fun
		window.onhashchange = fun.refresh;
		var page = pages[location.hash.substr(1)] || pages.imprectionism;
		$("#caption").html(page[1]);
		page[0]();
	}

	return fun;
}();

$(fun.init);
