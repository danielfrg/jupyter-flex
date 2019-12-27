// Trigger a couple of resize events to make plots adjust

var counter = 0;
var looper = setInterval(function() {
    var nodelist = document.querySelectorAll(".js-plotly-plot")
    var plots = Array.from(nodelist)
    plots.map(function (obj){ obj.style.height = "100%"; })

    window.dispatchEvent(new Event("resize"));
    if (counter >= 25) {
        clearInterval(looper);
    }
    counter++;
}, 200);

flex_nav_click = function() {
    window.dispatchEvent(new Event("resize"));
}
