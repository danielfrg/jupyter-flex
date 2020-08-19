{% extends "basic.tpl" %}
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

    {%- block html_head_css %}
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous" />
    {%- if dev_mode %}
    <link rel="stylesheet" href="http://localhost:8866/voila/static/dist/FlexRenderer.css" />
    {%- else %}
    <style>{{ include_file("static/dist/FlexRenderer.css") }}</style>
    {%- endif %}
    {%- endblock html_head_css %}

    {%- set custom_css = flex.get_custom_css() -%}
    {%- if custom_css | trim | length %}
    <style>{{ include_external_file(custom_css) }}</style>
    {%- endif %}
{%- endblock html_head %}
</head>
{%- endblock header %}

{%- block body %}
<body>

    <div id="flex-modal"></div>
    <div id="flex-root">
        <div class="container-fluid d-flex flex-row loading">
            <div class="text-center">
                <p id="flex-loading-text">... building dashboard ...</p>
            </div>
        </div>
    </div>

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

    {%- set mimetype = "application/vnd.illusionist.widget-onchange+json" -%}
    {%- if mimetype in nb.metadata.get("widgets", {}) %}
    <script type="{{ mimetype }}">
    {{ nb.metadata.widgets[mimetype] | json_dumps }}
    </script>
    {%- endif %}

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js" integrity="sha256-1fEPhSsRKlFKGfK3eO710tEweHh1fwokU5wFGDHO+vg=" crossorigin="anonymous"></script>
    {%- if dev_mode %}
    <script src="http://localhost:8866/voila/static/dist/FlexRenderer.js"></script>
    {%- else %}
    {# <script>{{ include_file("./static/dist/jquery-3.5.1.slim.min.js") }}</script> #}
    {# <script>{{ include_file("./static/dist/bootstrap-4.5.2.min.js") }}</script> #}
    {# <script>{{ include_file("./static/dist/require-2.3.6.min.js") }}</script> #}
    <script>{{ include_file("./static/dist/FlexRenderer.js") }}</script>
    {%- endif %}
</body>
{%- endblock body %}

{%- block footer %}
{%- endblock footer -%}
