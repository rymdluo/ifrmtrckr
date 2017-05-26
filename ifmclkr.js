$("#ifmwpr").css("z-index", "999999999");
$("#ifmwpr").css("display", "block");

var clked = false;
$('#ifmwpr iframe').ifmtrckr({
    blurCallback: function () {
        clked = true;
        $("#ifmwpr").css("z-index", "1");
        $("#ifmwpr").css("display", "none");
    }
});
var fmwpr = document.getElementById('ifmwpr');
var stdbdy = (document.compatMode == "CSS1Compat") ? document.documentElement : document.body;

function fmfolo(e) {
    if (window.event) {
        fmwpr.style.top = (window.event.y - 5) + stdbdy.scrollTop + 'px';
        fmwpr.style.left = (window.event.x - 5) + stdbdy.scrollLeft + 'px';
    }
    else {
        fmwpr.style.top = (e.pageY - 5) + 'px';
        fmwpr.style.left = (e.pageX - 5) + 'px';
    }
}
document.onmousemove = function (e) {
    if (clked == false) {
        fmfolo(e);
    }
}
