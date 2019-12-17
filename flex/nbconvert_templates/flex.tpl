{% set flex_extends_from = "full.tpl" %}
{%- extends "flex-base.tpl" -%}

{%- block header -%}
<html>
    <head>
    {%- block html_head -%}
        <meta charset="utf-8">
        <title>{{ params.title }}</title>
    {%- endblock html_head -%}
    </head>
{%- endblock header -%}
