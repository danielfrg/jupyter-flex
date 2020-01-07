{%- extends flex_extends_from -%}
{% import "macros.j2" as macros %}

{# Global variables #}
{% set debug = false %}
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
    {% set card_extra_classes = macros.join_all_items_with_prefix(card.tags, "class=", " ") %}
    <div class="card {{ class }} {{ card_extra_classes }}" style="flex: {{ card.size }} {{ card.size }} 0px;">
        {# The cell Title #}
        {% if header and (card.header | trim | length) %}
            <div class="card-header"><h6>{{ card.header }}</h6></div>
        {% endif %}

        {# The cell content #}
        <div class="card-body d-flex flex-column">
            {% if card.cells | length %}
                {% for cell in card.cells %}
                    {{ render_cell(cell) }}
                {% endfor %}
            {% endif %}
        </div>

        {# The cell footer #}
        {% if card.footer %}
            <div class="card-footer text-muted">{{ render_cell(card.footer) }}</div>
        {% endif %}
    </div>
{% endmacro %}

{% macro render_cell(cell, display="unset") %}
{% block any_cell scoped %}
    {% set cell_tags = cell["metadata"].get("tags", []) %}
    {% set cell_extra_classes = macros.join_all_items_with_prefix(cell_tags, "class=", " ") %}
    <div class="cell-wrapper cell-type-{{ cell.cell_type }} {{ cell_extra_classes }}" style="display: {{ display }};">
        {% if debug %}
            {{ cell }}
        {% else %}
            {{ super() }}
        {% endif %}
    </div>
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

    {% set _ = dashboard.update({"meta": [], "pages": [], "sidebar": {} }) %}
    {% set vars = {} %}
    {% set _ = vars.update({"current_page_dir": params.page_flex_direction}) %}
    {% set _ = vars.update({"current_section_dir": params.section_flex_direction}) %}
    {% set _ = vars.update({"current_page": {} }) %}
    {% set _ = vars.update({"current_section": {} }) %}
    {% set _ = vars.update({"current_card": {} }) %}

    {% for cell in nb.cells %}
        {% set cell_type = cell["cell_type"] %}
        {% set cell_source = cell["source"] %}
        {% set cell_tags = cell.get("metadata", {}).get("tags", []) %}

        {% if cell_type == "markdown" %}

            {% set h1_title = macros.startswith_and_strip(cell_source, "# ") %}
            {% if h1_title %}
                {# Add the current card to the current section #}
                {% if vars.current_card %}
                    {% set _ = vars.current_section["cards"].append(vars.current_card) %}
                {% endif %}

                {# Add current section to page #}
                {% if vars.current_section and vars.current_section %}
                    {% set _ = vars.current_page["sections"].append(vars.current_section) %}
                {% endif %}

                {# Add current page to dashboard before defining a new one #}
                {% if vars.current_page and vars.current_page.sections %}
                    {% set is_sidebar = macros.find_item_startswith(vars.current_page.tags, "sidebar") %}
                    {% if is_sidebar %}
                        {% set _ = dashboard.update({"sidebar": vars.current_page}) %}
                    {% else %}
                        {% set _ = dashboard["pages"].append(vars.current_page) %}
                    {% endif %}
                {% endif %}

                {# Define new current_* objects #}

                {# Overwrite default orientation (if tag) #}
                {% set orientation = macros.find_item_startswith(cell_tags, "orientation=") %}
                {% if orientation %}
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

                {% set _ = vars.update({"current_page": {"title": h1_title, "sections": [], "direction": vars.current_page_dir, "tags": cell_tags } }) %}
                {% set _ = vars.update({"current_section": {} }) %}
                {% set _ = vars.update({"current_card": {} }) %}
            {% endif %}

            {% set h2_title = macros.startswith_and_strip(cell_source, "## ") %}
            {% if h2_title %}
                {# If there is no h1 (notebook starts with h2) #}
                {% if not vars.current_page %}
                    {% set _ = vars.update({"current_page": {"title": "", "sections": [], "direction": vars.current_page_dir, "tags": [] } }) %}
                {% endif %}

                {# Add the current card to the current section before defining a new one #}
                {% if vars.current_card %}
                    {% set _ = vars.current_section["cards"].append(vars.current_card) %}
                    {% set _ = vars.update({"current_card": {} }) %}
                {% endif %}

                {# Add current section to page before defining a new one #}
                {% if vars.current_section %}
                    {% set _ = vars.current_page["sections"].append(vars.current_section) %}
                {% endif %}

                {# Create new section and use tags to override defaults #}
                {% set _ = vars.update({"current_section": {"title": h2_title, "cards": [], "direction": vars.current_section_dir, "size": "500", "tags": cell_tags}}) %}

                {# Overwrite default orientation (if tag) #}
                {% set orientation = macros.find_item_startswith(cell_tags, "orientation=") %}
                {% if orientation %}
                    {% set orientation = orientation["orientation=" | length:] | trim %}
                    {% if orientation == "columns" %}
                        {% set _ = vars.current_section.update({"direction": "row"}) %}
                    {% elif orientation == "rows" %}
                        {% set _ = vars.current_section.update({"direction": "column"}) %}
                    {% endif %}
                {% endif %}

                {# Overwrite default size (if tag) #}
                {% set size = macros.find_item_startswith(cell_tags, "size=") %}
                {% if size %}
                    {% set size = size["size=" | length:] | trim %}
                    {% set _ = vars.current_section.update({"size": size}) %}
                {% endif %}
            {% endif %}

            {% set h3_title = macros.startswith_and_strip(cell_source, "### ") %}
            {% if h3_title %}
                {# If there is no h1 or h2 (notebook starts with h3) #}
                {% if not vars.current_page %}
                    {% set _ = vars.update({"current_page": {"title": "", "sections": [], "direction": vars.current_page_dir, "tags": [] } }) %}
                {% endif %}
                {% if not vars.current_section %}
                    {% set _ = vars.update({"current_section": {"title": "", "cards": [], "direction": vars.current_section_dir, "size": "500", "tags": []} }) %}
                {% endif %}

                {# If there is a card we add it to the section #}
                {% if vars.current_card %}
                    {% set _ = vars.current_section["cards"].append(vars.current_card) %}
                {% endif %}

                {# Create current_card with values from this cell #}
                {% set _ = vars.update({"current_card": {"header": h3_title, "cells": [], "size": "500", "tags": cell_tags}}) %}

                {# Overwrite default size (if tag) #}
                {% set size = macros.find_item_startswith(cell_tags, "size=") %}
                {% if size %}
                    {% set size = macros.startswith_and_strip(size, "size=") | trim %}
                    {% set _ = vars.current_card.update({"size": size}) %}
                {% endif %}
            {% endif %}

            {% set is_text = macros.find_item_startswith(cell_tags, "text") %}
            {% set is_footer = macros.find_item_startswith(cell_tags, "footer") %}
            {% if (is_text) or (is_footer) %}
                {# Create current_* objects if notebook starts with a tagged cell #}
                {% if not vars.current_page %}
                    {% set _ = vars.update({"current_page": {"title": "", "direction": params.page_flex_direction, "sections": [] } }) %}
                {% endif %}
                {% if not vars.current_section %}
                    {% set _ = vars.update({"current_section": {"title": "", "cards": [], "direction": vars.current_section_dir, "size": "500", "tags": []}}) %}
                {% endif %}
                {% if not vars.current_card %}
                    {% set _ = vars.update({"current_card": {"header": "", "cells": [], "size": "500", "tags": []}}) %}
                {% endif %}

                {% if is_text %}
                    {% set _ = vars.current_card.cells.append(cell) %}
                {% endif %}

                {% if is_footer %}
                    {% set _ = vars.current_card.update({"footer": cell}) %}
                {% endif %}
            {% endif %}

        {% elif cell_type == "code" %}
            {% set is_meta = macros.find_item_startswith(cell_tags, "meta") %}
            {% set is_inputs = macros.find_item_startswith(cell_tags, "inputs") %}
            {% set is_chart = macros.find_item_startswith(cell_tags, "chart") %}

            {% if is_meta %}
                {# Meta cells dont create section or pages #}
                {% set _ = dashboard.meta.append(cell) %}
                {% continue %}

            {% elif is_inputs or is_chart %}
                {# Create current_* objects if notebook starts with a tagged cell #}
                {% if not vars.current_page %}
                    {% set _ = vars.update({"current_page": {"title": "", "direction": params.page_flex_direction, "sections": [] } }) %}
                {% endif %}
                {% if not vars.current_section %}
                    {% set _ = vars.update({"current_section": {"title": "", "cards": [], "direction": vars.current_section_dir, "size": "500", "tags": []}}) %}
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

    {% for cell in dashboard.meta %}
        {{ render_cell(cell, display="none") }}
    {% endfor %}

    <div id="dashboard" style="display: {{ flex_app_initial_display }}">
        {% set vars = {} %}

        <nav class="navbar navbar-expand-md navbar-dark">
            <div class="container-fluid">
                {% block navbar_logo %}
                {% endblock navbar_logo %}

                <span class="navbar-brand">{{ params.title }}</span>

                {% set author = params.get("author", "") %}
                {% set source_code = params.get("source_code", "") %}

                {% set _ = vars.update({"show_pages": false}) %}
                {% if dashboard.pages | length > 1 %}
                    {% for page in dashboard.pages %}
                        {% if page.title %}
                            {% set _ = vars.update({"show_pages": true}) %}
                        {% endif %}
                    {% endfor %}
                {% endif %}

                {% if vars.show_pages or author or source_code %}
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navPages" aria-controls="navPages" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                {% endif %}

                <div class="collapse navbar-collapse" id="navPages">
                    <ul class="nav navbar-nav mr-auto">
                        {% if vars.show_pages%}
                            {% for page in dashboard.pages %}
                                {% if page.title %}
                                    {% set page_slug = page.title | lower | replace(" ", "-") %}
                                    {% set active = "active" if loop.index == 1 else "" %}
                                    {% set aira_selected = "true" if loop.index == 1 else "false" %}
                                    <li class="nav-item"><a onclick="flex_nav_click();" class="nav-link {{ active }}" href="#{{ page_slug }}" data-toggle="tab" role="tab" aria-controls="{{ page_slug }}" aria-expanded="true">{{ page.title }}</a></li>
                                {% endif %}
                            {% endfor %}
                        {% endif %}
                    </ul>

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

        <div class="container-fluid content-wrapper">
        <div class="row">

        {% set _ = vars.update({"sidebar_classes": ""}) %}
        {% if dashboard.sidebar %}
            <nav class="col-md-2 global-sidebar">
                <div class="d-flex flex-column section">
                    {% for card in dashboard.sidebar.sections[0].cards %}
                        {{ render_card(card, class="card-column") }}
                    {% endfor %}
                </div>
            </nav>
            {% set _ = vars.update({"sidebar_classes": "col-md-9 ml-sm-auto col-lg-10 "}) %}
        {% endif %}

        <main role="main" class="{{ vars.sidebar_classes }}page-tabs tab-content">

            {% for page in dashboard.pages %}
                {% set page_slug = page.title | lower | replace(" ", "-") %}
                {% set active = "active" if loop.index == 1 else "" %}

                <div class="tab-pane {{ active }}" id="{{ page_slug }}">

                    {% set page_extra_classes = macros.join_all_items_with_prefix(page.tags, "class=", " ") %}
                    <div class="page-wrapper container-fluid d-flex flex-{{ page.direction }} {{ page_extra_classes }}">

                        {% for section in page.sections %}
                            {% set section_direction = section.direction %}
                            {% set is_tabbed = "tabs" in section.tags %}
                            {% set section_tabs = "section-tabs" if is_tabbed else "" %}
                            {% set section_extra_classes = macros.join_all_items_with_prefix(section.tags, "class=", " ") %}
                            {% if is_tabbed %}
                                {% set section_direction = "column" %}
                            {% endif %}

                            <div class="d-flex flex-{{ section_direction }} section section-{{ section.direction }} {{ section_tabs }} {{ section_extra_classes }}" style="flex: {{ section.size }} {{ section.size }} 0px;">

                                {% if is_tabbed %}
                                    {# Tabbed section: Show each card as a tab #}
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
                                    {# Default: Show each card #}
                                    {% for card in section.cards %}
                                        {{ render_card(card, class="card-" + section.direction) }}
                                    {% endfor %}
                                {% endif %}
                            </div>
                        {% endfor %}{# page.sections #}
                    </div><!-- page-wrapper -->

                </div><!-- tab-pane -->
            {% endfor %}{# pages #}
        </main><!-- tab-content page-tabs -->

        </div>
        </div>
    </div><!-- #dashboard -->
{%- endblock body_content -%}

{%- block body_footer -%}
{%- endblock body_footer -%}

{%- endblock body -%}
