# ------------------------------------------------------------------------------
# Monkeypatch

import os
import voila.paths as voila_paths
from jupyter_flex.utils import uncache


from jupyter_flex.config import settings


def monkey_collect_template_paths(
    app_names, template_name='default', prune=False, root_dirs=None
):
    print("MONKEY TEMPLATES")

    original = voila_paths.collect_paths(
        app_names,
        template_name,
        include_root_paths=True,
        prune=prune,
        root_dirs=root_dirs,
    )

    flex_base_templates = os.path.join(settings.templates_dir)
    flex_voila_templates = os.path.join(
        settings.templates_dir, "voila", "flex"
    )
    flex_templates = [flex_base_templates, flex_voila_templates]

    return flex_templates + original


def monkey_collect_static_paths(
    app_names, template_name='default', prune=False, root_dirs=None
):
    original = voila_paths.collect_paths(
        app_names,
        template_name,
        include_root_paths=False,
        prune=prune,
        root_dirs=root_dirs,
        subdir='static',
    )

    flex_static1 = os.path.join(settings.templates_dir, "nbconvert", "flex")
    flex_static2 = os.path.join(
        settings.templates_dir, "nbconvert", "flex", "static"
    )

    flex_static_templates = [flex_static1, flex_static2]

    return flex_static_templates + original


voila_paths.collect_template_paths = monkey_collect_template_paths
voila_paths.collect_static_paths = monkey_collect_static_paths

uncache(["voila.paths"])

# ------------------------------------------------------------------------------

from voila.app import Voila


class JupyterFlex(Voila):
    open_browser = False

    def initialize(self, argv=None):
        super().initialize(argv=argv)

    def setup_template_dirs(self):
        self.voila_configuration.template = "flex"
        super().setup_template_dirs()


uncache(["voila.paths"])

main = JupyterFlex.launch_instance
