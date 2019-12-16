{%- extends "base.tpl" -%}
{% import "macros.j2" as macros %}

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
{% set _ = params.update({"flex_section_direction": "column"}) %}
{% elif params["orientation"] == "rows" %}
{% set _ = params.update({"flex_direction": "column"}) %}
{% set _ = params.update({"flex_section_direction": "row"}) %}
{% endif %}

{%- macro render_chart(chart, class="") -%}
{# Render a chart as a card with optional title and footer #}
{% if "cell" in chart %}
    {% set cell = chart.cell %}
    {% block any_cell scoped %}
        {% if chart.get("display", "") == "none" %}
            <div style="display: none;">
                {{ super() }}
            </div>
        {% elif chart.get("type", "") == "inputs" %}
            <form>
            {{ super() }}
            </form>
        {% else %}
            <div class="card {{ class }}" style="flex: {{ chart.size }} {{ chart.size }} 0px;">
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
<html>
    <meta charset="utf-8">
    <title>{{ params.title }}</title>

    <link href="{{ resources.base_url }}voila/static/bootstrap.min.css" rel="stylesheet">
    <link href="{{ resources.base_url }}voila/static/flex.min.css" rel="stylesheet">
    <script src="{{ resources.base_url }}voila/static/require.min.js"></script>
</html>
{% endblock %}

{%- block body -%}

{%- block body_header -%}

<style>
{% include "overwrite.min.css" %}
</style>

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
{% set cell_count = nb.cells | length %}
{# Voila is using Jinjas Template.generate method to not render the whole template in one go.
The current implementation of Jinja will however not yield template snippets if we call a blocks super()
Therefore it is important to have the cell loop in the template.
The issue for Jinja is: https://github.com/pallets/jinja/issues/1044 #}

{# Generate the structure of the dashboard on the structure variable#}
{% set _ = structure.update({"meta": [], "pages": []}) %}
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
        {% set h2_title = macros.startswith_strip(cell_source, "## ") %}
        {% if h2_title | trim | length %}
            {# If there is no h1 and notebook starts with h2 #}
            {% if not vars.current_page %}
                {% set _ = vars.update({"current_page": {"title": "", "direction": params.flex_direction, "sections": [], "sidebar": {} } }) %}
            {% endif %}

            {# Add the current chart to the current section before defining a new one #}
            {% if vars.current_chart %}
                {% set _ = vars.current_section["charts"].append(vars.current_chart) %}
                {% set _ = vars.update({"current_chart": {}}) %}
            {% endif %}

            {# Add current section to page before defining a new one #}
            {% if vars.current_section %}
                {% set is_sidebar = macros.find_item_startswith(vars.current_section.tags, "sidebar") %}
                {% if is_sidebar | length | trim %}
                    {% set _ = vars.current_page.update({"sidebar": vars.current_section}) %}
                {% else %}
                    {% set _ = vars.current_page["sections"].append(vars.current_section) %}
                {% endif %}
            {% endif %}

            {# Create new section and use tags to override defaults #}
            {% set _ = vars.update({"current_section": {"title": h2_title, "tags": cell_tags, "charts": []}}) %}

            {% set _ = vars.current_section.update({"direction": params.flex_section_direction}) %}
            {% set orientation = macros.find_item_startswith(cell_tags, "orientation=") %}
            {% if orientation | trim | length %}
                {% set orientation = orientation["orientation=" | length:] | trim %}
                {% if orientation == "columns" %}
                    {% set _ = vars.current_section.update({"direction": "row"}) %}
                {% elif orientation == "rows" %}
                    {% set _ = vars.current_section.update({"direction": "column"}) %}
                {% endif %}
            {% endif %}

            {% set _ = vars.current_section.update({"size": "500"}) %}
            {% set size = macros.find_item_startswith(cell_tags, "size=") %}
            {% if size | trim | length %}
                {% set size = size["size=" | length:] | trim %}
                {% set _ = vars.current_section.update({"size": size}) %}
            {% endif %}
        {% endif %}

        {% set h3_title = macros.startswith_strip(cell_source, "### ") %}
        {% if h3_title | trim | length %}
            {# If there is no h1 or h2 and notebook starts with h3 #}
            {% if not vars.current_page %}
                {% set _ = vars.update({"current_page": {"title": "", "direction": params.flex_direction, "sections": []} }) %}
            {% endif %}
            {% if not vars.current_section %}
                {% set _ = vars.update({"current_section": {"title": "", "direction": params.flex_direction, "tags": [], "charts": []}}) %}
            {% endif %}

            {% if vars.current_chart %}
                {% set _ = vars.current_section["charts"].append(vars.current_chart) %}
            {% endif %}
            {% set _ = vars.update({"current_chart": {"header": h3_title}}) %}
        {% endif %}

    {% endif %}

    {% if cell_type == "code" %}
        {% set meta = macros.find_item_startswith(cell_tags, "meta") %}
        {% set inputs = macros.find_item_startswith(cell_tags, "inputs") %}
        {% set show = macros.find_item_startswith(cell_tags, "show") %}

        {% if meta | trim | length or inputs | trim | length or show | trim | length %}
            {% if meta | trim | length %}
                {% set _ = structure.meta.append({"cell": cell, "display": "none"}) %}
                {% continue %}
            {% endif %}

            {% if inputs | trim | length %}
                {% set _ = vars.current_chart.update({"cell": cell, "type": "inputs"}) %}
            {% endif %}

            {% if show | trim | length %}
                {% set _ = vars.current_chart.update({"cell": cell}) %}
            {% endif %}

            {% set _ = vars.current_chart.update({"tags": cell_tags}) %}

            {% set _ = vars.current_chart.update({"size": "500"}) %}
            {% set size = macros.find_item_startswith(cell_tags, "size=") %}
            {% if size | trim | length %}
                {% set size = macros.startswith_strip(size, "size=") | trim %}
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
        {{ structure }}
        <nav class="navbar navbar-default navbar-fixed-top">
            <span class="navbar-brand">{{ params.title }}</span>
        </nav>

        {% for chart in structure.meta %}
            {{ render_chart(chart) }}
        {% endfor %}

        {% for page in structure.pages %}

            <div class="container-fluid d-flex flex-{{ params.flex_direction }} dashboard-container">

            {% if page.sidebar %}
                <div class="col-xl-2 bd-sidebar sidebar">
                    {% for chart in page.sidebar.charts %}
                        {{ render_chart(chart) }}
                    {% endfor %}
                </div>
            {% endif %}

            {% for section in page.sections %}
                <div class="d-flex flex-{{ section.direction }} section section-{{ section.direction }}" style="flex: {{ section.size }} {{ section.size }} 0px;">
                {% for chart in section.charts %}
                    {{ render_chart(chart, class="card-" + section.direction) }}
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
