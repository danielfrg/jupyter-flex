import os
import sys
import voila.paths as voila_paths


templates_path = "@@@TEMPLATE_PATH@@@"


def monkey_collect_template_paths(
    app_names, template_name='default', prune=False, root_dirs=None
):
    original = voila_paths.collect_paths(
        app_names,
        template_name,
        include_root_paths=True,
        prune=prune,
        root_dirs=root_dirs,
    )

    flex_voila_templates = os.path.join(
        templates_path, "voila", "flex"
    )
    flex_templates = [templates_path, flex_voila_templates]

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

    flex_static1 = os.path.join(templates_path, "nbconvert", "flex")
    flex_static2 = os.path.join(
        templates_path, "nbconvert", "flex", "static"
    )

    flex_static_templates = [flex_static1, flex_static2]

    return flex_static_templates + original


def patch_editable_paths():
    voila_paths.collect_template_paths = monkey_collect_template_paths
    voila_paths.collect_static_paths = monkey_collect_static_paths
