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

        {% block html_head_js %}
            {%- block html_head_js_jquery -%}
                <script>
                {% include "flex-jquery.min.js" %}
                </script>
            {%- endblock html_head_js_jquery -%}

            {%- block html_head_js_bootstrap -%}
                <script>
                {% include "flex-bootstrap.min.js" %}
                </script>
            {%- endblock html_head_js_bootstrap -%}

            {%- block html_head_js_requirejs -%}
                <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js" integrity="sha256-Ae2Vz/4ePdIu6ZyI/5ZGsYnb+m0JlOmKPjt6XZ9JJkA=" crossorigin="anonymous"></script>
            {%- endblock html_head_js_requirejs -%}

            {%- block html_head_js_embed_amd -%}
                {# For this one to be included we would need a include_raw filter#}
                <script src="https://unpkg.com/@jupyter-widgets/html-manager@*/dist/embed-amd.js" crossorigin="anonymous"></script>
            {%- endblock html_head_js_embed_amd -%}

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
