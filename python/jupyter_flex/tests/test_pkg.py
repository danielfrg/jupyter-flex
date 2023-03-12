import os
import sys

import jupyter_flex
import pytest
from jupyter_flex.config import settings

pytestmark = [pytest.mark.nondestructive, pytest.mark.pkg]


def test_import():
    assert jupyter_flex.__version__ is not None
    assert jupyter_flex.__version__ != "0.0.0"
    assert len(jupyter_flex.__version__) > 0


def test_assets_included():
    jupyter_dir = os.path.join(sys.prefix, "share", "jupyter")
    nbconvert = os.path.join(jupyter_dir, "nbconvert", "templates", "flex")
    assert os.path.exists(os.path.join(nbconvert, "conf.json"))
    assert os.path.exists(os.path.join(nbconvert, "flex.j2"))
    assert os.path.exists(os.path.join(nbconvert, "index.html.j2"))

    static = os.path.join(nbconvert, "static")
    assert os.path.exists(os.path.join(static, "favicon.png"))
    assert os.path.exists(os.path.join(static, "jupyter-flex-embed.css"))
    assert os.path.exists(os.path.join(static, "jupyter-flex-embed.js"))
    assert os.path.exists(os.path.join(static, "jupyter-flex-embed.js.map"))
    assert os.path.exists(os.path.join(static, "qgrid.js"))
    assert os.path.exists(os.path.join(static, "require.min.js"))

    voila = os.path.join(jupyter_dir, "voila", "templates", "flex")
    assert os.path.exists(os.path.join(voila, "404.html"))
    assert os.path.exists(os.path.join(voila, "browser-open.html"))
    assert os.path.exists(os.path.join(voila, "error.html"))
    assert os.path.exists(os.path.join(voila, "index.html.j2"))
    assert os.path.exists(os.path.join(voila, "page.html"))
    assert os.path.exists(os.path.join(voila, "tree.html"))
