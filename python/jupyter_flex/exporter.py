import base64
import os
import sys
from traitlets import default

import jinja2
from nbconvert.exporters.html import HTMLExporter

from .utils import DEV_MODE


class FlexExporter(HTMLExporter):

    # "File -> Download as" menu in the notebook
    export_from_notebook = "Flex Dashboard"

    @default('template_name')
    def _template_name_default(self):
        return 'flex'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.environment.globals["dev_mode"] = DEV_MODE
