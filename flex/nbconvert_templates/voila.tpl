{%- extends "base.tpl" -%}

{# Global variables #}
{% set structure = {} %}

{# Default parameters for the dashboard #}
{% set default_title = nb.metadata.get("title", "") or resources["metadata"]["name"] %}
{% set params = {"orientation": "columns", "title": default_title} %}

{# Overwrite parameters if there is a cell tagged "parameters" like papermill #}
{% for cell in nb.cells %}
    {% set tags = cell.metadata.get("tags", []) %}
    {% if "parameters" in tags %}
        {% for line in cell["source"].split("\n") %}
            {% if line | trim | length %}
                {% if line.split("=") | length == 2 %}
                    {% set key = line.split("=")[0] | trim  %}
                    {% set value = line.split("=")[1] | replace("\\\"", "|?|") | replace("\"", " ") | replace("|?|", "\"") | trim %}
                    {% set _ = params.update( {key: value })  %}
                {% endif %}
            {% endif %}
        {% endfor %}
    {% endif %}
{% endfor %}

{# Set Flex direction based on orientation #}
{% if params["orientation"] == "columns" %}
{% set _ = params.update({"flex_direction": "row"}) %}
{% set _ = params.update({"flex_section_direction": "row"}) %}
{% elif params["orientation"] == "rows" %}
{% set _ = params.update({"flex_direction": "column"}) %}
{% set _ = params.update({"flex_section_direction": "column"}) %}
{% endif %}

{%- macro startswith_strip(text, chars) -%}
{# Print text if it starts with a set of characters and strip those from the text #}
{%- if text.startswith(chars) -%}
    {{ text[chars | length:] | trim }}
{%- endif -%}
{%- endmacro -%}

{%- macro find_item_startswith(list, chars, default="") -%}
{# Iterate list and print if one value starts with the target characters #}
{%- for item in list %}
    {%- if item.startswith(chars) -%}
        {{ item }}
        {%- break -%}
    {%- endif -%}
{%- endfor -%}
{{ default }}
{%- endmacro -%}

{%- macro render_chart(chart) -%}
{# Render a chart as a card with optional title and footer #}
{% if "cell" in chart %}
    {% set cell = chart.cell %}

    {% block any_cell scoped %}
    {% if chart.get("display", "") == "none" %}
        <div style="display: none;">
            {{ super() }}
        </div>
    {% else %}
        <div class="card" style="flex: {{ chart.size }} {{ chart.size }} 0px;">
            {# The cell Title #}
            <div class="card-header">{{ chart.header }}</div>

            {# The cell content #}
            <div class="card-body">{{ super() }}</div>

            {# The cell footer #}
            {% if chart.footer %}
                <div class="card-footer text-muted">{{ chart.footer }}</div>
            {% endif %}
        </div>
    {% endif %}
    {% endblock %}
{% endif %}
{% endmacro %}

{# This block overrides the default behaviour of directly starting the kernel and executing the notebook #}
{% block before_notebook_execute %}
{% endblock before_notebook_execute %}

{% block header %}
<head>
    <meta charset="utf-8">
    <title>{{ params.title }}</title>

    <link href="{{ resources.base_url }}voila/static/bootstrap.min.css" rel="stylesheet">
    <link href="{{ resources.base_url }}voila/static/flex.min.css" rel="stylesheet">

    <script src="{{ resources.base_url }}voila/static/require.min.js"></script>
</head>
{% endblock %}

{%- block body -%}

{%- block body_header -%}
<div id="voila_body_loop">
    <div id="loading">
        <div class="container-fluid d-flex flex-row loading">
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p id="loading_text">Executing notebook</p>
            </div>
        </div>
    </div>

    <script>
        var voila_process = function(cell_index, cell_count) {
            var el = document.getElementById("loading_text")
            el.innerHTML = "Executing cell " + cell_index + " of " + cell_count
        }
    </script>
{%- endblock body_header -%}

{%- block body_loop -%}
{# Here we execute all the cells and create the structure variable #}

{# from this point on, the kernel is started #}
{%- with kernel_id = kernel_start() -%}
<script id="jupyter-config-data" type="application/json">
    {
        "baseUrl": "{{ resources.base_url }}",
        "kernelId": "{{ kernel_id }}"
    }
</script>
{% set cell_count = nb.cells|length %}
{#
Voila is using Jinjas Template.generate method to not render the whole template in one go.
The current implementation of Jinja will however not yield template snippets if we call a blocks super()
Therefore it is important to have the cell loop in the template.
The issue for Jinja is: https://github.com/pallets/jinja/issues/1044
#}
{% set _ = structure.update({"pages": []}) %}
{% set vars = {"current_page": {}, "current_section": {}, "current_chart": {} } %}

{%- for cell in cell_generator(nb, kernel_id) -%}
    {% set cellloop = loop %}
    <script>
        voila_process({{ cellloop.index }}, {{ cell_count }})
    </script>

    {% set cell_type = cell["cell_type"] %}
    {% set cell_source = cell["source"] %}
    {% set cell_tags = cell.get("metadata", {}).get("tags", []) %}

    {% if cell_type == "markdown" %}
        {% set h3_title = startswith_strip(cell_source, "### ") %}
        {% if h3_title | trim | length %}
            {# If there is no h1 or h2 and notebook starts with h3 #}
            {% if not vars.current_page %}
                {% set _ = vars.update({"current_page": {"title": "", "sections": []} }) %}
            {% endif %}
            {% if not vars.current_section %}
                {% set _ = vars.update({"current_section": {"header": "", "tags": [], "charts": []}}) %}
            {% endif %}

            {% if vars.current_chart %}
                {% set _ = vars.current_section["charts"].append(vars.current_chart) %}
            {% endif %}
            {% set _ = vars.update({"current_chart": {"header": h3_title}}) %}
        {% endif %}

    {% endif %}

    {% if cell_type == "code" %}
        {% set show = find_item_startswith(cell_tags, "show") %}
        {% set hidden = find_item_startswith(cell_tags, "hidden") %}

        {% if show | trim | length or hidden | trim | length %}
            {% if show | trim | length %}
                {% set _ = vars.current_chart.update({"cell": cell}) %}
            {% endif %}

            {% if hidden | trim | length %}
                {% set _ = vars.current_chart.update({"cell": cell, "display": "none"}) %}
            {% endif %}

            {% set _ = vars.current_chart.update({"tags": cell_tags}) %}

            {% set _ = vars.current_chart.update({"size": "500"}) %}
            {% set size = find_item_startswith(cell_tags, "size=") %}
            {% if size | trim | length %}
                {% set size = startswith_strip(size, "size=") | trim %}
                {% set _ = vars.current_chart.update({"size": size}) %}
            {% endif %}
        {% endif %}

    {% endif %}

{%- endfor -%}

{# Add final page and section #}
{% set _ = vars.current_section["charts"].append(vars.current_chart) %}
{% set _ = vars.current_page["sections"].append(vars.current_section) %}
{% set _ = structure["pages"].append(vars.current_page) %}

{% endwith %}

</div> <!-- voila_body_loop -->
{%- endblock body_loop -%}

{%- block body_content -%}
    <div id="application" style="display: none">
        <nav class="navbar navbar-default navbar-fixed-top">
            <span class="navbar-brand">{{ params.title }}</span>
        </nav>

        {% for page in structure.pages %}
            <div class="container-fluid d-flex flex-{{ params.flex_direction }} dashboard-container">
            {% for section in page.sections %}
                <div class="d-flex flex-{{ params.flex_direction }} section">
                {% for chart in section.charts %}
                    {{ render_chart(chart) }}
                {% endfor %}
                </div>
            {% endfor %}
            </div>
        {% endfor %}
    </div>
{%- endblock body_content -%}

{%- block body_footer -%}
    <script type="text/javascript">
        (function() {
        // remove the loading element
        var el = document.getElementById("loading")
        el.parentNode.removeChild(el)
        // show the app
        el = document.getElementById("application")
        el.style.display = "unset"
        })();
    </script>

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

{%- endblock body -%}
