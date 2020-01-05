{% set flex_extends_from = "full.tpl" %}
{% set flex_app_initial_display = "unset" %}
{% extends "flex-base.tpl" %}

{%- block header -%}
<html>
    <head>
    {%- block html_head -%}
        <title>{{ params.title }}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        {% set favicon = params.get("favicon", "") %}
        {% if favicon | trim | length %}
            <link id="favicon" rel="shortcut icon" type="image/png" href="data:image/png;base64,{{ include_external_base64_img(favicon) }}" width="30" height="30">
        {% endif %}

        {% block html_head_js %}
            {%- block html_head_js_jquery -%}
                <script>{{ include_template("static/jquery.min.js") }}</script>
            {%- endblock html_head_js_jquery -%}

            {%- block html_head_js_bootstrap -%}
                <script>{{ include_template("static/bootstrap.min.js") }}</script>
            {%- endblock html_head_js_bootstrap -%}

            {%- block html_head_js_requirejs -%}
                <script>{{ include_template("static/require.min.js") }}</script>
            {%- endblock html_head_js_requirejs -%}

            {%- block html_head_js_embed_amd -%}
                <script>{{ include_template("static/embed-amd.js") }}</script>
            {%- endblock html_head_js_embed_amd -%}

        {%- endblock html_head_js -%}

        {%- block html_head_css -%}
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <style>{{ include_template("static/bootstrap.min.css") }}</style>
            <style>{{ include_template("static/flex.min.css") }}</style>

            {% set custom_css = params.get("custom_css", "") %}
            {% if custom_css | trim | length %}
                <style>{{ include_external_file(custom_css) }}</style>
            {% endif %}
        {%- endblock html_head_css -%}
    {%- endblock html_head -%}
    </head>
{%- endblock header -%}

{% block navbar_logo %}
{% set logo = params.get("logo", "") %}
{% if logo | trim | length %}
    <img class="logo" src="data:image/png;base64,{{ include_external_base64_img(logo) }}" width="30" height="30">
{% endif %}
{% endblock navbar_logo %}

{%- block body_footer -%}
    <script>{{ include_template("static/flex.js") }}</script>
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
