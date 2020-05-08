import pytest


pytestmark = [pytest.mark.nondestructive]


def test_import():
    import jupyter_flex

    assert jupyter_flex.__version__ is not None
    assert jupyter_flex.__version__ != "0.0.0"
    assert len(jupyter_flex.__version__) > 0
