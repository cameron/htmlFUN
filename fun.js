var fun = function(){

    fun = {};

    var canvas,ctx;

    var rgb = function(r,g,b,a){
        a = a == undefined ? 1 : a;
        return 'rgba('+r+','+g+','+b+','+a+')';
    };

    var pages = {
        'imprectionism': [function(){
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
        'impressionism':[function(){
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
        }, 'imprectionism gave me the right idea (move the mouse up and down)'],
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
        var page = pages[location.hash.substr(1)] || pages.imprectionism;
        $("#caption").html(page[1]);
        page[0]();
    };

    return fun;
}();

$(fun.init);
