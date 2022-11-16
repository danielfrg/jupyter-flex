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


class FlexIllusionistExporter(HTMLExporter):
    # "File -> Download as" menu in the notebook
    export_from_notebook = "Flex Dashboard (Illusionist)"
    extra_template_paths = [settings.templates_dir]
    template_file = "nbconvert/flex/index.html.j2"

    # Add illusionist
    preprocessors = ["illusionist.preprocessor.IllusionistPreprocessor"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.environment.globals["dev_mode"] = settings.dev_mode

    def _init_resources(self, resources):
        resources = super()._init_resources(resources)

        resources["include_external_file"] = include_external_file
        return resources
