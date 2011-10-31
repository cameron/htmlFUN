var boxes, collisions, num;
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
        'boxfitting':[function(){
            num       = 20; //starting num and running total
            var maxnum    = 2000;
            var dimx      = 267;
            var dim       = 400;
            var dimborder = 5;
            var growth    = 2;
            boxes     = new Array();
            var time, ctx, dupe_ctx;
            function init_collisions(){
                collisions = new Array(dimx+dimborder*2+growth);
                for(var i = 0; i < dim; i++) collisions[i] = new Array(dim+dimborder*2+growth);
            }
            init_collisions();
            var img = new Image(); // can't do anything until this is loaded -- main code block is in onload at bottom

            function readBackground(x,y){
                return dupe_ctx.getImageData(x,y,1,1).data;
            }

            // space filling box
            function Box() {
                this.dead = false;
                this.init();
            }

            Box.prototype.init = function () {
                this.okToDraw = false;
                this.x        = parseInt(dimborder+Math.random()*(dimx-dimborder*2));
                this.y        = parseInt(dimborder+Math.random()*(dim-dimborder*2));
                this.d        = 0;
                this.myc      = readBackground(this.x,this.y);
            }

            Box.prototype.draw = function () {
                this.expand();
                if (this.okToDraw) {
                    imgd      = dupe_ctx.getImageData(this.x,this.y,this.d,this.d);
                    pix       = imgd.data;
                    pix_len   = pix.length;
                    real_len  = pix_len / 4;
                    for(var j = 0; j < pix_len; j+=4){
                        pix[j]   = this.myc[0];
                        pix[j+1] = this.myc[1];
                        pix[j+2] = this.myc[2];
                    }
                    ctx.putImageData(imgd,this.x,this.y);
                }
            }
              
            Box.prototype.on_every_pixel = function (op) {
                for (var j = this.x; j < this.x + this.d; j++)
                    for (var k = this.y; k < this.y + this.d; k++)
                        op(j,k);
            }

            Box.prototype.expand = function () {
                var obstructed = false;
                var check_obstruction = function(j,k){ if(collisions[j][k] > 1) obstructed = true; }
                this.on_every_pixel(check_obstruction);
                if(!obstructed){
                    this.d += growth;
                    if(this.x + this.d > dimx + dimborder*2 || this.y + this.d > dim + dimborder*2) obstructed = true;
                    //check for obstructions
                    for(var i = this.x + this.d - growth; i < this.x + this.d; i++){
                        for (var j = this.y; j < this.y + this.d; j++){
                            if(!collisions[i])console.log(i);
                            if(collisions[i][j] > 0) obstructed = true;
                        }
                    }
                    for(var j = this.y + this.d - growth; j < this.y + this.d; j++){
                        for (var i = this.x; i < this.x + this.d; i++){
                            if(collisions[i][j] > 0) obstructed = true;
                        }
                    }
                    if(obstructed) this.d -= 2;
                }

                if (obstructed) {
                  this.dead = true;
                  this.okToDraw = false;
                  makeNewBox();
                } else {
                  this.okToDraw = true;
                }
            }

            function makeNewBox() {
              if (num<maxnum) {
                boxes[num] = new Box;
                num++;
              }
            }
            img.onload = function(){
                var can2 = $("<canvas id='dupe' style='display:none' width='"+canvas.width+"'+ height='"+canvas.height+"'></canvas>")[0];
                dupe_ctx = can2.getContext('2d');
                
                //reinit -- why is this necessary?
                canvas = document.getElementById('umm');
                ctx = canvas.getContext('2d');

                ctx.drawImage(img, dimborder, dimborder);
                dupe_ctx.drawImage(img, dimborder, dimborder);
                for(var i = 0; i < num; i++) boxes[i] = new Box;
                function draw(){
                    init_collisions();
                    var mark_location = function(j,k){ 
                        if(!collisions[j]) collisions[j] = [];
                        if(collisions[j][k] === undefined) collisions[j][k] = 0;
                        collisions[j][k] += 1; 
                    }
                    for (var n = 0; n < num; n++) boxes[n].on_every_pixel(mark_location);
                    for (var n = 0; n < num; n++) if(!boxes[n].dead) boxes[n].draw();
                    var count = 0;
                    for(var i = 0; i < collisions.length; i++)
                        for(var j = 0; j < collisions[i].length; j++)
                            if(collisions[i][j] && (collisions[i][j] > 0)) count++;
                    console.log(count)
                }
                ctx.fillRect(0,0,dimx+dimborder*2,dim+dimborder*2);
                setInterval(draw, 100);
            }
            img.src = 'images/bliss.jpg';
        }, 'enjoy'],
        'particles':[function(){
            var max_size = 2
            var ps = [];
            var nps = 200;
            for(var i=0; i < nps; i++){
                ps[i]  = [Math.random()*canvas.width,
                          Math.random()*canvas.height,
                          .3 + Math.random()*max_size,
                          .5 - Math.random(), .5-Math.random()];
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
