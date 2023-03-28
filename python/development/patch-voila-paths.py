# Ensures that voila can find our templates in editable installs
# It modifies the voila.paths._default_root_dirs to look at the source first
# and then at the default locations.

# If you are seeing this on a virutal environment:
# This file was generated by the jupyter-flex development environment

import voila.paths

templates_path = "@@@TEMPLATE_PATH@@@"

_voila_default_root_dirs = voila.paths._default_root_dirs


def _default_root_dirs():
    root_dirs = _voila_default_root_dirs()
    root_dirs.insert(0, templates_path)
    return root_dirs


voila.paths._default_root_dirs = _default_root_dirs