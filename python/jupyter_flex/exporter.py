import base64
import os
import sys

import jinja2
from nbconvert.exporters.html import HTMLExporter

from .utils import DEV_MODE


try:
    from illusionist.preprocessor import IllusionistPreprocessor
except ImportError:
    IllusionistPreprocessor = None


@jinja2.contextfunction
def include_file(ctx, name):
    """Include a file relative to this file
    """
    env = ctx.environment
    return jinja2.Markup(env.loader.get_source(env, name)[0])


@jinja2.contextfunction
def include_external_file(ctx, name):
    """Include a file relative to the notebook
    """
    with open(os.path.abspath(name), "r") as f:
        content = f.read()
    return jinja2.Markup(content)


@jinja2.contextfunction
def include_external_base64(ctx, name):
    with open(os.path.abspath(name), "rb") as f:
        encoded_string = base64.b64encode(f.read())
    return jinja2.Markup(encoded_string.decode())


preprocessors = []
if IllusionistPreprocessor:
    preprocessors.append(IllusionistPreprocessor)


class FlexExporter(HTMLExporter):

    # "File -> Download as" menu in the notebook
    export_from_notebook = "Flex Dashboard"

    # Add illusionist
    preprocessors = preprocessors

    # We add the Voila installed templates to the paths were jinja looks for templates
    # so we can import flex.j2 and include the static files directly from there
    extra_loaders = [
        jinja2.FileSystemLoader(
            os.path.join(sys.prefix, "share", "jupyter", "voila", "templates", "flex",)
        ),
        jinja2.FileSystemLoader(
            os.path.join(
                sys.prefix,
                "share",
                "jupyter",
                "voila",
                "templates",
                "flex",
                "nbconvert_templates",
            )
        ),
    ]

    @property
    def template_path(self):
        """
        Append template intalled to share
        This is compat code until nbconvert 6.0.0 lands
        The structure of the project here is whats 6.0.0 will use
        """
        return super().template_path + [
            os.path.join(
                sys.prefix, "share", "jupyter", "nbconvert", "templates", "flex"
            )
        ]

    def _template_file_default(self):
        """
        We want to use the new template we ship with our library.
        """
        return "index"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.environment.globals["dev_mode"] = DEV_MODE
        self.environment.globals["include_file"] = include_file
        self.environment.globals["include_external_file"] = include_external_file
        self.environment.globals["include_external_base64"] = include_external_base64

    def default_filters(self):
        for pair in super().default_filters():
            yield pair
        yield ("test_filter", self.test_filter)

    def test_filter(self, text):
        return "test_filter: " + text
