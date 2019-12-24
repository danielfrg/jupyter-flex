{%- extends flex_extends_from -%}
{% import "flex-macros.j2" as macros %}

{# Global variables #}
{% set dashboard = {} %}

{# Default parameters for the dashboard #}
{% set default_title = nb.metadata.get("title", "") or resources["metadata"]["name"] %}
{% set params = {"title": default_title, "orientation": "columns"} %}

{%- macro render_chart(chart, header=true, class="") -%}
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
                    {% if header and (chart.header | trim | length) %}
                        <div class="card-header">{{ chart.header }}</div>
                    {% endif %}

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

{# ------------------------------------------------------------------------- #}
{# Content #}
{# ------------------------------------------------------------------------- #}

{%- block body -%}

{# Overwrite parameters if there is a cell tagged "parameters" like papermill #}
{% for cell in nb.cells %}
    {% set tags = cell.metadata.get("tags", []) %}
    {% if "parameters" in tags %}
        {% for line in cell["source"].split("\n") %}
            {% if line | trim | length %}
                {% if line.split("=") | length == 2 %}
                    {% set key = line.split("=")[0] | trim  %}
                    {% set value = line.split("=")[1] | replace("\\\"", "|?|") | replace("\"", " ") | replace("|?|", "\"") | trim %}
                    {% set _ = params.update({key: value})  %}
                {% endif %}
            {% endif %}
        {% endfor %}
    {% endif %}
{% endfor %}

{# Set Flex direction based on orientation param #}
{% if params["orientation"] == "rows" %}
    {% set _ = params.update({"page_flex_direction": "column"}) %}
    {% set _ = params.update({"section_flex_direction": "row"}) %}
{% else %}
    {# Catch all is the default of orientation=column #}
    {% set _ = params.update({"page_flex_direction": "row"}) %}
    {% set _ = params.update({"section_flex_direction": "column"}) %}
{% endif %}

{%- block body_header -%}
{%- endblock body_header -%}

{%- block body_loop -%}

    {% block execute_cells %}
    {% endblock %}

    {# ------------------------------------------------------------------------- #}
    {# Create dashboard structure variable by iterating the notebook cells  #}
    {# ------------------------------------------------------------------------- #}

    {% set _ = dashboard.update({"meta": [], "pages": []}) %}
    {% set vars = {"current_page": {}, "current_section": {}, "current_chart": {} } %}

    {% for cell in nb.cells %}
        {% set cell_type = cell["cell_type"] %}
        {% set cell_source = cell["source"] %}
        {% set cell_tags = cell.get("metadata", {}).get("tags", []) %}

        {% if cell_type == "markdown" %}

            {% set h2_title = macros.startswith_strip(cell_source, "## ") %}
            {% if h2_title | trim | length %}
                {# If there is no h1 and notebook starts with h2 #}
                {% if not vars.current_page %}
                    {% set _ = vars.update({"current_page": {"title": "", "direction": params.page_flex_direction, "sections": [], "sidebar": {} } }) %}
                {% endif %}

                {# Add the current chart to the current section before defining a new one #}
                {% if vars.current_chart %}
                    {% set _ = vars.current_section["charts"].append(vars.current_chart) %}
                    {% set _ = vars.update({"current_chart": {}}) %}
                {% endif %}

                {# Add current section to page before defining a new one #}
                {% if vars.current_section and vars.current_section.charts %}
                    {% set is_sidebar = macros.find_item_startswith(vars.current_section.tags, "sidebar") %}
                    {% if is_sidebar | trim | length %}
                        {% set _ = vars.current_page.update({"sidebar": vars.current_section}) %}
                    {% else %}
                        {% set _ = vars.current_page["sections"].append(vars.current_section) %}
                    {% endif %}
                {% endif %}

                {# Create new section and use tags to override defaults #}
                {% set _ = vars.update({"current_section": {"title": h2_title, "direction": params.section_flex_direction, "size": "500", "tags": cell_tags, "charts": []}}) %}

                {# Overwrite direction if there is an orientation tag #}
                {% set orientation = macros.find_item_startswith(cell_tags, "orientation=") %}
                {% if orientation | trim | length %}
                    {% set orientation = orientation["orientation=" | length:] | trim %}
                    {% if orientation == "columns" %}
                        {% set _ = vars.current_section.update({"direction": "row"}) %}
                    {% elif orientation == "rows" %}
                        {% set _ = vars.current_section.update({"direction": "column"}) %}
                    {% endif %}
                {% endif %}

                {# Overwrite size if there is a size tag #}
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
                    {% set _ = vars.update({"current_page": {"title": "", "direction": params.page_flex_direction, "sections": [], "sidebar": {}} }) %}
                {% endif %}
                {% if not vars.current_section %}
                    {% set _ = vars.update({"current_section": {"title": "", "direction": params.section_flex_direction, "size": "500", "tags": [], "charts": []}}) %}
                {% endif %}

                {% if vars.current_chart %}
                    {% set _ = vars.current_section["charts"].append(vars.current_chart) %}
                {% endif %}
                {% set _ = vars.update({"current_chart": {"header": h3_title, "size": "500", "tags": cell_tags}}) %}

                {% set size = macros.find_item_startswith(cell_tags, "size=") %}
                {% if size | trim | length %}
                    {% set size = macros.startswith_strip(size, "size=") | trim %}
                    {% set _ = vars.current_chart.update({"size": size}) %}
                {% endif %}
            {% endif %}

        {% endif %}

        {% if cell_type == "code" %}

            {% set meta = macros.find_item_startswith(cell_tags, "meta") %}
            {% set inputs = macros.find_item_startswith(cell_tags, "inputs") %}
            {% set chart = macros.find_item_startswith(cell_tags, "chart") %}

            {% if (meta | trim | length) or (inputs | trim | length) or (chart | trim | length) %}
                {# Create current_page and current_section if notebook starts with a tagged cell #}
                {% if not vars.current_page %}
                    {% set _ = vars.update({"current_page": {"title": "", "direction": params.page_flex_direction, "sections": [], "sidebar": {} } }) %}
                {% endif %}
                {% if not vars.current_section %}
                    {% set _ = vars.update({"current_section": {"title": "", "direction": params.section_flex_direction, "size": "500", "tags": [], "charts": []}}) %}
                {% endif %}

                {% if meta | trim | length %}
                    {% set _ = dashboard.meta.append({"cell": cell, "display": "none"}) %}
                    {% continue %}
                {% endif %}

                {% if inputs | trim | length %}
                    {% set _ = vars.current_chart.update({"cell": cell, "type": "inputs"}) %}
                {% endif %}

                {% if chart | trim | length %}
                    {% set _ = vars.current_chart.update({"cell": cell}) %}
                {% endif %}
            {% endif %}

        {% endif %}
    {% endfor %}

    {# Add final page and section #}
    {% set _ = vars.current_section["charts"].append(vars.current_chart) %}
    {% set _ = vars.current_page["sections"].append(vars.current_section) %}
    {% set _ = dashboard["pages"].append(vars.current_page) %}


    {% block after_body_loop %}
    {% endblock %}
{%- endblock body_loop -%}

{# ------------------------------------------------------------------------- #}
{# Write the HTML base on the dashboard structure #}
{# ------------------------------------------------------------------------- #}
{%- block body_content -%}

    <div id="application" style="display: {{ flex_app_initial_display }}">
        <nav class="navbar navbar-default navbar-fixed-top">
            <span class="navbar-brand">{{ params.title }}</span>
        </nav>

        {% for chart in dashboard.meta %}
            {{ render_chart(chart) }}
        {% endfor %}

        {% for page in dashboard.pages %}

            <div class="dashboard-container container-fluid d-flex">
                {% if page.sidebar %}
                    <div class="col-xl-2 bd-sidebar sidebar">
                        {% for chart in page.sidebar.charts %}
                            {{ render_chart(chart) }}
                        {% endfor %}
                    </div>
                {% endif %}

                <div class="container-fluid d-flex flex-{{ params.page_flex_direction }} sections">
                    {% for section in page.sections %}
                        <div class="d-flex flex-{{ section.direction }} section section-{{ section.direction }}" style="flex: {{ section.size }} {{ section.size }} 0px;">

                            {% if "tablist" in section.tags %}
                                {% set section_name = section.title | lower | replace(" ", "-") %}
                                {% set nav_fill = "" if "no-nav-fill" in section.tags else "nav-fill" %}
                                {% set fade = "" if "no-fade" in section.tags else "fade" %}
                                {% set li_items = [] %}
                                {% set div_items = [] %}
                                {% for chart in section.charts %}
                                    {% set chart_name = chart.header | lower | replace(" ", "-") %}
                                    {% set tab_name = (chart_name ~ "-tab") | lower | replace(" ", "-") %}
                                    {% set _ = li_items.append('<li class="nav-item"> <a class="nav-link' ~ (" active" if loop.index == 1 else "") ~ '" id="' ~ tab_name ~ '" data-toggle="tab" href="#' ~ chart_name ~ '" role="tab" aria-controls="' ~ chart_name ~ '" aria-selected="' ~ ("true" if loop.index == 1 else "false") ~ '">' ~ chart.header ~ '</a> </li>') %}
                                    {% set _ = div_items.append('<div class="tab-pane ' ~ fade ~ (" show active" if loop.index == 1 else "") ~ '" id="' ~ chart_name ~ '" role="tabpanel" aria-labelledby="' ~ tab_name ~ '">' ~ render_chart(chart, header=false) ~ '</div>') %}
                                {% endfor %}

                                <ul class="nav nav-tabs {{ nav_fill }}" id="{{ section_name }}-nav" role="tablist">
                                    {% for li_item in li_items %}
                                        {{ li_item }}
                                    {% endfor %}
                                </ul>

                                <div class="tab-content" id="{{ section_name }}-tabs">
                                    {% for div_item in div_items %}
                                        {{ div_item }}
                                    {% endfor %}
                                </div>

                            {% else %}
                                {# Default: Just show each card #}
                                {% for chart in section.charts %}
                                    {{ render_chart(chart, class="card-" + section.direction) }}
                                {% endfor %}
                            {% endif %}
                        </div>
                    {% endfor %}
                </div>
            </div>
        {% endfor %}
    </div>
{%- endblock body_content -%}

{%- block body_footer -%}
{%- endblock body_footer -%}

{%- endblock body -%}
