// Trigger a couple of resize events to make plots adjust

var counter = 0;

var plot_resize = function() {
    var looper = setInterval(function() {
        console.log(1);
        var nodelist = document.querySelectorAll(".js-plotly-plot")
        var plots = Array.from(nodelist)
        plots.map(function (obj){ obj.style.width = "100%"; })
        plots.map(function (obj){ obj.style.height = "100%"; })

        if (nodelist.length > 0) {
            window.dispatchEvent(new Event("resize"));
            console.log("resize")
        }

        var nodelist = document.querySelectorAll(".bqplot")
        var plots = Array.from(nodelist)
        plots.map(function (obj){ obj.style.width = "100%"; })
        plots.map(function (obj){ obj.style.height = "100%"; })

        if (nodelist.length > 0) {
            window.dispatchEvent(new Event("resize"));
            console.log("resize")
        }

        var nodelist = document.querySelectorAll(".vega-embed")
        var plots = Array.from(nodelist)

        if (nodelist.length > 0) {
            window.dispatchEvent(new Event("resize"));
            console.log("resize")
        }

        if (counter >= 25) {
            clearInterval(looper);
        }
        counter++;
    }, 200);

    looper();
}


flex_nav_click = function() {
    plot_resize();
}
