//var mousedown = false;
//(function () {
//    var color = "#000000";
//    var context = $("canvas")[0].getContext("2d");
//    var canvas = $("canvas");
//    var lastEvent;

//    var weight = "2";

//    // //Bind weight val to selection on click
//    var updateWeight = function () {
//        return weight;
//    };

//    //Draw on the canvas on mouse events
//    canvas.mousedown(function (e) {
//        lastEvent = e;
//        mousedown = true;
//    }).mousemove(function (e) {
//        if (mousedown) {
//            context.beginPath();
//            context.moveTo(lastEvent.offsetX, lastEvent.offsetY);
//            context.lineTo(e.offsetX, e.offsetY);
//            context.strokeStyle = color;
//            context.lineWidth = updateWeight();
//            context.stroke();
//            lastEvent = e;
//        }
//    }).mouseup(function () {
//        mousedown = false;
//    }).mouseleave(function () {
//        canvas.mouseup();
//    });

//    //Download your drawing
//    //var downloadImg = function () {
//    //    var img = canvas[0].toDataURL("image/png");
//    //    var $imgLink = $("#download").attr("href", img);
//    //}

//    function clearCanvas() {
//        var canvas = document.getElementById("sig-canvas");
//        var context = canvas.getContext('2d');
//        context.clearRect(0, 0, canvas.width, canvas.height);
//    }
//    var clearBtn = document.getElementById("sig-clearBtn");
//    var submitBtn = document.getElementById("sig-submitBtn");
//    clearBtn.addEventListener("click", function (e) {
//        clearCanvas();
//        $('#sig-canvas').css('border-style', 'dotted');
//        $('#sig-canvas').css('pointer-events', 'initial');
//        $('#sig-canvas').css('cursor', 'crosshair');
//        g_hasSelectedSignature = false;
//    }, false);


//})();


(function () {

    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimaitonFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var canvas = document.getElementById("sig-canvas");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    var drawing = false;
    var mousePos = {
        x: 0,
        y: 0
    };
    var lastPos = mousePos;

    canvas.addEventListener("mousedown", function (e) {
        drawing = true;
        lastPos = getMousePos(canvas, e);
    }, false);

    canvas.addEventListener("mouseup", function (e) {
        drawing = false;
    }, false);

    canvas.addEventListener("mousemove", function (e) {
        mousePos = getMousePos(canvas, e);
    }, false);

    // Add touch event support for mobile
    canvas.addEventListener("touchstart", function (e) {

    }, false);

    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var me = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(me);
    }, false);

    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var me = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(me);
    }, false);

    canvas.addEventListener("touchend", function (e) {
        var me = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(me);
    }, false);

    function getMousePos(canvasDom, mouseEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        }
    }

    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        }
    }

    function renderCanvas() {
        if (drawing) {
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
            lastPos = mousePos;
        }
    }

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);

    (function drawLoop() {
        requestAnimFrame(drawLoop);
        renderCanvas();
    })();

    function clearCanvas() {
        canvas.width = canvas.width;
    }

    // Set up the UI
    var sigText = document.getElementById("sig-dataUrl");
    var sigImage = document.getElementById("sig-image");
    var clearBtn = document.getElementById("sig-clearBtn");
    //var submitBtn = document.getElementById("sig-submitBtn");
    clearBtn.addEventListener("click", function (e) {
        clearCanvas();
        $('#uploadSignature').val('');
        g_base64SignatureFromLocalFile = '';
        $('#sig-canvas').css('border-style', 'dotted');
        $('#sig-canvas').css('pointer-events', 'initial');
        $('#sig-canvas').css('cursor', 'crosshair');
    }, false);
    //submitBtn.addEventListener("click", function (e) {
    //    var dataUrl = canvas.toDataURL();
    //    sigText.innerHTML = dataUrl;
    //    sigImage.setAttribute("src", dataUrl);
    //}, false);

})();