{% macro render_cell_card(cells, tag) %}
{# Render one cell as a card with optional title and footer #}
{% for cell in cells %}
    {% set tags = cell.metadata.get("tags", []) %}
    {% if tag in tags %}
        {% block any_cell scoped %}
        {# The cell size based on the tag #}
        {% set size = tags_startswith(tags, "size=", 500) | trim %}

        <div class="card" style="flex: {{ size }} {{ size }} 0px;">
            {# The cell Title based on the tag #}
            {% set tag_title = tags_startswith(tags, "#") | trim %}
            {% if tag_title  | length %}
                <div class="card-header">{{ tag_title }}</div>
            {% endif %}

            {# The cell content #}
            <div class="card-body">{{ super() }}</div>

            {# The cell footer based on the tag #}
            {% set tag_footer = tags_startswith(tags, "$") | trim %}
            {% if tag_footer| length %}
                <div class="card-footer text-muted">{{ tag_footer }}</div>
            {% endif %}
        </div>
        {% endblock %}
    {% endif %}
{% endfor %}
{% endmacro %}
