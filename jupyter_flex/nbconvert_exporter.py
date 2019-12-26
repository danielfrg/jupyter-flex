import os
import os.path

import jinja2
from traitlets.config import Config
from nbconvert.exporters.html import HTMLExporter


@jinja2.contextfunction
def include_file(ctx, name):
    env = ctx.environment
    return jinja2.Markup(env.loader.get_source(env, name)[0])


class NBConvertFlexExporter(HTMLExporter):

    # "File -> Download as" menu in the notebook
    export_from_notebook = "Flex Dashboard"

    extra_loaders = [jinja2.PackageLoader(__name__, "")]

    @property
    def template_path(self):
        """
        Append nbconvert_templates to the default HTML ones we are extending
        """
        return super().template_path + [os.path.join(os.path.dirname(__file__), "nbconvert_templates")]

    def _template_file_default(self):
        """
        We want to use the new template we ship with our library.
        """
        return 'nbconvert' # full

    def __init__(self, *args, **kwargs):
        super(HTMLExporter, self).__init__(*args, **kwargs)
        self.environment.globals['include_file'] = include_file

    def default_filters(self):
        for pair in super(HTMLExporter, self).default_filters():
            yield pair
        yield ('test_filter', self.test_filter)

    def test_filter(self, text):
        return "test_filter: " + text
