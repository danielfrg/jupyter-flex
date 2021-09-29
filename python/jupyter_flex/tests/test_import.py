import os
import pytest

import jupyter_flex
from jupyter_flex.config import settings


pytestmark = [pytest.mark.nondestructive, pytest.mark.base]


def test_import():

    assert jupyter_flex.__version__ is not None
    assert jupyter_flex.__version__ != "0.0.0"
    assert len(jupyter_flex.__version__) > 0


def test_assets_included():
    nbconvert = os.path.join(settings.templates_dir, "nbconvert")
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

    voila = os.path.join(settings.templates_dir, "voila")
    assert os.path.exists(os.path.join(voila, "404.html"))
    assert os.path.exists(os.path.join(voila, "browser-open.html"))
    assert os.path.exists(os.path.join(voila, "error.html"))
    assert os.path.exists(os.path.join(voila, "index.html.j2"))
    assert os.path.exists(os.path.join(voila, "page.html"))
    assert os.path.exists(os.path.join(voila, "tree.html"))
