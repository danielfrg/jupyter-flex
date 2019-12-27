{% set flex_extends_from = "full.tpl" %}
{% set flex_app_initial_display = "block" %}
{% extends "flex-base.tpl" %}

{%- block header -%}
<html>
    <head>
    {%- block html_head -%}
        <title>{{ params.title }}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" type="image/ico" href="voila/static/favicon.ico"/>

        {% block html_head_js %}
            {%- block html_head_js_jquery -%}
                <script>{{ include_file("static/jquery.min.js") }}</script>
            {%- endblock html_head_js_jquery -%}

            {%- block html_head_js_bootstrap -%}
                <script>{{ include_file("static/bootstrap.min.js") }}</script>
            {%- endblock html_head_js_bootstrap -%}

            {%- block html_head_js_requirejs -%}
                <script>{{ include_file("static/require.min.js") }}</script>
            {%- endblock html_head_js_requirejs -%}

            {%- block html_head_js_embed_amd -%}
                <script>{{ include_file("static/embed-amd.js") }}</script>
            {%- endblock html_head_js_embed_amd -%}

        {%- endblock html_head_js -%}

        {%- block html_head_css -%}
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <style>{{ include_file("static/bootstrap.min.css") }}</style>
            <style>{{ include_file("static/flex.min.css") }}</style>
        {%- endblock html_head_css -%}
    {%- endblock html_head -%}
    </head>
{%- endblock header -%}

{%- block body_footer -%}
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

{% block input_group -%}
    <div class="jp-Cell-inputWrapper">
        <div class="jp-InputArea jp-Cell-inputArea">
        </div>
    </div>
{% endblock input_group %}

{% block output_area_prompt %}
    <div class="jp-OutputPrompt jp-OutputArea-prompt">
    </div>
{% endblock output_area_prompt %}
