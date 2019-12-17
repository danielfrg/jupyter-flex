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
            <script>{% include "flex-require.min.js" %}</script>
        {%- endblock html_head_js -%}

        {%- block html_head_css -%}
            <style>{% include "flex-bootstrap.min.css" %}</style>
            <style>{% include "flex.min.css" %}</style>
        {%- endblock html_head_css -%}
    {%- endblock html_head -%}
    </head>
{%- endblock header -%}
