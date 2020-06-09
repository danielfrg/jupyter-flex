{% extends "basic.tpl" %}
{% import "flex.j2" as flex with context %}

{%- block header -%}
<html>
<head>
{%- block html_head %}
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {%- block html_head_title %}
    <title>{{ flex.get_title() }}</title>
    {%- endblock html_head_title %}
    <link rel="shortcut icon" type="image/ico" href="favicon.ico" />

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous" />
    <style>{{ include_template("static/FlexRenderer.css") }}</style>

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
                <p id="loading_text">... loading ...</p>
            </div>
        </div>
    </div>

    {%- block dashboard_data -%}
    <script id="jupyter-flex-dashboard" type="application/json">
    {{ flex.make_dashboard(nb, resources) }}
    </script>
    {%- endblock dashboard_data -%}

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js" integrity="sha256-1fEPhSsRKlFKGfK3eO710tEweHh1fwokU5wFGDHO+vg=" crossorigin="anonymous"></script>
    {%- if dev_mode %}
    <script src="http://localhost:8866/voila/static/FlexRenderer.js"></script>
    <script src="https://unpkg.com/@jupyter-widgets/html-manager@0.19.0/dist/embed-amd.js" crossorigin="anonymous"></script>
    {%- else %}
    <script>{{ include_template("./static/FlexRenderer.js") }}</script>
    {%- endif %}
</body>
{%- endblock body %}
