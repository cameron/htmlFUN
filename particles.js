$(function(){
	var rgb = function(r,g,b,a){
	    a = a == undefined ? 1 : a;
	    return 'rgba('+r+','+g+','+b+','+a+')';
	}

	var canvas = document.getElementById('umm');
	var ctx = canvas.getContext('2d');
	var fs = [ctx.fillRect, ctx.clearRect, ctx.strokeRect];
	var fs = [ctx.fillRect];
	var spastic = function(){
	    var f,r,g,b,a,x,y,w,h;
	    for(var i=0; i < 1000; i++){
		f = fs[Math.round(Math.random())];
		f = fs[0];
		r = Math.round(Math.random()*255);
		g = Math.round(Math.random()*255);
		b = Math.round(Math.random()*255);
		a = Math.random();
		x = Math.random()*canvas.width;
		y = Math.random()*canvas.height;
		w = 1 + Math.random()*10;
		h = 1 + Math.random()*10;
		ctx.fillStyle = rgb(r,g,b,a);
		f.call(ctx,x,y,w,h);
	    }
	}
	setInterval(spastic, 50);
});
      
