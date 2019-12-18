{% set flex_extends_from = "full.tpl" %}
{% set flex_app_initial_display = "block" %}
{% extends "flex-base.tpl" %}

{%- block header -%}
<html>
    <head>
    {%- block html_head -%}
        <meta charset="utf-8">
        <title>{{ params.title }}</title>

        {%- block html_head_js -%}
            <script>
            {% include "flex-require.min.js" %}
            </script>
            <script>
            {% include "flex-jquery.min.js" %}
            </script>
        {%- endblock html_head_js -%}

        {%- block html_head_css -%}
            <style>{% include "flex-bootstrap.min.css" %}</style>
            <style>{% include "flex.min.css" %}</style>
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
