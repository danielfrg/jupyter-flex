{% set new_outputs = [] %}
{% for output in cell.outputs %}
    {% set _ = new_outputs.append(encoded) %}
    {% for key, value in output["data"].items() %}
        {% set encodedValue = value | replace("</script>", "</scr\\ipt>")  %}
        {% set _ = output["data"].update({key: encodedValue}) %}
    {% endfor %}
{% endfor %}
