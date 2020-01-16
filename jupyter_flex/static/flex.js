// History tabs
// Taken from: https://github.com/jeffdavidgreen/bootstrap-html5-history-tabs

+function ($) {
    'use strict';
    $.fn.historyTabs = function() {
        var that = this;
        window.addEventListener('popstate', function(event) {
            if (event.state) {
                $(that).filter('[href="' + event.state.url + '"]').tab('show');
            }
        });
        return this.each(function(index, element) {
            $(element).on('show.bs.tab', function() {
                var stateObject = {'url' : $(this).attr('href')};

                if (window.location.hash && stateObject.url !== window.location.hash) {
                    window.history.pushState(stateObject, document.title, window.location.pathname + $(this).attr('href'));
                } else {
                    window.history.replaceState(stateObject, document.title, window.location.pathname + $(this).attr('href'));
                }
            });
            if (!window.location.hash && $(element).is('.active')) {
                // Shows the first element if there are no query parameters.
                $(element).tab('show');
            } else if ($(this).attr('href') === window.location.hash) {
                $(element).tab('show');
            }
        });
    };
}(jQuery);

$('.navbar a[data-toggle="tab"]').historyTabs();

// Activate tooltips

$(function () {
    $('[data-toggle="tooltip"]').tooltip({html: true})
    $('#kernel-activity').tooltip({placement: "bottom", title: kernelStatus, html: true})
    $('[data-toggle="popover"]').popover({html: true})
})


var kernel_status = "";

function kernelStatus() {
    return "Kernel: " + kernel_display_name + "<br>Status: " + kernel_status;
}

// Kernel status

window.debug_init = async (voila) => {
    const kernel = await voila.connectKernel();
    kernel.statusChanged.connect((sender, status) => {
      switch (status) {
        case "idle":
            $("#kernel-activity").removeClass("filled-circle").addClass("circle");
            break;
        case "busy":
            $("#kernel-activity").removeClass("circle").addClass("filled-circle");
            break;
        case "restarting":
            kernel_status = "Restarting";
            break;
        case "connected":
            kernel_status = "Connected";
            break;
        case "reconnecting":
            kernel_status = "Reconnecting";
            break;
        default:
            console.log("Unknown status: " + status);
      }
    });
};

// Plotting libraries

var plot_resize = function() {
    if (flex_layout == "fill") {
        var counter = 0;

        var looper = setInterval(function() {
            var nodelist = document.querySelectorAll(".js-plotly-plot")
            var plots = Array.from(nodelist)
            plots.map(function (obj){ obj.style.width = "100%"; })
            plots.map(function (obj){ obj.style.height = "100%"; })
            if (nodelist.length > 0) {
                window.dispatchEvent(new Event("resize"))
            }

            var nodelist = document.querySelectorAll(".bqplot")
            var plots = Array.from(nodelist)
            plots.map(function (obj){ obj.style.width = "100%"; })
            plots.map(function (obj){ obj.style.height = "100%"; })
            if (nodelist.length > 0) {
                window.dispatchEvent(new Event("resize"));
            }

            var nodelist = document.querySelectorAll(".vega-embed")
            var plots = Array.from(nodelist)
            if (nodelist.length > 0) {
                window.dispatchEvent(new Event("resize"));
            }

            if (counter >= 25) {
                clearInterval(looper);
            }
            counter++;
        }, 200);
    }
}
plot_resize();  // Call it once for initial page load

flex_nav_click = function() {
    plot_resize();
}
