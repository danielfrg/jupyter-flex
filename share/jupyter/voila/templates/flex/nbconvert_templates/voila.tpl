{%- extends "base.tpl" -%}
{%- from "flex.j2" import make_dashboard -%}

{%- block header -%}
<html>
    <head>
    {%- block html_head %}
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        {%- block html_head_title %}
        <title>{{ nb.metadata.get("title", "") or resources["metadata"]["name"] }}</title>
        {%- endblock html_head_title %}
        <link rel="shortcut icon" type="image/ico" href="{{ resources.base_url }}voila/static/favicon.ico"/>

        {%- block html_head_js -%}
        {%- endblock html_head_js -%}

        {%- block html_head_css %}
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
            <link href="{{ resources.base_url }}voila/static/FlexRenderer.css" rel="stylesheet">
        {%- endblock html_head_css %}
    {%- endblock html_head %}
    </head>
{%- endblock header %}

{%- block body %}
<body>

{%- block body_header %}
    <div id="voila_body_loop">
        <div id="executing">
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
            var voilaCellExecuteAfter = function(cellIndex, cellCount) {};
            var voilaCellExecuteBefore = function(cellIndex, cellCount) {
                var el = document.getElementById("loading_text");
                el.innerHTML = "Executing cell " + cellIndex + " of " + cellCount;
            };
        </script>
{%- endblock body_header -%}

{%- block execute_cells -%}
    {# From this point on, the kernel is started #}
    {# This is excuted on base.html.j2 #}

    {%- with kernel_id = kernel_start() %}
        <script id="jupyter-config-data" type="application/json">
            {
                "baseUrl": "{{resources.base_url}}",
                "kernelId": "{{kernel_id}}"
            }
        </script>

        {%- set cellCount = nb.cells|length -%}
        {#
        Voila is using Jinja's Template.generate method to not render the whole template in one go.
        The current implementation of Jinja will however not yield template snippets if we call a blocks' super()
        Therefore it is important to have the cell loop in the template.
        The issue for Jinja is: https://github.com/pallets/jinja/issues/1044
        #}
        <script>
            voilaCellExecuteBefore(1, {{ cellCount }});
        </script>
        {% for cell in cell_generator(nb, kernel_id) %}
        {%- set cellLoop = loop -%}
        <script>
            voilaCellExecuteAfter({{ cellLoop.index }}, {{ cellCount }});
            {%- if cellLoop.index != cellCount %}
            voilaCellExecuteBefore({{ cellLoop.index }} + 1, {{ cellCount }});
            {%- endif %}
        </script>
        {% endfor %}
  {%- endwith -%}
{%- endblock execute_cells -%}

{% block after_body_loop %}
    </div>
{% endblock %}

    <div id="react-root">
        <div class="loading">
            Loading...
        </div>
    </div>

    <script type="text/javascript">
    (function() {
        // Remove the loading element
        var el = document.getElementById("executing");
        el.parentNode.removeChild(el);
    })();
    </script>

    {%- block dashboard_data -%}
    <script id="jupyter-flex-dashboard" type="application/json">
    {{ make_dashboard(nb, resources) }}
    </script>
    {%- endblock dashboard_data -%}

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>

    <script src="{{ resources.base_url }}voila/static/FlexRenderer.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js" integrity="sha256-1fEPhSsRKlFKGfK3eO710tEweHh1fwokU5wFGDHO+vg=" crossorigin="anonymous"></script>

    <script>
        requirejs(['static/voila'], (voila) => voila);
    </script>

{%- endblock body -%}
