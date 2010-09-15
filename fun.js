var fun = function(){

    fun = {};

    var canvas,ctx;

    var rgb = function(r,g,b,a){
        a = a == undefined ? 1 : a;
        return 'rgba('+r+','+g+','+b+','+a+')';
    };

    var pages = {
        'van pollock 2.0': [function(){
            var spastic = function(){
                var f,r,g,b,x,y,w,h;
                for(var i=0; i < 2000; i++){
                    r = Math.round(Math.random()*255);
                    g = Math.round(Math.random()*255);
                    b = Math.round(Math.random()*255);
                    a = Math.random();
                    x = Math.random()*canvas.width;
                    y = Math.random()*canvas.height;
                    w = 1 + Math.random()*5;
                    h = 1 + Math.random()*5;
                    ctx.fillStyle = rgb(r,g,b,a);
                    ctx.fillRect(x,y,w,h);
                }
            }
            setInterval(spastic, 50);
        }, 'what? you expect me to finish the tutorial before i make something? pffft'],
        'mirage':[function(){
            var impression_size = 7;
            var cminx = $("#umm").offset().left;
            var cmaxx = cminx + canvas.width;
            var cminy = $("#umm").offset().top;
            var cmaxy = cminy + canvas.height;
            var dot_size = 0;
            $("body").mousemove(function(e){
                if(e.pageX > cminx &&
                   e.pageX < cmaxx &&
                   e.pageY > cminy &&
                   e.pageY < cmaxy){
                    impression_size = (cmaxy - e.pageY) / cminy * 3;
                    ctx.fillStyle = rgb(0,0,0,.1);
                    ctx.fillRect(e.pageX - cminx - 1, e.pageY - cminy/2, 2, 2);
                }
            });
            var img = new Image();
            var dupe_ctx;
            var impress = function(){
                var imgd, pix,x,y,w,h,r,g,b;
                for(var i = 0; i < 1000; i++){
                    r = 0, g = 0, b = 0;
                    x = Math.random()*img.width;
                    y = Math.random()*img.height;
                    w = 1 + Math.random()*impression_size;
                    h = 1 + Math.random()*impression_size;
                    imgd = dupe_ctx.getImageData(x,y,w,h);
                    pix = imgd.data;
                    pix_len = pix.length;
                    real_len = pix_len / 4;
                    for(var j = 0; j < pix_len; j+=4){
                        r += pix[j];
                        g += pix[j+1];
                        b += pix[j+2];
                    }
                    r /= real_len;
                    g /= real_len;
                    b /= real_len;
                    for(var j = 0; j < pix_len; j+=4){
                        pix[j] = r;
                        pix[j+1] = g;
                        pix[j+2] = b;
                    }
                    ctx.putImageData(imgd,x,y);
                }
            };

            img.onload = function(){
                var can2 = $("<canvas id='dupe' style='display:none' width='"+canvas.width+"'+ height='"+canvas.height+"'></canvas>")[0];
                dupe_ctx = can2.getContext('2d');
                ctx.drawImage(img, 0,0);
                dupe_ctx.drawImage(img, 0,0);
                setInterval(impress, 100);
            }
            img.src = 'images/bliss.jpg';
        }, 'move the mouse up and down'],
        'particles':[function(){
            var max_size = 2
            var ps = [];
            var nps = 200;
            for(var i=0; i < nps; i++){
//                  ps[i]  = [(i + 1)*10,
//                            100,
//                            1,
//                            0,0]
                    ps[i]  = [Math.random()*canvas.width,
                              Math.random()*canvas.height,
                              .3 + Math.random()*max_size,
                              .5 - Math.random(), .5-Math.random()];
//                 ps[i]  = [50,
//                           (i+1)*70,
//                           1,
//                           0,0];
                 if(Math.random() > .8){ ps[i][2] = ps[i][2]*1.6; }
                 ps[i][5] = Math.exp(ps[i][2]);
            }
            var bg_fill_alpha = 1;
            var interval;
            var fs,fx,fy,f,dx,dy,d,d2,i,j,pi,pix,piy,pim,m,pj,black = rgb(0,0,0,bg_fill_alpha), white = rgb(255,255,255);
            ctx.fillStyle = black;
            ctx.fillRect(0,0,canvas.width,canvas.height);
            var lw = rgb(255,255,255,.1);
            var sqrt = {}, sqr = {};
            var max_d = ~~(((canvas.width*canvas.width) + (canvas.height*canvas.height))*1.2);
            var min_d2 = 400;
            for(var x=0; x < max_d; x++){
                //sqrt[x] = Math.sqrt(x);
                sqrt[x] = Math.sqrt(x > min_d2 ? x : min_d2);
            }
            for(var x=0; x < Math.sqrt(max_d*1.1); x++){
                sqr[x] = x*x;
                sqr[-1*x] = sqr[x];
            }
            sqrt[0] = 1; // saves us using if to avoid computing force of node against itself
            sqr[0] = 1;
            var logged = false;
            var forces = [];
            var make_history = function(){
                ctx.fillStyle = black;
                ctx.fillRect(0,0,canvas.width,canvas.height);
                ctx.fillStyle = white;
                for(i=0; i < nps; i++){
                    pi = ps[i];
                    pix = pi[0];
                    piy = pi[1];
                    fx = 0, fy = 0;
                    //ctx.beginPath();
                    for(j=0; j < nps; j++){
                        pj = ps[j];
                        dx = pj[0] - pix;
                        dy = pj[1] - piy;
                        d2 = ~~((sqr[~~dx]) + (sqr[~~dy]));
                        d = sqrt[d2];
                        f = pj[5] / sqr[~~d];
                        fx += f*(dx/d);
                        fy += f*(dy/d);
                        //if(d > 50) continue;
                        //ctx.strokeStyle = rgb(255,255,255,.2*(1-(d/50)));
                        //ctx.moveTo(pix,piy);
                        //ctx.lineTo(pj[0],pj[1]);
                        //ctx.closePath();
                    }
                    //ctx.stroke();
                    pi[3] += fx;
                    pi[4] += fy;
                    pi[0] += pi[3] * .8;
                    pi[1] += pi[4] * .8;
                    if(pi[0] < 0) pi[0] += canvas.width;
                    if(pi[0] > canvas.width) pi[0] -= canvas.width;
                    if(pi[1] < 0) pi[1] += canvas.height;
                    if(pi[1] > canvas.height) pi[1] -= canvas.height;
                    ctx.beginPath();
                    ctx.arc(pi[0],pi[1],pi[2], 0, Math.PI*2);
                    ctx.fill();
                }
            };
            interval = setInterval(make_history, 25);
            //$("body").bind('keypress',function(e){make_history();});
        }, 'obligatory, really'],
        'stop':[function(){},'precious, precious battery']
    };

    fun.refresh = function(){
        document.location.reload();
    };

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
        var page = pages[location.hash.substr(1)] || pages['van pollock 2.0'];
        $("#caption").html(page[1]);
        page[0]();
    };

    return fun;
}();

$(fun.init);
