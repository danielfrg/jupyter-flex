{%- extends "base.tpl" -%}
{% import "flex.j2" as flex with context %}
{%- block header -%}
<html>
<head>
{%- block html_head %}
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {%- block html_head_title %}
    <title>{{ flex.get_title() }}</title>
    {%- endblock html_head_title %}

    {%- set custom_favicon = flex.get_favicon() -%}
    {%- if custom_favicon | trim | length %}
    <link rel="shortcut icon" type="image/ico" href="{{ resources.base_url }}voila/files/{{ custom_favicon }}" />
    {%- else %}
    <link rel="shortcut icon" type="image/ico" href="{{ resources.base_url }}voila/static/favicon.png" />
    {%- endif %}

    {%- block html_head_css %}
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ resources.base_url }}voila/static/dist/bootstrap-4.5.2.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <link href="{{ resources.base_url }}voila/static/dist/FlexRenderer.css" rel="stylesheet">
    {%- endblock html_head_css %}

    {%- set custom_css = flex.get_custom_css() -%}
    {%- if custom_css | trim | length %}
    <link href="{{ resources.base_url }}voila/files/{{ custom_css }}" rel="stylesheet">
    {%- endif %}

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
                    <p id="flex-loading-text">Executing notebook</p>
                </div>
            </div>
        </div>

        <script>
            var voilaCellExecuteAfter = function(cellIndex, cellCount) {};
            var voilaCellExecuteBefore = function(cellIndex, cellCount) {
                var el = document.getElementById("flex-loading-text");
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
                "baseUrl": "{{ resources.base_url }}",
                "kernelId": "{{ kernel_id }}"
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

    <div id="flex-modal"></div>
    <div id="flex-root">
        <div class="container-fluid d-flex flex-row loading">
            <div class="text-center">
                <p id="flex-loading-text">... building dashboard ...</p>
            </div>
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
    {{ flex.make_dashboard(nb, resources) }}
    </script>
    {%- endblock dashboard_data -%}

    {%- set mimetype = 'application/vnd.jupyter.widget-state+json' -%}
    {%- if mimetype in nb.metadata.get("widgets",{}) %}
    <script type="{{ mimetype }}">
    {{ nb.metadata.widgets[mimetype] | json_dumps }}
    </script>
    {%- endif %}

    {%- block footer_js -%}
    <script src="{{ resources.base_url }}voila/static/dist/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="{{ resources.base_url }}voila/static/dist/bootstrap-4.5.2.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
    <script src="{{ resources.base_url }}voila/static/dist/require-2.3.6.min.js" integrity="sha256-1fEPhSsRKlFKGfK3eO710tEweHh1fwokU5wFGDHO+vg=" crossorigin="anonymous"></script>
    <script>
        requirejs.config({ baseUrl: '{{resources.base_url}}voila/static/', waitSeconds: 30})
    </script>
    <script src="{{ resources.base_url }}voila/static/dist/FlexRenderer.js"></script>
    {%- endblock footer_js -%}
</voila>
{%- endblock body -%}

{%- block footer %}
{%- endblock footer -%}
