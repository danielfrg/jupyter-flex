{%- extends "base.tpl" -%}

{% macro tags_startswith(tags, char) %}
{% for tag in tags %}
    {% if tag.startswith(char) %}
        {{ tag[1:] | replace("\_", "|?|") |replace("_", " ") | replace("|?|", "_") }}
    {% endif %}
{% endfor %}
{% endmacro %}

{% macro render_cell_card(tag) %}
{% for cell in nb.cells %}
    {% set tags = cell.metadata.get("tags", []) %}
    {% if tag in tags %}
        {% block any_cell scoped %}
        {# The cell Title based on the tag #}
        {% set tag_title = tags_startswith(tags, "#") %}
        {% if tag_title | trim | length %}
            <div class="card-header">{{ tag_title }}</div>
        {% endif %}

        {# The cell content #}
        <div class="card-body">{{ super() }}</div>

        {# The cell footer based on the tag #}
        {% set tag_footer = tags_startswith(tags, "$") %}
        {% if tag_footer | trim | length %}
            <div class="card-footer text-muted">{{ tag_footer }}</div>
        {% endif %}
        {% endblock %}
    {% endif %}
{% endfor %}
{% endmacro %}

{% set params = dict() %}
{% for cell in nb.cells %}
    {% set tags = cell.metadata.get("tags", []) %}
    {% if "parameters" in tags %}
        {{ cell }}
        {% for line in cell["source"].split("\n") %}
            {% if line | trim | length %}
                {{ line }}
                {% if line.split("=") | length == 2 %}
                    {% set key = line.split("=")[0] | trim  %}
                    {% set value = line.split("=")[1] | replace("\\\"", "|?|") | replace("\"", " ") | replace("|?|", "\"") | trim %}
                    {{ key }} ---- {{ value }}
                    {% set _ = params.update( {key: value })  %}
                    {{ params }}
                {% endif %}
            {% endif %}
        {% endfor %}
    {% endif %}
{% endfor %}

{% set nb_title = params["title"] or nb.metadata.get("title", "") or resources["metadata"]["name"] %}

{# this overrides the default behaviour of directly starting the kernel and executing the notebook #}
{% block notebook_execute %}
{% endblock notebook_execute %}

{% block header %}
<head>
    <meta charset="utf-8">
    <title>{{ nb_title }}</title>

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
        Voila is using Jinja's Template.generate method to not render the whole template in one go.
        The current implementation of Jinja will however not yield template snippets if we call a blocks' super()
        Therefore it is important to have the cell loop in the template.
        The issue for Jinja is: https://github.com/pallets/jinja/issues/1044
        #}
        {%- for cell in cell_generator(nb, kernel_id) -%}
            {% set cellloop = loop %}
            <script>
                voila_process({{ cellloop.index }}, {{ cell_count }})
            </script>
            {%- endfor -%}
        {% endwith %}

        </div> <!-- voila_body_loop -->
    {%- endblock body_loop -%}

    {%- block body_content -%}
        <div id="application" style="display: none">
            <nav class="navbar navbar-default navbar-fixed-top">
                <span class="navbar-brand">{{ nb_title }}</span>
            </nav>

            <div class="container-fluid d-flex flex-row dashboard-container">
                <div class="d-flex flex-row section">
                    <div class="card"style="flex: 650 650 0px;">
                        {{ render_cell_card("chart-1") }}
                    </div>
                    <div class="card" style="flex: 350 350 0px;">
                        {{ render_cell_card("chart-2") }}
                    </div>
                </div>
            </div>
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
        </body>
    {%- endblock body_footer -%}

{%- endblock body -%}
