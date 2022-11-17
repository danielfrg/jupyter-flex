import os

import jinja2
from nbconvert.exporters.html import HTMLExporter

from jupyter_flex.config import settings


@jinja2.pass_context
def include_external_file(ctx, name):
    """Include a file relative to the notebook"""
    with open(os.path.abspath(name), "r") as f:
        content = f.read()
    return jinja2.utils.Markup(content)


class FlexExporter(HTMLExporter):
    # "File -> Download as" menu in the notebook
    export_from_notebook = "Flex Dashboard"

    @default("template_name")
    def _template_name_default(self):
        return "flex"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.environment.globals["dev_mode"] = settings.dev_mode

    def _init_resources(self, resources):
        resources = super()._init_resources(resources)

        resources["include_external_file"] = include_external_file
        return resources

    # Keeping this just in case
    # def default_filters(self):
    #     for pair in super().default_filters():
    #         yield pair
    #     yield ("echo_filter", self.echo_filter)

    # def echo_filter(self, text):
    #     return "echo_filter: " + text
