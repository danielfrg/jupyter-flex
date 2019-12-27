{% set flex_extends_from = "base.tpl" %}
{% set flex_app_initial_display = "none" %}
{%- extends "flex-base.tpl" -%}

{%- block header -%}
<html>
    <head>
    {%- block html_head -%}
        <title>{{ params.title }}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" type="image/ico" href="voila/static/favicon.ico"/>

        {%- block html_head_js -%}
            {%- block html_head_js_jquery -%}
                <script src="{{ resources.base_url }}voila/static/jquery.min.js"
                    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
                    crossorigin="anonymous">
                </script>
            {%- endblock html_head_js_jquery -%}

            {%- block html_head_js_bootstrap -%}
                <script src="{{ resources.base_url }}voila/static/bootstrap.min.js"
                    integrity="sha256-WqU1JavFxSAMcLP2WIOI+GB2zWmShMI82mTpLDcqFUg="
                    crossorigin="anonymous">
                </script>
            {%- endblock html_head_js_bootstrap -%}

            {%- block html_head_js_requirejs -%}
                <script src="{{ resources.base_url }}voila/static/require.min.js"
                    integrity="sha256-1fEPhSsRKlFKGfK3eO710tEweHh1fwokU5wFGDHO+vg="
                    crossorigin="anonymous">
                </script>
            {%- endblock html_head_js_requirejs -%}

            {%- block html_head_js_embed_amd -%}
                <script src="{{ resources.base_url }}voila/static/embed-amd.js"
                    integrity="sha256-WNABv12QeAkbjAaH+iionmx/fdlzbSK5eJsjUtg4Ldc="
                    crossorigin="anonymous">
                </script>
            {%- endblock html_head_js_embed_amd -%}

        {%- endblock html_head_js -%}

        {%- block html_head_css -%}
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <link href="{{ resources.base_url }}voila/static/bootstrap.min.css" rel="stylesheet">
            <link href="{{ resources.base_url }}voila/static/flex.min.css" rel="stylesheet">
        {%- endblock html_head_css -%}
    {%- endblock html_head -%}
    </head>
{%- endblock header -%}


{%- block body_header -%}
    <div id="voila_body_loop">
        <div id="loading">
            <div class="container-fluid d-flex flex-row loading">
                <div class="text-center">
                    <div class="spinner-grow" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <p id="loading_text">Executing notebook</p>
                </div>
            </div>
        </div>

        <script>
            var voila_process = function(cell_index, cell_count) {
                var el = document.getElementById("loading_text")
                el.innerHTML = "Executing cell " + cell_index + " of " + cell_count
            }
        </script>
{%- endblock body_header -%}


{% block execute_cells %}
    {%- with kernel_id = kernel_start() -%}
    <script id="jupyter-config-data" type="application/json">
    {
        "baseUrl": "{{resources.base_url}}",
        "kernelId": "{{kernel_id}}"
    }
    </script>

    {% set cell_count = nb.cells | length %}
    {# Voila is using Jinjas Template.generate method to not render the whole template in one go.
    The current implementation of Jinja will however not yield template snippets if we call a blocks super()
    Therefore it is important to have the cell loop in the template.
    The issue for Jinja is: https://github.com/pallets/jinja/issues/1044 #}

    {# Generate the structure of the dashboard on the structure variable#}

    {%- for cell in cell_generator(nb, kernel_id) -%}
        {% set cellloop = loop %}
        <script>
            voila_process({{ cellloop.index }}, {{ cell_count }})
        </script>
    {%- endfor -%}

    {% endwith %}
{% endblock %}


{% block after_body_loop %}
    </div> <!-- voila_body_loop -->
{% endblock %}


{%- block body_footer -%}
    <script type="text/javascript">
        (function() {
        // Remove the loading element
        var el = document.getElementById("loading")
        el.parentNode.removeChild(el)
        // Show the app
        el = document.getElementById("application")
        el.style.display = "unset"
        })();
    </script>

    <script>
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
    </script>

</body>
{%- endblock body_footer -%}
