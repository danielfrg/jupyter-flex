{% set flex_extends_from = "base.tpl" %}
{%- extends "flex-base.tpl" -%}

{%- block header -%}
<html>
    <head>
    {%- block html_head -%}
        <meta charset="utf-8">
        <title>{{ params.title }}</title>

        {%- block html_head_js -%}
            <script src="{{ resources.base_url }}voila/static/require.min.js"
                integrity="sha256-Ae2Vz/4ePdIu6ZyI/5ZGsYnb+m0JlOmKPjt6XZ9JJkA="
                crossorigin="anonymous">
            </script>
        {%- endblock html_head_js -%}

        {%- block html_head_css -%}
            <link href="{{ resources.base_url }}voila/static/bootstrap.min.css" rel="stylesheet">
            <link href="{{ resources.base_url }}voila/static/flex.min.css" rel="stylesheet">
        {%- endblock html_head_css -%}
    {%- endblock html_head -%}
    </head>
{%- endblock header -%}
