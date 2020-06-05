{% set flex_extends_from = "base.tpl" %}
{%- extends "flex-base.html.j2" -%}

{%- block body -%}
{{ super() }}
{%- endblock body %}

{%- block dashboard_data -%}
{{ dashboard | tojson }}
{%- endblock dashboard_data %}
