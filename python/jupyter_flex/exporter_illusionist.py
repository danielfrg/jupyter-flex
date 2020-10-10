import os

import jinja2
from nbconvert.exporters.html import HTMLExporter
from traitlets import default


try:
    from illusionist.preprocessor import IllusionistPreprocessor
except ImportError:
    IllusionistPreprocessor = False

from .utils import DEV_MODE


@jinja2.contextfunction
def include_external_file(ctx, name):
    """Include a file relative to the notebook"""
    with open(os.path.abspath(name), "r") as f:
        content = f.read()
    return jinja2.Markup(content)


preprocessors = []
if IllusionistPreprocessor:
    preprocessors.append(IllusionistPreprocessor)


class FlexIllusionistExporter(HTMLExporter):
    # "File -> Download as" menu in the notebook
    export_from_notebook = "Flex Dashboard (Illusionist)"

    # Add illusionist (if installed)
    preprocessors = preprocessors

    @default("template_name")
    def _template_name_default(self):
        return "flex"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.environment.globals["dev_mode"] = DEV_MODE

    def _init_resources(self, resources):
        resources = super()._init_resources(resources)

        resources["include_external_file"] = include_external_file
        return resources
