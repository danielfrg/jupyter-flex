{%- extends flex_extends_from -%}
{% import "macros.j2" as macros %}

{# Global variables #}
{% set dashboard = {} %}

{# Default parameters for the dashboard #}
{% set default_title = nb.metadata.get("title", "") or resources["metadata"]["name"] %}
{% set params = {"title": default_title, "orientation": "columns"} %}

{# Overwrite parameters if there is a cell tagged "parameters" #}
{# We only look at params prefixed with flex_ #}
{% for cell in nb.cells %}
    {% set tags = cell.metadata.get("tags", []) %}
    {% if "parameters" in tags %}
        {% for line in cell["source"].split("\n") %}
            {% if line | trim | length %}
                {% if line.startswith("flex_") %}
                    {% if line.split("=") | length == 2 %}
                        {% set key = line.split("=")[0] | trim  %}
                        {% set key = key["flex_" | length:]  %}
                        {% set value = line.split("=")[1] | replace("\\\"", "|?|") | replace("\"", " ") | replace("|?|", "\"") | trim %}
                        {% set _ = params.update({key: value})  %}
                    {% endif %}
                {% endif %}
            {% endif %}
        {% endfor %}
    {% endif %}
{% endfor %}

{# Set default flex-direction based on orientation param #}
{% if params["orientation"] == "rows" %}
    {% set _ = params.update({"page_flex_direction": "column"}) %}
    {% set _ = params.update({"section_flex_direction": "row"}) %}
{% else %}
    {# Catch all is the default of orientation=column #}
    {% set _ = params.update({"page_flex_direction": "row"}) %}
    {% set _ = params.update({"section_flex_direction": "column"}) %}
{% endif %}

{# ------------------------------------------------------------------------- #}
{# Macros (that need to be in this file) #}
{# ------------------------------------------------------------------------- #}

{%- macro render_card(card, header=true, wrapper="", class="") -%}
{# Render cells as a card with optional title and footer #}
    {% if card.cells | length %}
       {% if card.get("wrapper", "") == "form" %}
            <form>
                {% for cell in card.cells %}
                    {{ render_cell(cell) }}
                {% endfor %}
            </form>
        {% else %}
            <div class="card {{ class }}" style="flex: {{ card.size }} {{ card.size }} 0px;">
                {# The cell Title #}
                {% if header and (card.header | trim | length) %}
                    <div class="card-header"><h6>{{ card.header }}</h6></div>
                {% endif %}

                {# The cell content #}
                <div class="card-body d-flex flex-column">
                    {% for cell in card.cells %}
                        {{ render_cell(cell) }}
                    {% endfor %}
                </div>

                {# The cell footer #}
                {% if card.footer %}
                    <div class="card-footer text-muted">{{ render_cell(card.footer) }}</div>
                {% endif %}
            </div>
        {% endif %}
    {% endif %}
{% endmacro %}

{% macro render_cell(cell, display="") %}
{% block any_cell scoped %}
    {% if display == "none" %}
        <div style="display: none;">
        {{ super() }}
        </div>
    {% else %}
        {{ super() }}
    {% endif %}
{% endblock %}
{% endmacro %}

{# ------------------------------------------------------------------------- #}
{# Content #}
{# ------------------------------------------------------------------------- #}

{%- block body -%}

{%- block body_header -%}
{%- endblock body_header -%}

{%- block body_loop -%}

    {% block execute_cells %}
    {% endblock %}

    {# ------------------------------------------------------------------------- #}
    {# Create dashboard structure variable by iterating the notebook cells  #}
    {# ------------------------------------------------------------------------- #}

    {% set _ = dashboard.update({"meta": [], "pages": [] }) %}
    {% set vars = {} %}
    {% set _ = vars.update({"current_page": {} }) %}
    {% set _ = vars.update({"current_page_dir": params.page_flex_direction}) %}
    {% set _ = vars.update({"current_section": {} }) %}
    {% set _ = vars.update({"current_section_dir": params.section_flex_direction}) %}
    {% set _ = vars.update({"current_card": {} }) %}

    {% for cell in nb.cells %}
        {% set cell_type = cell["cell_type"] %}
        {% set cell_source = cell["source"] %}
        {% set cell_tags = cell.get("metadata", {}).get("tags", []) %}

        {% if cell_type == "markdown" %}

            {% set h1_title = macros.startswith_strip(cell_source, "# ") %}
            {% if h1_title | trim | length %}
                {# Add the current card to the current section #}
                {% if vars.current_card %}
                    {% set _ = vars.current_section["cards"].append(vars.current_card) %}
                {% endif %}

                {# Add current section to page #}
                {% if vars.current_section and vars.current_section.cards %}
                    {% set _ = vars.current_page["sections"].append(vars.current_section) %}
                {% endif %}

                {# Add current page to dashboard before defining a new one #}
                {% if vars.current_page and vars.current_page.sections %}
                    {% set _ = dashboard["pages"].append(vars.current_page) %}
                {% endif %}

                {# Define new current objects #}

                {# Overwrite direction if there is an orientation tag #}
                {% set orientation = macros.find_item_startswith(cell_tags, "orientation=") %}
                {% if orientation | trim | length %}
                    {% set orientation = orientation["orientation=" | length:] | trim %}
                    {% if orientation == "rows" %}
                        {% set _ = vars.update({"current_page_dir": "column"}) %}
                        {% set _ = vars.update({"current_section_dir": "row"}) %}
                    {% else %}
                        {# Default is "columns" #}
                        {% set _ = vars.update({"current_page_dir": "row"}) %}
                        {% set _ = vars.update({"current_section_dir": "column"}) %}
                    {% endif %}
                {% endif %}

                {% set _ = vars.update({"current_page": {"title": h1_title, "direction": vars.current_page_dir, "sections": [], "sidebar": {} } }) %}
                {% set _ = vars.update({"current_section": {"title": "", "direction": vars.current_section_dir, "size": "500", "tags": cell_tags, "cards": []}}) %}
                {% set _ = vars.update({"current_card": {}}) %}
            {% endif %}

            {% set h2_title = macros.startswith_strip(cell_source, "## ") %}
            {% if h2_title | trim | length %}
                {# If there is no h1 and notebook starts with h2 #}
                {% if not vars.current_page %}
                    {% set _ = vars.update({"current_page": {"title": "", "direction": vars.current_page_dir, "sections": [], "sidebar": {} } }) %}
                {% endif %}

                {# Add the current card to the current section before defining a new one #}
                {% if vars.current_card %}
                    {% set _ = vars.current_section["cards"].append(vars.current_card) %}
                    {% set _ = vars.update({"current_card": {}}) %}
                {% endif %}

                {# Add current section to page before defining a new one #}
                {% if vars.current_section and vars.current_section.cards %}
                    {% set is_sidebar = macros.find_item_startswith(vars.current_section.tags, "sidebar") %}
                    {% if is_sidebar | trim | length %}
                        {% set _ = vars.current_page.update({"sidebar": vars.current_section}) %}
                    {% else %}
                        {% set _ = vars.current_page["sections"].append(vars.current_section) %}
                    {% endif %}
                {% endif %}

                {# Create new section and use tags to override defaults #}
                {% set _ = vars.update({"current_section": {"title": h2_title, "direction": vars.current_section_dir, "size": "500", "tags": cell_tags, "cards": []}}) %}

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
                    {% set _ = vars.update({"current_page": {"title": "", "direction": vars.current_page_dir, "sections": [], "sidebar": {}} }) %}
                {% endif %}
                {% if not vars.current_section %}
                    {% set _ = vars.update({"current_section": {"title": "", "direction": vars.current_section_dir, "size": "500", "tags": [], "cards": []}}) %}
                {% endif %}

                {% if vars.current_card %}
                    {% set _ = vars.current_section["cards"].append(vars.current_card) %}
                {% endif %}
                {% set _ = vars.update({"current_card": {"header": h3_title, "size": "500", "tags": cell_tags, "cells": []}}) %}

                {% set size = macros.find_item_startswith(cell_tags, "size=") %}
                {% if size | trim | length %}
                    {% set size = macros.startswith_strip(size, "size=") | trim %}
                    {% set _ = vars.current_card.update({"size": size}) %}
                {% endif %}
            {% endif %}

            {% set is_text = macros.find_item_startswith(cell_tags, "text") %}
            {% if (is_text | trim | length) %}
                {% set _ = vars.current_card.cells.append(cell) %}
            {% endif %}

            {% set is_footer = macros.find_item_startswith(cell_tags, "footer") %}
            {% if (is_footer | trim | length) %}
                {% set _ = vars.current_card.update({"footer": cell}) %}
            {% endif %}

        {% elif cell_type == "code" %}
            {% set is_meta = macros.find_item_startswith(cell_tags, "meta") %}
            {% set is_inputs = macros.find_item_startswith(cell_tags, "inputs") %}
            {% set is_chart = macros.find_item_startswith(cell_tags, "chart") %}

            {% if (is_meta | trim | length) %}
                {# Meta cells dont create section or pages #}
                {% set _ = dashboard.meta.append(cell) %}
                {% continue %}

            {% elif (is_inputs | trim | length) or (is_chart | trim | length) %}
                {# Create current_page and current_section if notebook starts with a tagged cell #}
                {% if not vars.current_page %}
                    {% set _ = vars.update({"current_page": {"title": "", "direction": params.page_flex_direction, "sections": [], "sidebar": {} } }) %}
                {% endif %}
                {% if not vars.current_section %}
                    {% set _ = vars.update({"current_section": {"title": "", "direction": vars.current_section_dir, "size": "500", "tags": [], "cards": []}}) %}
                {% endif %}
                {% if not vars.current_card %}
                    {% set _ = vars.update({"current_card": {"header": "", "cells": [], "size": "500", "tags": []}}) %}
                {% endif %}

                {% set _ = vars.current_card.cells.append(cell) %}
            {% endif %}

        {% endif %}
    {% endfor %}

    {# Add final page and section #}
    {% set _ = vars.current_section["cards"].append(vars.current_card) %}
    {% set _ = vars.current_page["sections"].append(vars.current_section) %}
    {% set _ = dashboard["pages"].append(vars.current_page) %}

    {% block after_body_loop %}
    {% endblock %}
{%- endblock body_loop -%}

{# ------------------------------------------------------------------------- #}
{# Write the HTML from the dashboard structure #}
{# ------------------------------------------------------------------------- #}

{%- block body_content -%}

    <div id="application" style="display: {{ flex_app_initial_display }}">

        <nav class="navbar navbar-expand-md navbar-dark">
            <div class="container-fluid">
                {% block navbar_logo %}
                {% endblock navbar_logo %}

                <span class="navbar-brand">{{ params.title }}</span>

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navPages" aria-controls="navPages" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navPages">
                        <ul class="nav navbar-nav mr-auto">
                            {% for page in dashboard.pages %}
                                {% if page.title %}
                                    {% set page_slug = page.title | lower | replace(" ", "-") %}
                                    {% set active = "active" if loop.index == 1 else "" %}
                                    {% set aira_selected = "true" if loop.index == 1 else "false" %}
                                    <li class="nav-item"><a onclick="flex_nav_click();" class="nav-link {{ active }}" href="#{{ page_slug }}" data-toggle="tab" role="tab" aria-controls="{{ page_slug }}" aria-expanded="true">{{ page.title }}</a></li>
                                {% endif %}
                            {% endfor %}
                        </ul>

                    {% set source_code = params.get("source_code", "") %}
                    {% set author = params.get("author", "") %}
                        {% if author | trim | length %}
                            <span class="navbar-text">{{ author }}</span>
                        {% endif %}
                    <ul class="navbar-nav">
                        {% if source_code | trim | length %}
                            <li class="nav-item">
                                <a class="nav-link" href="{{ source_code }}" target="_blank" rel="noopener" aria-label="Source Code"><i class="material-icons">code</i> Source Code</a>
                            </li>
                        {% endif %}
                    </ul>
                </div>
            </div>
        </nav>

        {% for cell in dashboard.meta %}
            {{ render_cell(cell, display="none") }}
        {% endfor %}

        <div class="page-tabs tab-content">

            {% for page in dashboard.pages %}
                {% set page_slug = page.title | lower | replace(" ", "-") %}
                {% set active = "active" if loop.index == 1 else "" %}

                <div class="tab-pane {{ active }}" id="{{ page_slug }}">

                    <div class="page-wrapper container-fluid d-flex">

                        {% if page.sidebar %}
                            <div class="col-xl-2 bd-sidebar sidebar">
                                {% for card in page.sidebar.cards %}
                                    {{ render_card(card, wrapper="form") }}
                                {% endfor %}
                            </div>
                        {% endif %}

                        <div class="page-content container-fluid d-flex flex-{{ page.direction }}">
                            {% for section in page.sections %}
                                {% set section_direction = section.direction %}
                                {% set is_tabbed = "tabs" in section.tags %}
                                {% set section_tabs = "section-tabs" if is_tabbed else "" %}
                                {% if is_tabbed %}
                                    {% set section_direction = "column" %}
                                {% endif %}

                                <div class="d-flex flex-{{ section_direction }} section section-{{ section.direction }} {{ section_tabs }}" style="flex: {{ section.size }} {{ section.size }} 0px;">

                                    {% if is_tabbed %}
                                        {% set section_slug = section.title | lower | replace(" ", "-") %}
                                        {% set nav_fill = "" if "no-nav-fill" in section.tags else " nav-fill" %}
                                        {% set fade = "" if "no-fade" in section.tags else " fade" %}
                                        {% set li_items = [] %}
                                        {% set div_items = [] %}
                                        {% for card in section.cards %}
                                            {% set card_slug = card.header | lower | replace(" ", "-") %}
                                            {% set tab_name = (card_slug ~ "-tab") | lower | replace(" ", "-") %}
                                            {% set active = " active show" if loop.index == 1 else "" %}
                                            {% set aria_selected = " true" if loop.index == 1 else "false" %}
                                            {% set _ = li_items.append('<li class="nav-item"> <a class="nav-link' ~ active ~ '" id="' ~ tab_name ~ '" href="#' ~ card_slug ~ '" data-toggle="tab" role="tab" aria-controls="' ~ card_slug ~ '" aria-selected="' ~ aria_selected ~ '">' ~ card.header ~ '</a> </li>') %}
                                            {% set _ = div_items.append('<div class="tab-pane' ~ fade ~ active ~ '" id="' ~ card_slug ~ '" role="tabpanel" aria-labelledby="' ~ tab_name ~ '">' ~ render_card(card, header=false) ~ '</div>') %}
                                        {% endfor %}

                                        <ul class="nav nav-tabs nav-bordered {{ nav_fill }}" id="{{ section_slug }}-nav" role="tablist">
                                            {% for li_item in li_items %}
                                                {{ li_item }}
                                            {% endfor %}
                                        </ul>

                                        <div class="tab-content" id="{{ section_slug }}-tabs">
                                            {% for div_item in div_items %}
                                                {{ div_item }}
                                            {% endfor %}
                                        </div>

                                    {% else %}
                                        {# Default: Just show each card #}
                                        {% for card in section.cards %}
                                            {{ render_card(card, class="card-" + section.direction) }}
                                        {% endfor %}
                                    {% endif %}
                                </div>
                            {% endfor %}{# page.sections #}
                        </div><!-- page-content -->

                    </div><!-- page-wrapper -->

                </div><!-- tab-pane -->
            {% endfor %}{# pages #}
        </div><!-- tab-content page-tabs -->
    </div>
{%- endblock body_content -%}

{%- block body_footer -%}
{%- endblock body_footer -%}

{%- endblock body -%}
